"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createScreenshotUploadUrls, submitFeedback } from "./action";
import { getSupabase } from "../lib/supabase";
import {
  ALLOWED_IMAGE_TYPES,
  FEEDBACK_BUCKET,
  MAX_SCREENSHOTS,
  MAX_SCREENSHOT_BYTES,
} from "../lib/feedback";

type FeedbackType = "bug" | "feature";

type Screenshot = { file: File; previewUrl: string };

const inputClass =
  "w-full rounded-xl border-2 border-line-soft bg-surface-2 px-4 py-3 text-sm font-semibold tracking-tight text-ink placeholder:text-subtle/60 transition focus:border-line focus:outline-none sm:text-base";

const textareaClass = `${inputClass} min-h-28 resize-y`;

export function FeedbackForm() {
  const [type, setType] = useState<FeedbackType>("bug");
  const [pending, startTransition] = useTransition();
  const [phase, setPhase] = useState<"idle" | "uploading" | "submitting">(
    "idle",
  );
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
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
        appVersion: (formData.get("appVersion") as string) || undefined,
        macosVersion: (formData.get("macosVersion") as string) || undefined,
        screenshotPaths,
      });
      setPhase("idle");

      if (res.success) {
        screenshots.forEach((s) => URL.revokeObjectURL(s.previewUrl));
        setScreenshots([]);
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
    phase === "uploading"
      ? "Uploading screenshots..."
      : pending
        ? "Submitting..."
        : "Submit Feedback";

  return (
    <form action={handleSubmit} className="mt-8 space-y-5">
      {/* Type toggle */}
      <fieldset className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("bug")}
          className={`rounded-xl border-2 px-4 py-2 text-sm font-bold tracking-tight transition sm:text-base ${
            type === "bug"
              ? "border-line bg-surface-4 text-ink"
              : "border-line-soft bg-surface-2 text-muted hover:border-line hover:text-ink"
          }`}
        >
          Bug Report
        </button>
        <button
          type="button"
          onClick={() => setType("feature")}
          className={`rounded-xl border-2 px-4 py-2 text-sm font-bold tracking-tight transition sm:text-base ${
            type === "feature"
              ? "border-line bg-surface-4 text-ink"
              : "border-line-soft bg-surface-2 text-muted hover:border-line hover:text-ink"
          }`}
        >
          Feature Request
        </button>
      </fieldset>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-bold tracking-tight text-ink"
        >
          Title <span className="text-accent">*</span>
        </label>
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
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-bold tracking-tight text-ink"
        >
          Description <span className="text-accent">*</span>
        </label>
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
            <label
              htmlFor="steps"
              className="mb-1.5 block text-sm font-bold tracking-tight text-ink"
            >
              Steps to Reproduce
            </label>
            <textarea
              id="steps"
              name="steps"
              placeholder="1. Open app&#10;2. Type in...&#10;3. ..."
              className={textareaClass}
            />
          </div>

          <div>
            <label
              htmlFor="expected"
              className="mb-1.5 block text-sm font-bold tracking-tight text-ink"
            >
              Expected Behavior
            </label>
            <textarea
              id="expected"
              name="expected"
              placeholder="What did you expect to happen?"
              className={textareaClass}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label
                htmlFor="appVersion"
                className="mb-1.5 block text-sm font-bold tracking-tight text-ink"
              >
                Cotabby Version
              </label>
              <input
                id="appVersion"
                name="appVersion"
                type="text"
                placeholder="e.g. 0.4.2"
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="macosVersion"
                className="mb-1.5 block text-sm font-bold tracking-tight text-ink"
              >
                macOS Version
              </label>
              <input
                id="macosVersion"
                name="macosVersion"
                type="text"
                placeholder="e.g. 15.5"
                className={inputClass}
              />
            </div>
          </div>
        </>
      )}

      {/* Feature-specific field */}
      {type === "feature" && (
        <div>
          <label
            htmlFor="expected"
            className="mb-1.5 block text-sm font-bold tracking-tight text-ink"
          >
            Use Case
          </label>
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
        <label className="mb-1.5 block text-sm font-bold tracking-tight text-ink">
          Screenshots{" "}
          <span className="font-medium text-subtle">(optional)</span>
        </label>
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
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-line bg-surface text-base leading-none text-ink shadow-[0_2px_0_var(--line)] transition hover:bg-surface-4 disabled:opacity-50"
              >
                &times;
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
              <span className="text-2xl leading-none">+</span>
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

      {/* Result message */}
      {result && (
        <div
          className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold tracking-tight ${
            result.success
              ? "border-moss/40 bg-moss/10 text-ink"
              : "border-accent/40 bg-accent/10 text-ink"
          }`}
        >
          {result.message}
          {result.issueUrl && (
            <>
              {" "}
              <a
                href={result.issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-2 transition-colors hover:text-muted"
              >
                View on GitHub
              </a>
            </>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="tabby-button tabby-button-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold tracking-tight disabled:opacity-50 sm:h-14 sm:px-8 sm:text-base"
      >
        {submitLabel}
      </button>
    </form>
  );
}
