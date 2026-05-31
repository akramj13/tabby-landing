"use client";

import { useEffect, useRef, useState } from "react";

type LazyYouTubeProps = {
  videoId: string;
  title: string;
  posterAlt?: string;
  className?: string;
  iframeClassName?: string;
  playerVars?: string;
};

const DEFAULT_PLAYER_VARS =
  "autoplay=1&mute=1&playsinline=1&rel=0&loop=1&controls=1";

export function LazyYouTube({
  videoId,
  title,
  posterAlt = "",
  className,
  iframeClassName,
  playerVars = DEFAULT_PLAYER_VARS,
}: LazyYouTubeProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || shouldLoad) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldLoad]);

  const playlist = playerVars.includes("playlist=")
    ? playerVars
    : `${playerVars}&playlist=${videoId}`;
  const src = `https://www.youtube.com/embed/${videoId}?${playlist}`;
  const posterSrc = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div ref={wrapperRef} className={className}>
      {shouldLoad ? (
        <iframe
          className={iframeClassName ?? "h-full w-full"}
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        // Poster shown until iframe loads. Plain <img> to avoid configuring
        // next/image remotePatterns just for a YouTube thumbnail.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterSrc}
          alt={posterAlt}
          loading="lazy"
          decoding="async"
          className={iframeClassName ?? "h-full w-full object-cover"}
        />
      )}
    </div>
  );
}
