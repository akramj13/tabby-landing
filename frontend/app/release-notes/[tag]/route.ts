// Route Handler that returns a self-contained HTML page for one release tag.
//
// Sparkle's update alert embeds a WKWebView that loads the URL in
// `<sparkle:releaseNotesLink>` from the appcast. The alert window is small
// (~460px) and short-lived, so this route deliberately bypasses the rest of
// the site: no root layout, no DM_Sans, no Vercel Analytics, no client React.
// Just one HTML document with an inline stylesheet. Route Handlers in Next.js
// do not inherit `app/layout.tsx`, which is exactly what we want here.
//
// The companion human-facing page at `/release-notes` (the index) is unchanged.

import { GITHUB_URL } from "../../lib/site";

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  published_at: string;
  body: string | null;
  prerelease: boolean;
  html_url: string;
};

const REPO = "fujacob/tabby";

/// Accept both `v1.2.3` and `1.2.3` because the appcast template uses the raw
/// git tag (`vX.Y.Z`) but a future caller might pass the SemVer string.
function normalizeTag(raw: string): string {
  const decoded = decodeURIComponent(raw);
  return decoded.startsWith("v") ? decoded : `v${decoded}`;
}

async function fetchRelease(tag: string): Promise<GitHubRelease | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `token ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/tags/${encodeURIComponent(tag)}`,
      // Revalidate every 5 minutes. Sparkle hits this once per "Check for
      // Updates" click; edge cache + GITHUB_TOKEN keep us well under the
      // unauth 60/hr limit. SWR keeps stale responses serving if GitHub blips.
      { headers, next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as GitHubRelease;
  } catch {
    return null;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/// Inline transforms: escape first, then re-introduce a small allowlist of
/// patterns. Same conventions as the public release-notes page so users see
/// the same content shape in either view.
function inlineMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(
      /@([\w-]+)/g,
      '<a href="https://github.com/$1" target="_blank" rel="noopener noreferrer">@$1</a>',
    );
}

/// Tiny block renderer for the subset of Markdown GitHub release bodies use in
/// practice: `## headers`, `*` / `-` bullets, and paragraphs. Anything richer
/// (code fences, tables, images) falls through as plain paragraphs — acceptable
/// for a small Sparkle window and avoids pulling in a full markdown dependency.
function renderBody(markdown: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    out.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`);
    listItems = [];
  };

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (trimmed.startsWith("## ")) {
      flushList();
      out.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      listItems.push(inlineMarkdown(trimmed.slice(2)));
    } else if (trimmed.length > 0) {
      flushList();
      out.push(`<p>${inlineMarkdown(trimmed)}</p>`);
    }
  }
  flushList();
  return out.join("");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/// Inline stylesheet kept short so the entire response is a single document.
/// Targets a ~460px Sparkle alert window with a system font stack (no Google
/// Fonts round-trip) and `prefers-color-scheme: dark` parity with the host app.
const STYLES = `
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 20px 22px 28px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    line-height: 1.55;
    color: #1d1d1f;
    background: #ffffff;
  }
  header { margin-bottom: 14px; }
  h1 {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .meta {
    margin: 0;
    font-size: 11px;
    color: #6e6e73;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  main { display: grid; gap: 10px; }
  h2 {
    margin: 14px 0 2px;
    font-size: 13px;
    font-weight: 600;
  }
  p { margin: 0; }
  ul { margin: 0; padding-left: 20px; }
  li { margin-bottom: 4px; }
  a { color: #0a84ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  strong { font-weight: 600; }
  .footer {
    margin-top: 18px;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 11px;
    color: #6e6e73;
  }
  @media (prefers-color-scheme: dark) {
    body { color: #f5f5f7; background: #1d1d1f; }
    .meta, .footer { color: #98989d; }
    .footer { border-top-color: rgba(255, 255, 255, 0.1); }
    a { color: #2997ff; }
  }
`;

function renderPage(tag: string, release: GitHubRelease | null): string {
  const safeTag = escapeHtml(tag);
  if (!release) {
    // Always give the user a way out. Sparkle will show whatever HTML we
    // return, including a dead-end — so we link to GitHub Releases so they
    // can at least read the notes manually.
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${safeTag} · Cotabby</title>
<style>${STYLES}</style>
</head>
<body>
<header>
  <h1>${safeTag}</h1>
  <p class="meta">Release notes unavailable</p>
</header>
<main>
  <p>We couldn't load the notes for this release right now. You can read them on <a href="${GITHUB_URL}/releases" target="_blank" rel="noopener noreferrer">GitHub Releases</a>.</p>
</main>
</body>
</html>`;
  }

  const bodyHtml = release.body ? renderBody(release.body) : "<p>No release notes were published for this version.</p>";
  const labelExtras: string[] = [];
  if (release.prerelease) labelExtras.push("Pre-release");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(release.tag_name)} · Cotabby</title>
<style>${STYLES}</style>
</head>
<body>
<header>
  <h1>${escapeHtml(release.tag_name)}</h1>
  <p class="meta">${escapeHtml(formatDate(release.published_at))}${labelExtras.length ? ` · ${labelExtras.map(escapeHtml).join(" · ")}` : ""}</p>
</header>
<main>${bodyHtml}</main>
<p class="footer">View on <a href="${escapeHtml(release.html_url)}" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
</body>
</html>`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tag: string }> },
) {
  const { tag: rawTag } = await params;
  const tag = normalizeTag(rawTag);
  const release = await fetchRelease(tag);
  const html = renderPage(tag, release);
  return new Response(html, {
    status: release ? 200 : 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Vercel edge caches successful responses for 5 minutes and serves stale
      // for a day if revalidation fails. Failure responses use a short TTL so a
      // transient 404 from GitHub doesn't get pinned for hours.
      "Cache-Control": release
        ? "public, s-maxage=300, stale-while-revalidate=86400"
        : "public, s-maxage=30, stale-while-revalidate=300",
    },
  });
}
