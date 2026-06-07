"use client";

import { useEffect, useState } from "react";

const FALLBACK = "latest";

export function GitHubVersionLabel() {
  const [version, setVersion] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-latest-release")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { version?: string } | null) => {
        if (cancelled || !data?.version) return;
        setVersion(data.version);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{version}</>;
}
