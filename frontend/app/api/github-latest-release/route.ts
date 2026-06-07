import { NextResponse } from "next/server";
import { GITHUB_REPO } from "@/app/lib/site";

const FALLBACK = "latest";
const STALE_WHILE_REVALIDATE_SECONDS = 60;

export const revalidate = 300;

function buildCacheControl() {
  return [
    "public",
    "max-age=0",
    `s-maxage=${revalidate}`,
    `stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
  ].join(", ");
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `token ${token}`;

  let version = FALLBACK;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { headers, next: { revalidate } },
    );
    if (res.ok) {
      const data = (await res.json()) as { tag_name?: string };
      if (typeof data.tag_name === "string" && data.tag_name) {
        version = data.tag_name;
      }
    }
  } catch {
    // fall through to fallback
  }

  return NextResponse.json(
    { version },
    { headers: { "Cache-Control": buildCacheControl() } },
  );
}
