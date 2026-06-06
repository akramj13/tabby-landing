import Link from "next/link";
import { GITHUB_REPO } from "@/app/lib/site";
import { AnnouncementBannerRelative } from "@/app/components/layout/announcement-banner-relative";

type GitHubRelease = {
  tag_name: string;
  published_at: string;
};

async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `token ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { headers, next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function AnnouncementBanner() {
  const release = await fetchLatestRelease();
  if (!release) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] flex min-h-12 items-center justify-center bg-accent-deep px-4 py-2 text-sm font-medium tracking-tight text-white sm:text-base"
    >
      <span className="text-center">
        {release.tag_name} released{" "}
        <AnnouncementBannerRelative iso={release.published_at} />. Send feedback
        at{" "}
        <Link href="/feedback" className="underline underline-offset-2">
          cotabby.app/feedback
        </Link>
        !
      </span>
    </div>
  );
}
