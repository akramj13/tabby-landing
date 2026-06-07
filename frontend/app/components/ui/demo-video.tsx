"use client";

import { useEffect, useRef, useState } from "react";

type DemoVideoProps = {
  /** Path under /videos, without extension, e.g. "autocomplete-feature". */
  name: string;
  /** Accessible description of what the clip shows. */
  label: string;
  className?: string;
};

/**
 * Autoplaying, muted, looping demo clip — the lightweight replacement for the
 * old multi-MB animated GIF/WebP tiles. The MP4 source is only attached once
 * the element nears the viewport, so these never compete with the page's LCP.
 * A tiny WebP poster fills the frame until the video paints.
 */
export function DemoVideo({ name, label, className }: DemoVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || load) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [load]);

  return (
    <video
      ref={ref}
      className={className}
      poster={`/videos/posters/${name}.webp`}
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    >
      {load ? <source src={`/videos/${name}.mp4`} type="video/mp4" /> : null}
    </video>
  );
}
