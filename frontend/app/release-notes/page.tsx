import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LegalPageShell } from "../components/legal-page-shell";
import { GITHUB_URL } from "../lib/site";

export const metadata: Metadata = {
  title: "Release Notes - tabby",
  description: "Product updates and release notes for tabby.",
};

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  published_at: string;
  body: string | null;
  prerelease: boolean;
};

const REPO = "fujacob/tabby";
const RELEASES_URL = `${GITHUB_URL}/releases`;

async function fetchReleases(): Promise<GitHubRelease[] | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `token ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=20`,
      { headers, next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReleaseBody({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={key++} className="list-disc space-y-1.5 pl-5">
        {listItems.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
        ))}
      </ul>,
    );
    listItems = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3
          key={key++}
          className="text-base font-semibold text-ink"
          dangerouslySetInnerHTML={{
            __html: inlineMarkdown(trimmed.slice(3)),
          }}
        />,
      );
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
    } else if (trimmed.length > 0) {
      flushList();
      elements.push(
        <p
          key={key++}
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed) }}
        />,
      );
    }
  }
  flushList();

  return <div className="space-y-3">{elements}</div>;
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-ink">$1</strong>',
    )
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a class="tabby-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(
      /@([\w-]+)/g,
      '<a class="tabby-link" href="https://github.com/$1" target="_blank" rel="noopener noreferrer">@$1</a>',
    );
}

export default async function ReleaseNotesPage() {
  const releases = await fetchReleases();

  if (!releases || releases.length === 0) {
    redirect(RELEASES_URL);
  }

  const latest = releases[0];

  return (
    <LegalPageShell
      current="release-notes"
      title="Release Notes"
      summary="Updates, fixes, and changes for each release of tabby."
      updatedAt={formatDate(latest.published_at).toUpperCase()}
    >
      {releases.map((release, i) => (
        <div key={release.tag_name} className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-ink sm:text-xl">
              {release.tag_name}
            </h2>
            <p className="text-xs font-medium tracking-wide text-subtle">
              {formatDate(release.published_at)}
              {i === 0 ? " · Latest" : ""}
              {release.prerelease ? " · Pre-release" : ""}
            </p>
          </div>
          {release.body ? (
            <ReleaseBody markdown={release.body} />
          ) : (
            <p>{release.name || "No release notes."}</p>
          )}
        </div>
      ))}

      <p className="border-t-2 border-line pt-6">
        Full commit history and release assets are available on{" "}
        <a
          className="tabby-link font-semibold"
          href={RELEASES_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Releases
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
