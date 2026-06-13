"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Bug,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  GripVertical,
  HardDrive,
  Laptop,
  Lightbulb,
  ListOrdered,
  MessageSquare,
  Monitor,
  Package,
  Plus,
  Sparkles,
  Sparkle,
  Target,
  Type as TypeIcon,
  X,
} from "lucide-react";
import { GithubIcon } from "@/app/components/ui/icons";
import { IconTile } from "@/app/components/ui/icon-tile";
import { TabbyButton } from "@/app/components/ui/tabby-button";
import { TabbyPanel } from "@/app/components/ui/tabby-panel";
import { createScreenshotUploadUrls, submitFeedback } from "./action";
import { getSupabase } from "@/app/lib/supabase";
import {
  ALLOWED_IMAGE_TYPES,
  FEEDBACK_BUCKET,
  FEEDBACK_RATE_LIMIT_STORAGE_KEY,
  formatFeedbackRateLimitWait,
  getFeedbackRateLimitWaitMs,
  MAX_SCREENSHOTS,
  MAX_SCREENSHOT_BYTES,
  RECAPTCHA_FEEDBACK_ACTION,
} from "@/app/lib/feedback";

import {
  CATEGORIES,
  FieldLabel,
  freshSteps,
  inputClass,
  newStepId,
  readPrefilledEnvironment,
  readPrefilledType,
  STEP_PLACEHOLDERS,
  textareaClass,
  type FeedbackType,
  type Screenshot,
  type Step,
} from "./feedback-form-utils";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const recaptchaScriptSrc = recaptchaSiteKey
  ? `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`
  : undefined;

type RecaptchaClient = {
  ready: (callback: () => void) => void;
  execute: (
    siteKey: string,
    options: { action: string },
  ) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaClient;
  }
}

async function createRecaptchaToken(): Promise<
  { success: true; token: string } | { success: false; error: string }
> {
  if (!recaptchaSiteKey) {
    return {
      success: false,
      error: "Feedback protection is not configured.",
    };
  }

  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) {
    return {
      success: false,
      error: "Feedback protection is still loading. Please try again.",
    };
  }

  try {
    const token = await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(recaptchaSiteKey, { action: RECAPTCHA_FEEDBACK_ACTION })
          .then(resolve)
          .catch(reject);
      });
    });
    return { success: true, token };
  } catch {
    return {
      success: false,
      error: "Could not verify this submission. Please try again.",
    };
  }
}

export function FeedbackForm() {
  // `useMemo` keeps the URL read out of the render loop without forcing a state setup. The
  // `?type=` param can flip the initial Bug/Feature toggle so a "Suggest a feature" entry point
  // from the desktop app lands the user on the right form.
  const initialEnvironment = useMemo(readPrefilledEnvironment, []);
  const initialType = useMemo(readPrefilledType, []);
  const hasPrefilledEnvironment = Object.keys(initialEnvironment).length > 0;

  const [type, setType] = useState<FeedbackType>(initialType ?? "bug");
  const [categories, setCategories] = useState<string[]>([]);
  const [appVersion, setAppVersion] = useState(initialEnvironment.appVersion ?? "");
  const [macosVersion, setMacosVersion] = useState(initialEnvironment.macosVersion ?? "");
  const [model, setModel] = useState(initialEnvironment.model ?? "");
  const [chip, setChip] = useState(initialEnvironment.chip ?? "");
  const [memoryGB, setMemoryGB] = useState(initialEnvironment.memoryGB ?? "");
  const [pending, startTransition] = useTransition();
  const [phase, setPhase] = useState<
    "idle" | "verifying" | "uploading" | "submitting"
  >("idle");
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>(freshSteps);
  const [dragId, setDragId] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    issueUrl?: string;
  } | null>(null);

  // Revoke any leftover object URLs when the form unmounts.
  const screenshotsRef = useRef(screenshots);
  useEffect(() => {
    screenshotsRef.current = screenshots;
  }, [screenshots]);
  useEffect(() => {
    return () => {
      screenshotsRef.current.forEach((s) => URL.revokeObjectURL(s.previewUrl));
    };
  }, []);

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const room = MAX_SCREENSHOTS - screenshots.length;
    const accepted: Screenshot[] = [];
    let error: string | null = null;

    for (const file of Array.from(fileList)) {
      if (accepted.length >= room) {
        error = `You can attach at most ${MAX_SCREENSHOTS} screenshots.`;
        break;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        error = "Only PNG, JPEG, GIF, or WebP images are allowed.";
        continue;
      }
      if (file.size > MAX_SCREENSHOT_BYTES) {
        error = "Each image must be 5 MB or smaller.";
        continue;
      }
      accepted.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    if (accepted.length > 0) setScreenshots((prev) => [...prev, ...accepted]);
    setFileError(error);
  }

  function removeScreenshot(previewUrl: string) {
    URL.revokeObjectURL(previewUrl);
    setScreenshots((prev) => prev.filter((s) => s.previewUrl !== previewUrl));
    setFileError(null);
  }

  function updateStep(id: string, value: string) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  }

  function removeStep(id: string) {
    setSteps((prev) =>
      prev.length > 1 ? prev.filter((s) => s.id !== id) : prev,
    );
  }

  function addStep() {
    const id = newStepId();
    setSteps((prev) => [...prev, { id, value: "" }]);
    requestAnimationFrame(() => focusStep(id));
  }

  function insertStepAfter(afterId: string) {
    const id = newStepId();
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === afterId);
      if (idx === -1) return [...prev, { id, value: "" }];
      const next = [...prev];
      next.splice(idx + 1, 0, { id, value: "" });
      return next;
    });
    requestAnimationFrame(() => focusStep(id));
  }

  function focusStep(id: string) {
    const el = document.querySelector<HTMLInputElement>(
      `[data-step-id="${id}"]`,
    );
    el?.focus();
  }

  function handleStepKeyDown(
    id: string,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      insertStepAfter(id);
    }
  }

  function moveStep(id: string, direction: -1 | 1) {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const target = idx + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function handleDragStart(id: string, e: React.DragEvent<HTMLDivElement>) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(id: string, e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!dragId || dragId === id) return;
    setSteps((prev) => {
      const from = prev.findIndex((s) => s.id === dragId);
      const to = prev.findIndex((s) => s.id === id);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function handleDragEnd() {
    setDragId(null);
  }

  const stepsCombined = steps
    .map((s) => s.value.trim())
    .filter(Boolean)
    .map((value, i) => `${i + 1}. ${value}`)
    .join("\n");

  async function uploadScreenshots(): Promise<
    { ok: true; paths: string[] } | { ok: false; error: string }
  > {
    const uploadRes = await createScreenshotUploadUrls(
      screenshots.map((s) => ({
        name: s.file.name,
        type: s.file.type,
        size: s.file.size,
      })),
    );
    if (!uploadRes.success) return { ok: false, error: uploadRes.error };

    const supabase = getSupabase();
    try {
      await Promise.all(
        uploadRes.uploads.map(({ path, token }, i) =>
          supabase.storage
            .from(FEEDBACK_BUCKET)
            .uploadToSignedUrl(path, token, screenshots[i].file, {
              contentType: screenshots[i].file.type,
            })
            .then(({ error }) => {
              if (error) throw error;
            }),
        ),
      );
    } catch {
      return { ok: false, error: "Failed to upload screenshots. Please try again." };
    }
    return { ok: true, paths: uploadRes.uploads.map((u) => u.path) };
  }

  function handleSubmit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const lastSubmittedAtMs = Number(
        window.localStorage.getItem(FEEDBACK_RATE_LIMIT_STORAGE_KEY),
      );
      const rateLimitWaitMs = getFeedbackRateLimitWaitMs(
        lastSubmittedAtMs,
        Date.now(),
      );
      if (rateLimitWaitMs > 0) {
        setResult({
          success: false,
          message: `Please wait ${formatFeedbackRateLimitWait(rateLimitWaitMs)} before submitting feedback again.`,
        });
        return;
      }

      setPhase("verifying");
      const recaptcha = await createRecaptchaToken();
      if (!recaptcha.success) {
        setPhase("idle");
        setResult({ success: false, message: recaptcha.error });
        return;
      }

      let screenshotPaths: string[] | undefined;
      if (screenshots.length > 0) {
        setPhase("uploading");
        const uploaded = await uploadScreenshots();
        if (!uploaded.ok) {
          setPhase("idle");
          setResult({ success: false, message: uploaded.error });
          return;
        }
        screenshotPaths = uploaded.paths;
      }

      setPhase("submitting");
      const res = await submitFeedback({
        type,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        stepsToReproduce: (formData.get("steps") as string) || undefined,
        expectedBehavior: (formData.get("expected") as string) || undefined,
        appVersion: appVersion.trim() || undefined,
        macosVersion: macosVersion.trim() || undefined,
        model: model.trim() || undefined,
        chip: chip.trim() || undefined,
        memoryGB: memoryGB.trim() || undefined,
        screenshotPaths,
        categories: categories.length > 0 ? categories : undefined,
        recaptchaToken: recaptcha.token,
      });
      setPhase("idle");

      if (res.success) {
        window.localStorage.setItem(
          FEEDBACK_RATE_LIMIT_STORAGE_KEY,
          String(Date.now()),
        );
        screenshots.forEach((s) => URL.revokeObjectURL(s.previewUrl));
        setScreenshots([]);
        setSteps(freshSteps());
        setCategories([]);
        setFileError(null);
        setResult({
          success: true,
          message: "Thanks! Your feedback has been submitted.",
          issueUrl: res.issueUrl,
        });
      } else {
        setResult({ success: false, message: res.error });
      }
    });
  }

  const submitLabel =
    phase === "verifying"
      ? "Verifying..."
      : phase === "uploading"
      ? "Uploading screenshots..."
      : pending
        ? "Submitting..."
        : type === "bug"
          ? "Submit Bug Report"
          : "Submit Feature Request";

  // Success state — show a celebratory card with a prominent GitHub link.
  if (result?.success) {
    return (
      <TabbyPanel size="2xl" tone="bg-surface-2" className="mt-8 p-8 text-center sm:p-10">
        <IconTile size="2xl" tone="bg-accent-blue/15 mx-auto">
          <CheckCircle2 className="h-9 w-9 text-ink" strokeWidth={2} />
        </IconTile>
        <h3 className="tabby-display mt-5 text-[2rem] leading-tight text-ink sm:text-[2.4rem]">
          thanks for sending this in!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          {result.issueUrl
            ? "We've opened a GitHub issue for it. Star or subscribe to follow updates and chime in with more details if anything changes."
            : result.message}
        </p>

        {result.issueUrl && (
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <TabbyButton
              href={result.issueUrl}
              external
              variant="secondary"
              size="sm"
              icon={<GithubIcon className="h-5 w-5" />}
              iconRight={<ExternalLink className="h-4 w-4" strokeWidth={2.25} />}
            >
              View issue on GitHub
            </TabbyButton>
            <TabbyButton
              variant="primary"
              size="sm"
              onClick={() => setResult(null)}
            >
              Send another
            </TabbyButton>
          </div>
        )}
      </TabbyPanel>
    );
  }

  return (
    <>
      {recaptchaScriptSrc && (
        <Script src={recaptchaScriptSrc} strategy="afterInteractive" />
      )}
      <form action={handleSubmit} className="mt-8 space-y-5">
      {/* Type toggle */}
      <fieldset className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setType("bug")}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold tracking-tight transition sm:text-base ${
            type === "bug"
              ? "border-line bg-surface-4 text-ink shadow-tabby-xs"
              : "border-line-soft bg-surface-2 text-muted hover:border-line hover:text-ink"
          }`}
        >
          <Bug className="h-4 w-4" strokeWidth={2.25} />
          Bug Report
        </button>
        <button
          type="button"
          onClick={() => setType("feature")}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold tracking-tight transition sm:text-base ${
            type === "feature"
              ? "border-line bg-surface-4 text-ink shadow-tabby-xs"
              : "border-line-soft bg-surface-2 text-muted hover:border-line hover:text-ink"
          }`}
        >
          <Lightbulb className="h-4 w-4" strokeWidth={2.25} />
          Feature Request
        </button>
      </fieldset>

      {/* Category (bug only) */}
      {type === "bug" && (
        <div>
          <FieldLabel>
            Category{" "}
            <span className="font-medium text-subtle">(optional)</span>
          </FieldLabel>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const selected = categories.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setCategories((prev) =>
                      selected
                        ? prev.filter((c) => c !== cat.value)
                        : [...prev, cat.value],
                    )
                  }
                  title={cat.description}
                  className={`flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-bold tracking-tight transition sm:text-sm ${
                    selected
                      ? "border-line bg-surface-4 text-ink shadow-tabby-xs"
                      : "border-line-soft bg-surface-2 text-muted hover:border-line hover:text-ink"
                  }`}
                >
                  {selected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <FieldLabel icon={TypeIcon} htmlFor="title" required>
          Title
        </FieldLabel>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder={
            type === "bug"
              ? "e.g. Suggestions don't appear in Notes"
              : "e.g. Support for custom keyboard shortcuts"
          }
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <FieldLabel icon={MessageSquare} htmlFor="description" required>
          Description
        </FieldLabel>
        <textarea
          id="description"
          name="description"
          required
          placeholder={
            type === "bug"
              ? "What happened? Be as specific as you can."
              : "Describe the feature you'd like to see."
          }
          className={textareaClass}
        />
      </div>

      {/* Bug-specific fields */}
      {type === "bug" && (
        <>
          <div>
            <FieldLabel icon={ListOrdered}>Steps to Reproduce</FieldLabel>
            <div className="space-y-2">
              {steps.map((step, idx) => {
                const isDragging = dragId === step.id;
                return (
                  <div
                    key={step.id}
                    draggable
                    onDragStart={(e) => handleDragStart(step.id, e)}
                    onDragOver={(e) => handleDragOver(step.id, e)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-1.5 rounded-xl border-2 transition ${
                      isDragging
                        ? "border-line bg-surface-3 opacity-60"
                        : "border-line-soft bg-surface-2 hover:border-line/60"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-7 shrink-0 cursor-grab place-items-center text-subtle transition-colors hover:text-ink active:cursor-grabbing"
                      title="Drag to reorder"
                    >
                      <GripVertical className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 border-line-soft bg-surface text-xs font-bold text-ink">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      data-step-id={step.id}
                      value={step.value}
                      onChange={(e) => updateStep(step.id, e.target.value)}
                      onKeyDown={(e) => handleStepKeyDown(step.id, e)}
                      placeholder={
                        STEP_PLACEHOLDERS[idx] ?? "What happens next?"
                      }
                      className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm font-semibold tracking-tight text-ink placeholder:text-subtle/60 focus:outline-none sm:text-base"
                    />
                    <div className="flex shrink-0 items-center gap-0.5 pr-1.5">
                      <button
                        type="button"
                        onClick={() => moveStep(step.id, -1)}
                        disabled={idx === 0}
                        aria-label={`Move step ${idx + 1} up`}
                        className="grid h-7 w-7 place-items-center rounded-md text-subtle transition-colors hover:bg-surface-3 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronUp className="h-4 w-4" strokeWidth={2.25} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(step.id, 1)}
                        disabled={idx === steps.length - 1}
                        aria-label={`Move step ${idx + 1} down`}
                        className="grid h-7 w-7 place-items-center rounded-md text-subtle transition-colors hover:bg-surface-3 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        disabled={steps.length === 1}
                        aria-label={`Remove step ${idx + 1}`}
                        className="grid h-7 w-7 place-items-center rounded-md text-subtle transition-colors hover:bg-accent/15 hover:text-accent disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-subtle"
                      >
                        <X className="h-4 w-4" strokeWidth={2.25} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl border-2 border-dashed border-line-soft bg-surface-2 px-3 py-2 text-xs font-bold tracking-tight text-muted transition hover:border-line hover:text-ink sm:text-sm"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Add step
            </button>
            <input type="hidden" name="steps" value={stepsCombined} />
          </div>

          <div>
            <FieldLabel icon={Target} htmlFor="expected">
              Expected Behavior
            </FieldLabel>
            <textarea
              id="expected"
              name="expected"
              placeholder="What did you expect to happen?"
              className={textareaClass}
            />
          </div>

        </>
      )}

      {/* Environment — shown for bugs unconditionally (with version required), and for feature
          requests only when the desktop app already pre-filled the data so we never make a
          curious feature submitter fill in hardware details by hand. */}
      {(type === "bug" || hasPrefilledEnvironment) && (
        <div className="space-y-3 rounded-2xl border-2 border-line-soft bg-surface-2 p-4 sm:p-5">
          {hasPrefilledEnvironment && (
            <div className="flex items-start gap-2 rounded-xl border-2 border-line-soft bg-surface px-3 py-2 text-xs font-semibold tracking-tight text-muted sm:text-sm">
              <Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
              <span>
                Environment auto-filled from your device. Edit anything that looks wrong.
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <FieldLabel icon={Package} htmlFor="appVersion" required={type === "bug"}>
                Cotabby Version
              </FieldLabel>
              <input
                id="appVersion"
                name="appVersion"
                type="text"
                required={type === "bug"}
                value={appVersion}
                onChange={(e) => setAppVersion(e.target.value)}
                placeholder="e.g. 0.4.2"
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <FieldLabel icon={Monitor} htmlFor="macosVersion">
                macOS Version
              </FieldLabel>
              <input
                id="macosVersion"
                name="macosVersion"
                type="text"
                value={macosVersion}
                onChange={(e) => setMacosVersion(e.target.value)}
                placeholder="e.g. 15.5"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <FieldLabel icon={Laptop} htmlFor="model">
                Mac Model{" "}
                <span className="font-medium text-subtle">(optional)</span>
              </FieldLabel>
              <input
                id="model"
                name="model"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. MacBookPro18,1"
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <FieldLabel icon={Cpu} htmlFor="chip">
                Chip{" "}
                <span className="font-medium text-subtle">(optional)</span>
              </FieldLabel>
              <input
                id="chip"
                name="chip"
                type="text"
                value={chip}
                onChange={(e) => setChip(e.target.value)}
                placeholder="e.g. Apple M1 Pro"
                className={inputClass}
              />
            </div>
            <div className="sm:w-32">
              <FieldLabel icon={HardDrive} htmlFor="memoryGB">
                Memory{" "}
                <span className="font-medium text-subtle">(GB)</span>
              </FieldLabel>
              <input
                id="memoryGB"
                name="memoryGB"
                type="text"
                inputMode="numeric"
                value={memoryGB}
                onChange={(e) => setMemoryGB(e.target.value)}
                placeholder="e.g. 16"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* Feature-specific field */}
      {type === "feature" && (
        <div>
          <FieldLabel icon={Sparkles} htmlFor="expected">
            Use Case
          </FieldLabel>
          <textarea
            id="expected"
            name="expected"
            placeholder="How would this help your workflow?"
            className={textareaClass}
          />
        </div>
      )}

      {/* Screenshots */}
      <div>
        <FieldLabel icon={Camera}>
          Screenshots{" "}
          <span className="font-medium text-subtle">(optional)</span>
        </FieldLabel>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {screenshots.map((s) => (
            <div
              key={s.previewUrl}
              className="group relative aspect-square overflow-hidden rounded-xl border-2 border-line-soft bg-surface-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.previewUrl}
                alt={s.file.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeScreenshot(s.previewUrl)}
                disabled={pending}
                aria-label={`Remove ${s.file.name}`}
                className="absolute right-1.5 top-1.5 transition disabled:opacity-50"
              >
                <IconTile size="2xs" tone="bg-surface text-ink hover:bg-surface-4">
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </IconTile>
              </button>
            </div>
          ))}

          {screenshots.length < MAX_SCREENSHOTS && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line-soft bg-surface-2 text-subtle transition hover:border-line hover:text-ink focus-within:border-line">
              <input
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                multiple
                disabled={pending}
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
                className="sr-only"
              />
              <Plus className="h-5 w-5" strokeWidth={2.25} />
              <span className="text-xs font-bold tracking-tight">Add</span>
            </label>
          )}
        </div>
        <p className="mt-1.5 text-xs font-medium tracking-tight text-subtle">
          PNG, JPEG, GIF, or WebP · up to {MAX_SCREENSHOTS} images · 5 MB each
        </p>
        {fileError && (
          <p className="mt-1.5 text-xs font-semibold tracking-tight text-accent">
            {fileError}
          </p>
        )}
      </div>

      {/* Error message */}
      {result && !result.success && (
        <div className="rounded-xl border-2 border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold tracking-tight text-ink">
          {result.message}
        </div>
      )}

      {/* Submit */}
      <TabbyButton
        type="submit"
        disabled={pending}
        variant="primary"
        size="sm"
        className="disabled:opacity-50"
        icon={
          type === "bug" ? (
            <Bug className="h-4 w-4" strokeWidth={2.25} />
          ) : (
            <Lightbulb className="h-4 w-4" strokeWidth={2.25} />
          )
        }
      >
        {submitLabel}
      </TabbyButton>
      </form>
    </>
  );
}
