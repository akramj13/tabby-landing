// Shared between the feedback form (client) and its server action.
// Kept out of action.ts because a "use server" module can only export
// async functions.

export const FEEDBACK_BUCKET = "feedback-screenshots";

export const MAX_SCREENSHOTS = 4;
// 5 MB. Must match the bucket's fileSizeLimit in scripts/setup-feedback-bucket.mjs
// so client-side validation and the bucket's hard limit agree exactly.
export const MAX_SCREENSHOT_BYTES = 5_000_000;

export const FEEDBACK_RATE_LIMIT_COOKIE = "tabby_feedback_submitted_at";
export const FEEDBACK_RATE_LIMIT_STORAGE_KEY = "tabby.feedback.submittedAt";
export const FEEDBACK_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RECAPTCHA_FEEDBACK_ACTION = "feedback_submit";
export const RECAPTCHA_DEFAULT_SCORE_THRESHOLD = 0.5;

// Allowed image MIME types mapped to the extension we store them under.
export const IMAGE_TYPE_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

export const ALLOWED_IMAGE_TYPES = Object.keys(IMAGE_TYPE_EXTENSIONS);

// Storage paths the client sends back after uploading: "<uuid>.<ext>".
// The server only embeds paths matching this, so the form can't be used to
// inject arbitrary image URLs into the issues we create.
export const SCREENSHOT_PATH_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpe?g|gif|webp)$/;

export function getFeedbackRateLimitWaitMs(
  lastSubmittedAtMs: number,
  nowMs: number,
): number {
  if (!Number.isFinite(lastSubmittedAtMs) || lastSubmittedAtMs <= 0) {
    return 0;
  }
  return Math.max(0, FEEDBACK_RATE_LIMIT_WINDOW_MS - (nowMs - lastSubmittedAtMs));
}

export function formatFeedbackRateLimitWait(waitMs: number): string {
  const minutes = Math.max(1, Math.ceil(waitMs / 60_000));
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export function parseRecaptchaScoreThreshold(value?: string): number {
  if (!value?.trim()) {
    return RECAPTCHA_DEFAULT_SCORE_THRESHOLD;
  }
  const threshold = Number(value);
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    return RECAPTCHA_DEFAULT_SCORE_THRESHOLD;
  }
  return threshold;
}
