"use server";

import { cookies } from "next/headers";
import {
  ALLOWED_IMAGE_TYPES,
  FEEDBACK_BUCKET,
  FEEDBACK_RATE_LIMIT_COOKIE,
  FEEDBACK_RATE_LIMIT_WINDOW_MS,
  formatFeedbackRateLimitWait,
  getFeedbackRateLimitWaitMs,
  IMAGE_TYPE_EXTENSIONS,
  MAX_SCREENSHOTS,
  MAX_SCREENSHOT_BYTES,
  SCREENSHOT_PATH_RE,
} from "@/app/lib/feedback";
import { getSupabaseAdmin } from "@/app/lib/supabase-admin";
import { GITHUB_REPO } from "@/app/lib/site";

type FeedbackType = "bug" | "feature";

type FeedbackPayload = {
  type: FeedbackType;
  title: string;
  description: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  appVersion?: string;
  macosVersion?: string;
  model?: string;
  chip?: string;
  memoryGB?: string;
  screenshotPaths?: string[];
  categories?: string[];
};

type ActionResult =
  | { success: true; issueUrl: string }
  | { success: false; error: string };

type UploadFileMeta = { name: string; type: string; size: number };
type UploadTarget = { path: string; token: string };
type UploadUrlsResult =
  | { success: true; uploads: UploadTarget[] }
  | { success: false; error: string };

// Hands the browser one signed upload URL per file so it can upload directly to
// Supabase Storage (bypassing the function body-size limit). The service-role
// key stays on the server; the returned token authorizes a single upload.
export async function createScreenshotUploadUrls(
  files: UploadFileMeta[],
): Promise<UploadUrlsResult> {
  if (!Array.isArray(files) || files.length === 0) {
    return { success: false, error: "No files provided." };
  }
  if (files.length > MAX_SCREENSHOTS) {
    return {
      success: false,
      error: `You can attach at most ${MAX_SCREENSHOTS} screenshots.`,
    };
  }
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Only PNG, JPEG, GIF, or WebP images are allowed.",
      };
    }
    if (
      typeof file.size !== "number" ||
      file.size <= 0 ||
      file.size > MAX_SCREENSHOT_BYTES
    ) {
      return { success: false, error: "Each image must be 5 MB or smaller." };
    }
  }

  try {
    const supabase = getSupabaseAdmin();
    const uploads: UploadTarget[] = [];
    for (const file of files) {
      const ext = IMAGE_TYPE_EXTENSIONS[file.type];
      const path = `${crypto.randomUUID()}.${ext}`;
      const { data, error } = await supabase.storage
        .from(FEEDBACK_BUCKET)
        .createSignedUploadUrl(path);
      if (error || !data) {
        return {
          success: false,
          error: "Could not prepare the upload. Please try again.",
        };
      }
      uploads.push({ path: data.path, token: data.token });
    }
    return { success: true, uploads };
  } catch {
    return {
      success: false,
      error: "Screenshot uploads are temporarily unavailable.",
    };
  }
}

// Resolves the public URLs for already-uploaded screenshots and renders them as
// inline markdown. Only paths matching the expected "<uuid>.<ext>" shape are
// embedded, so the form can't be abused to inject arbitrary image URLs.
function buildScreenshotsSection(paths?: string[]): string {
  if (!paths || paths.length === 0) return "";
  const supabase = getSupabaseAdmin();
  const urls = paths
    .filter((path) => SCREENSHOT_PATH_RE.test(path))
    .slice(0, MAX_SCREENSHOTS)
    .map(
      (path) =>
        supabase.storage.from(FEEDBACK_BUCKET).getPublicUrl(path).data
          .publicUrl,
    );
  if (urls.length === 0) return "";
  const images = urls
    .map((url, i) => `![screenshot ${i + 1}](${url})`)
    .join("\n");
  return `### Screenshots\n${images}\n\n`;
}

function buildBugBody(data: FeedbackPayload): string {
  let body = `## Bug Report\n\n`;
  body += `### Description\n${data.description}\n\n`;
  if (data.stepsToReproduce) {
    body += `### Steps to Reproduce\n${data.stepsToReproduce}\n\n`;
  }
  if (data.expectedBehavior) {
    body += `### Expected Behavior\n${data.expectedBehavior}\n\n`;
  }
  body += buildEnvironmentSection(data);
  body += buildScreenshotsSection(data.screenshotPaths);
  body += `---\n*Submitted via tabby feedback form*`;
  return body;
}

function buildFeatureBody(data: FeedbackPayload): string {
  let body = `## Feature Request\n\n`;
  body += `### Description\n${data.description}\n\n`;
  if (data.expectedBehavior) {
    body += `### Use Case\n${data.expectedBehavior}\n\n`;
  }
  body += buildEnvironmentSection(data);
  body += buildScreenshotsSection(data.screenshotPaths);
  body += `---\n*Submitted via tabby feedback form*`;
  return body;
}

// Shared between bug and feature bodies so hardware context lands on every issue when the user
// came in from the desktop app (and is silently omitted otherwise).
function buildEnvironmentSection(data: FeedbackPayload): string {
  const lines: string[] = [];
  if (data.appVersion) lines.push(`- **Cotabby version:** ${data.appVersion}`);
  if (data.macosVersion) lines.push(`- **macOS version:** ${data.macosVersion}`);
  if (data.model) lines.push(`- **Mac model:** ${data.model}`);
  if (data.chip) lines.push(`- **Chip:** ${data.chip}`);
  if (data.memoryGB) lines.push(`- **Memory:** ${data.memoryGB} GB`);
  if (lines.length === 0) return "";
  return `### Environment\n${lines.join("\n")}\n\n`;
}

export async function submitFeedback(
  data: FeedbackPayload,
): Promise<ActionResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { success: false, error: "Feedback is temporarily unavailable." };
  }

  const title = data.title.trim();
  if (!title) {
    return { success: false, error: "Title is required." };
  }
  if (!data.description.trim()) {
    return { success: false, error: "Description is required." };
  }

  const cookieStore = await cookies();
  const lastSubmittedAtMs = Number(
    cookieStore.get(FEEDBACK_RATE_LIMIT_COOKIE)?.value,
  );
  const rateLimitWaitMs = getFeedbackRateLimitWaitMs(
    lastSubmittedAtMs,
    Date.now(),
  );
  if (rateLimitWaitMs > 0) {
    return {
      success: false,
      error: `Please wait ${formatFeedbackRateLimitWait(rateLimitWaitMs)} before submitting feedback again.`,
    };
  }

  const labels: string[] =
    data.type === "bug" ? ["bug"] : ["enhancement"];
  if (data.type === "bug" && data.categories && data.categories.length > 0) {
    labels.push(...data.categories);
  }
  const body =
    data.type === "bug" ? buildBugBody(data) : buildFeatureBody(data);

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `[${data.type === "bug" ? "Bug" : "Feature Request"}] ${title}`,
        body,
        labels,
      }),
    },
  );

  if (!res.ok) {
    return { success: false, error: "Failed to submit feedback. Please try again." };
  }

  const issue = await res.json();
  cookieStore.set(FEEDBACK_RATE_LIMIT_COOKIE, String(Date.now()), {
    httpOnly: true,
    maxAge: Math.ceil(FEEDBACK_RATE_LIMIT_WINDOW_MS / 1000),
    path: "/feedback",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return { success: true, issueUrl: issue.html_url };
}
