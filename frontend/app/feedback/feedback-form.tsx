"use client";

import { useState, useTransition } from "react";
import { submitFeedback } from "./action";

type FeedbackType = "bug" | "feature";

const inputClass =
  "w-full rounded-xl border-2 border-line-soft bg-surface-2 px-4 py-3 text-sm font-medium tracking-tight text-ink placeholder:text-subtle/60 transition focus:border-line focus:outline-none sm:text-base";

const textareaClass = `${inputClass} min-h-28 resize-y`;

export function FeedbackForm() {
  const [type, setType] = useState<FeedbackType>("bug");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    issueUrl?: string;
  } | null>(null);

  function handleSubmit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const res = await submitFeedback({
        type,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        stepsToReproduce: (formData.get("steps") as string) || undefined,
        expectedBehavior: (formData.get("expected") as string) || undefined,
        appVersion: (formData.get("appVersion") as string) || undefined,
        macosVersion: (formData.get("macosVersion") as string) || undefined,
      });

      if (res.success) {
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

  return (
    <form action={handleSubmit} className="mt-8 space-y-5">
      {/* Type toggle */}
      <fieldset className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("bug")}
          className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold tracking-tight transition sm:text-base ${
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
          className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold tracking-tight transition sm:text-base ${
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
          className="mb-1.5 block text-sm font-semibold tracking-tight text-ink"
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
          className="mb-1.5 block text-sm font-semibold tracking-tight text-ink"
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
              className="mb-1.5 block text-sm font-semibold tracking-tight text-ink"
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
              className="mb-1.5 block text-sm font-semibold tracking-tight text-ink"
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
                className="mb-1.5 block text-sm font-semibold tracking-tight text-ink"
              >
                tabby Version
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
                className="mb-1.5 block text-sm font-semibold tracking-tight text-ink"
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
            className="mb-1.5 block text-sm font-semibold tracking-tight text-ink"
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

      {/* Result message */}
      {result && (
        <div
          className={`rounded-xl border-2 px-4 py-3 text-sm font-medium tracking-tight ${
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
                className="font-semibold underline underline-offset-2 transition-colors hover:text-muted"
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
        className="tabby-button tabby-button-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold tracking-tight disabled:opacity-50 sm:h-14 sm:px-8 sm:text-base"
      >
        {pending ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
