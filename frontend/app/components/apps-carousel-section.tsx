"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { FadeIn, WordReveal } from "./motion";
import { CotabbyLogoChip } from "./cotabby-logo-chip";

const CHIPS = [
  { label: "Apple Mail", iconSrc: "/app-icons/apple-mail.webp" },
  { label: "Apple Notes", iconSrc: "/app-icons/apple-notes.svg" },
  { label: "Google Chrome", iconSrc: "/app-icons/google-chrome.webp" },
  { label: "Microsoft Outlook", iconSrc: "/app-icons/microsoft-outlook.webp" },
  { label: "Gmail", iconSrc: "/app-icons/gmail.svg" },
  { label: "iMessage", iconSrc: "/app-icons/imessage.svg" },
  { label: "Notion", iconSrc: "/app-icons/notion.svg" },
  { label: "Discord", iconSrc: "/app-icons/discord.webp" },
  { label: "Slack", iconSrc: "/app-icons/slack.webp" },
];

const TRACK = [...CHIPS, ...CHIPS];
const REVERSE_TRACK = [...CHIPS.slice().reverse(), ...CHIPS.slice().reverse()];

const PING_INTERVAL_MS = 4000;
const PING_DURATION_MS = 720;

export function AppsCarouselSection() {
  const prefersReducedMotion = useReducedMotion();
  const [pingingLabel, setPingingLabel] = useState<string | null>(null);
  const lastIndexRef = useRef(-1);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const id = setInterval(() => {
      let i = Math.floor(Math.random() * CHIPS.length);
      if (i === lastIndexRef.current && CHIPS.length > 1) {
        i = (i + 1) % CHIPS.length;
      }
      lastIndexRef.current = i;
      setPingingLabel(CHIPS[i].label);
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => setPingingLabel(null), PING_DURATION_MS);
    }, PING_INTERVAL_MS);

    return () => {
      clearInterval(id);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="mx-auto">
      <WordReveal
        as="h2"
        text="works in apps like"
        className="tabby-display text-center text-[2.7rem] leading-[1.02] tracking-tight text-ink sm:text-[3.6rem]"
      />
      <FadeIn delay={0.1}>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          Mail, notes, docs, messages, wherever you happen to be typing.
        </p>
      </FadeIn>

      <div className="relative mt-10 space-y-3 overflow-hidden rounded-[1.5rem] px-3 py-4 sm:px-4 sm:py-5">
        <div
          className="tabby-marquee-track"
          aria-label="Supported apps carousel"
        >
          {TRACK.map((app, index) => (
            <CotabbyLogoChip
              key={`chip-${app.label}-${index}`}
              label={app.label}
              iconSrc={app.iconSrc}
              className="tabby-marquee-item"
              pinging={pingingLabel === app.label}
            />
          ))}
        </div>
        <div
          className="tabby-marquee-track tabby-marquee-track-reverse"
          aria-hidden="true"
        >
          {REVERSE_TRACK.map((app, index) => (
            <CotabbyLogoChip
              key={`chip-rev-${app.label}-${index}`}
              label={app.label}
              iconSrc={app.iconSrc}
              className="tabby-marquee-item"
              pinging={pingingLabel === app.label}
            />
          ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-linear-to-r from-background to-transparent sm:w-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-l from-background to-transparent sm:w-20"
        />
      </div>
    </div>
  );
}
