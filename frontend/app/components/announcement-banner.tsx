"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const RELEASE_DATE = new Date("2026-06-05T10:52:24Z");

function formatRelative(from: Date, to: Date) {
  const seconds = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function AnnouncementBanner() {
  const [relative, setRelative] = useState(() => formatRelative(RELEASE_DATE, new Date()));

  useEffect(() => {
    const update = () => setRelative(formatRelative(RELEASE_DATE, new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{ color: "#ffffff" }}
      className="fixed inset-x-0 top-0 z-[60] flex h-12 items-center justify-center bg-accent-deep px-4 text-sm font-medium tracking-tight sm:text-base"
    >
      <span className="truncate">
        v0.5.0-beta released {relative}. Send feedback at{" "}
        <Link
          href="/feedback"
          style={{
            color: "#ffffff",
            textDecorationLine: "underline",
            textUnderlineOffset: "2px",
          }}
        >
          cotabby.app/feedback
        </Link>
        !
      </span>
    </div>
  );
}
