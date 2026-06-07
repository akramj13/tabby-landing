"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { FadeIn, WordReveal } from "@/app/components/ui/motion";
import { CotabbyLogoChip } from "@/app/components/ui/cotabby-logo-chip";

const CHIPS = [
  { label: "Apple Mail", iconSrc: "/app-icons/apple-mail.webp" },
  { label: "Apple Notes", iconSrc: "/app-icons/apple-notes.svg" },
  { label: "Google Chrome", iconSrc: "/app-icons/google-chrome.webp" },
  { label: "Microsoft Outlook", iconSrc: "/app-icons/microsoft-outlook.webp" },
  { label: "Gmail", iconSrc: "/app-icons/gmail.svg" },
  { label: "iMessage", iconSrc: "/app-icons/imessage.svg" },
  { label: "Notion", iconSrc: "/app-icons/notion.svg" },
  { label: "Obsidian", iconSrc: "/app-icons/obsidian.jpeg" },
  { label: "Discord", iconSrc: "/app-icons/discord.webp" },
  { label: "Slack", iconSrc: "/app-icons/slack.webp" },
  { label: "WhatsApp", iconSrc: "/app-icons/whatsapp.svg" },
  { label: "Telegram", iconSrc: "/app-icons/telegram.svg" },
  { label: "Messenger", iconSrc: "/app-icons/messenger.svg" },
  { label: "Signal", iconSrc: "/app-icons/signal.svg" },
  { label: "Linear", iconSrc: "/app-icons/linear.svg" },
  { label: "Reddit", iconSrc: "/app-icons/reddit.svg" },
  { label: "X", iconSrc: "/app-icons/x.svg" },
  { label: "LinkedIn", iconSrc: "/app-icons/linkedin.svg" },
  { label: "Safari", iconSrc: "/app-icons/safari.svg" },
  { label: "Arc", iconSrc: "/app-icons/arc.svg" },
  { label: "Firefox", iconSrc: "/app-icons/firefox.svg" },
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

      <div className="relative left-1/2 mt-10 w-screen -translate-x-1/2 space-y-3 overflow-hidden py-4 sm:py-5">
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
      </div>
    </div>
  );
}
