"use client";

import { useEffect, useState } from "react";

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

export function AnnouncementBannerRelative({ iso }: { iso: string }) {
  const releaseDate = new Date(iso);
  const [relative, setRelative] = useState(() =>
    formatRelative(releaseDate, new Date()),
  );

  useEffect(() => {
    const update = () => setRelative(formatRelative(releaseDate, new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [iso]);

  return <>{relative}</>;
}
