"use server";

const GITHUB_REPO = "FuJacob/tabby";

type FeedbackType = "bug" | "feature";

type FeedbackPayload = {
  type: FeedbackType;
  title: string;
  description: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  appVersion?: string;
  macosVersion?: string;
};

type ActionResult =
  | { success: true; issueUrl: string }
  | { success: false; error: string };

function buildBugBody(data: FeedbackPayload): string {
  let body = `## Bug Report\n\n`;
  body += `### Description\n${data.description}\n\n`;
  if (data.stepsToReproduce) {
    body += `### Steps to Reproduce\n${data.stepsToReproduce}\n\n`;
  }
  if (data.expectedBehavior) {
    body += `### Expected Behavior\n${data.expectedBehavior}\n\n`;
  }
  if (data.appVersion || data.macosVersion) {
    body += `### Environment\n`;
    if (data.appVersion) body += `- **tabby version:** ${data.appVersion}\n`;
    if (data.macosVersion) body += `- **macOS version:** ${data.macosVersion}\n`;
  }
  body += `\n---\n*Submitted via tabby feedback form*`;
  return body;
}

function buildFeatureBody(data: FeedbackPayload): string {
  let body = `## Feature Request\n\n`;
  body += `### Description\n${data.description}\n\n`;
  if (data.expectedBehavior) {
    body += `### Use Case\n${data.expectedBehavior}\n\n`;
  }
  body += `---\n*Submitted via tabby feedback form*`;
  return body;
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

  const labels =
    data.type === "bug" ? ["bug"] : ["enhancement"];
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
  return { success: true, issueUrl: issue.html_url };
}
