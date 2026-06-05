"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Soft red / amber / green — a desaturated nod to macOS traffic lights that
// still sits in the cream palette.
const WINDOW_DOTS = ["#e8806f", "#e8c06f", "#7fc8a0"] as const;

type Phase = "typing" | "suggest" | "accept" | "hold";

// Phase machine — same shape as how-it-works-section.tsx (TabVisual). "typing"
// is driven char-by-char below; these are the durations for the timed phases.
const PHASE_MS: Record<Phase, number> = {
  typing: 0, // unused — typing is driven char-by-char below
  suggest: 1100,
  accept: 950,
  hold: 1700,
};
const TYPE_SPEED_MS = 32;
const POST_TYPE_PAUSE_MS = 340;

type Kind = "email" | "channel" | "imessage" | "note" | "doc";

type AppMock = {
  key: string;
  /** Window title-bar label. */
  name: string;
  /** Short label for the app tab (used in aria-label). */
  short: string;
  iconSrc: string;
  kind: Kind;
  dark?: boolean;
  // Per-app palette so each window reads like the real app.
  surface: string;
  text: string;
  subtle: string;
  ghost: string;
  accent: string;
  /** Primary context label: recipient / channel / contact / title. */
  meta: string;
  /** Secondary context: email subject, note date. */
  sub?: string;
  /** Incoming message for the iMessage thread. */
  received?: string;
  /** Text the "user" has already typed. */
  prefix: string;
  /** The suggestion that ghosts in, then commits to the app's text color. */
  ghostText: string;
  /** Optional avatar image (channel apps) — overrides the solid accent dot. */
  avatar?: string;
  /** Optional sender name (channel apps). Defaults to "you". */
  username?: string;
};

const APPS: AppMock[] = [
  {
    key: "gmail",
    name: "Gmail — Compose",
    short: "Gmail",
    iconSrc: "/app-icons/gmail.svg",
    kind: "email",
    surface: "#ffffff",
    text: "#202124",
    subtle: "#5f6368",
    ghost: "#bdc1c6",
    accent: "#1a73e8",
    meta: "alex@cotabby.app",
    sub: "Re: Onboarding revamp",
    prefix: "Hi Alex, I went through the new flow and it's ",
    ghostText: "a big improvement. Let's ship it Friday.",
  },
  {
    key: "obsidian",
    name: "Obsidian — Daily note",
    short: "Obsidian",
    iconSrc: "/app-icons/obsidian.jpeg",
    kind: "note",
    dark: true,
    surface: "#1e1e1e",
    text: "#dcddde",
    subtle: "#8a8d91",
    ghost: "#585b5e",
    accent: "#a78bfa",
    meta: "2026-06-05",
    sub: "Daily note",
    prefix: "Standup: shipped the onboarding flow, ",
    ghostText: "next up is the billing migration.",
  },
  {
    key: "outlook",
    name: "Outlook — New Mail",
    short: "Outlook",
    iconSrc: "/app-icons/microsoft-outlook.webp",
    kind: "email",
    surface: "#ffffff",
    text: "#242424",
    subtle: "#616161",
    ghost: "#c8c8c8",
    accent: "#0f6cbd",
    meta: "finance@corp.com",
    sub: "Q3 forecast",
    prefix: "Hi team, the Q3 numbers are in and ",
    ghostText: "revenue is up 18% over last quarter.",
  },
  {
    key: "slack",
    name: "Slack — #design",
    short: "Slack",
    iconSrc: "/app-icons/slack.webp",
    kind: "channel",
    surface: "#ffffff",
    text: "#1d1c1d",
    subtle: "#616061",
    ghost: "#bcbcbc",
    accent: "#4a154b",
    meta: "design",
    prefix: "the new hero is on staging, can someone ",
    ghostText: "give it a quick design pass before we ship?",
  },
  {
    key: "discord",
    name: "Discord — #general",
    short: "Discord",
    iconSrc: "/app-icons/discord.webp",
    kind: "channel",
    dark: true,
    surface: "#313338",
    text: "#dbdee1",
    subtle: "#949ba4",
    ghost: "#5d6066",
    accent: "#5865f2",
    avatar: "/discord-pfp.png",
    username: "jacob",
    meta: "general",
    prefix: "pushed the fix for the crash, ",
    ghostText: "pull main and tell me if it's gone.",
  },
  {
    key: "imessage",
    name: "Messages",
    short: "iMessage",
    iconSrc: "/app-icons/imessage.svg",
    kind: "imessage",
    surface: "#ffffff",
    text: "#ffffff",
    subtle: "#8e8e93",
    ghost: "rgba(255,255,255,0.6)",
    accent: "#0b84ff",
    meta: "Maya",
    received: "are you close?",
    prefix: "almost there, ",
    ghostText: "grabbing coffee then heading over.",
  },
  {
    key: "notes",
    name: "Notes — Weekend trip",
    short: "Apple Notes",
    iconSrc: "/app-icons/apple-notes.svg",
    kind: "note",
    surface: "#fffdf5",
    text: "#1c1c1e",
    subtle: "#b0a075",
    ghost: "#d8cfb8",
    accent: "#f5c33b",
    meta: "Weekend trip",
    sub: "Today at 9:41 AM",
    prefix: "Packing list: chargers, snacks, ",
    ghostText: "a rain jacket, and the good camera.",
  },
  {
    key: "notion",
    name: "Notion — Q3 planning",
    short: "Notion",
    iconSrc: "/app-icons/notion.svg",
    kind: "doc",
    surface: "#ffffff",
    text: "#37352f",
    subtle: "#9b9a97",
    ghost: "#cfcdc8",
    accent: "#37352f",
    meta: "Q3 planning",
    prefix: "Goal this quarter: cut onboarding time ",
    ghostText: "in half and ship the public API.",
  },
];

function renderBody(app: AppMock, typed: ReactNode, line: string): ReactNode {
  switch (app.kind) {
    case "email":
      return (
        <div className="px-6 pb-7 pt-5">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-[0.95rem] sm:text-[1.02rem]">
              <span className="w-16 shrink-0" style={{ color: app.subtle }}>
                To
              </span>
              <span className="truncate font-medium" style={{ color: app.text }}>
                {app.meta}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[0.95rem] sm:text-[1.02rem]">
              <span className="w-16 shrink-0" style={{ color: app.subtle }}>
                Subject
              </span>
              <span className="truncate font-semibold" style={{ color: app.text }}>
                {app.sub}
              </span>
            </div>
          </div>
          <div className="my-5 h-px w-full" style={{ background: line }} />
          <p className="text-[1.22rem] leading-relaxed tracking-tight sm:text-[1.4rem]">
            {typed}
          </p>
        </div>
      );
    case "channel": {
      const nameColor = app.dark ? app.accent : app.text;
      return (
        <div className="px-6 pb-7 pt-4">
          <div
            className="flex items-center gap-2 pb-3"
            style={{ borderBottom: `1px solid ${line}` }}
          >
            <span
              className="text-[1.1rem] font-bold sm:text-[1.2rem]"
              style={{ color: app.text }}
            >{`# ${app.meta}`}</span>
          </div>
          <div className="mt-4 flex gap-3.5">
            {app.avatar ? (
              <Image
                src={app.avatar}
                alt=""
                width={44}
                height={44}
                sizes="44px"
                className="mt-0.5 h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                className="mt-0.5 h-11 w-11 shrink-0 rounded-full"
                style={{ background: app.accent }}
                aria-hidden="true"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[1.02rem] font-bold"
                  style={{ color: nameColor }}
                >
                  {app.username ?? "you"}
                </span>
                <span className="text-[0.8rem]" style={{ color: app.subtle }}>
                  now
                </span>
              </div>
              <p className="mt-1 text-[1.15rem] leading-relaxed tracking-tight sm:text-[1.3rem]">
                {typed}
              </p>
            </div>
          </div>
        </div>
      );
    }
    case "imessage":
      return (
        <div className="px-5 pb-6 pt-4">
          <p
            className="text-center text-[0.82rem] font-semibold"
            style={{ color: app.subtle }}
          >
            {app.meta}
          </p>
          <div className="mt-4 flex">
            <span
              className="max-w-[78%] rounded-[1.3rem] rounded-bl-[0.45rem] px-4 py-2.5 text-[1.08rem] sm:text-[1.18rem]"
              style={{ background: "#e9e9eb", color: "#000000" }}
            >
              {app.received}
            </span>
          </div>
          <div className="mt-3 flex justify-end">
            <span
              className="max-w-[84%] rounded-[1.3rem] rounded-br-[0.45rem] px-4 py-2.5 text-[1.08rem] leading-relaxed sm:text-[1.18rem]"
              style={{ background: app.accent }}
            >
              {typed}
            </span>
          </div>
        </div>
      );
    case "note":
      return (
        <div className="px-6 pb-7 pt-5">
          <h4
            className="text-[1.55rem] font-bold tracking-tight sm:text-[1.8rem]"
            style={{ color: app.text }}
          >
            {app.meta}
          </h4>
          <p className="mt-1.5 text-[0.82rem]" style={{ color: app.subtle }}>
            {app.sub}
          </p>
          <p className="mt-4 text-[1.22rem] leading-relaxed tracking-tight sm:text-[1.4rem]">
            {typed}
          </p>
        </div>
      );
    case "doc":
      return (
        <div className="px-6 pb-7 pt-6">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-[1.7rem] leading-none">
              🗒️
            </span>
            <h4
              className="text-[1.65rem] font-bold tracking-tight sm:text-[1.95rem]"
              style={{ color: app.text }}
            >
              {app.meta}
            </h4>
          </div>
          <p className="mt-5 text-[1.22rem] leading-relaxed tracking-tight sm:text-[1.4rem]">
            {typed}
          </p>
        </div>
      );
  }
}

export function HeroAppDemo() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reduce = prefersReducedMotion;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(0);
  // Start mid-suggestion on the first app so the very first paint shows the
  // payoff (ghost text + the Cotabby chip), not an empty field.
  const [phase, setPhase] = useState<Phase>("suggest");
  const [typedLen, setTypedLen] = useState(APPS[0].prefix.length);

  const app = APPS[index];
  const active = isInView && !hovered && !reduce;

  // Pause when scrolled out of view (matches the how-it-works visuals).
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Char-by-char typing, then hand off to "suggest".
  useEffect(() => {
    if (!active || phase !== "typing") return;
    if (typedLen >= app.prefix.length) {
      const id = setTimeout(() => setPhase("suggest"), POST_TYPE_PAUSE_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setTypedLen((n) => n + 1), TYPE_SPEED_MS);
    return () => clearTimeout(id);
  }, [active, phase, typedLen, app.prefix.length]);

  // Timed phases: suggest → accept → hold → next app.
  useEffect(() => {
    if (!active || phase === "typing") return;
    const id = setTimeout(() => {
      if (phase === "suggest") setPhase("accept");
      else if (phase === "accept") setPhase("hold");
      else {
        setIndex((i) => (i + 1) % APPS.length);
        setTypedLen(0);
        setPhase("typing");
      }
    }, PHASE_MS[phase]);
    return () => clearTimeout(id);
  }, [active, phase]);

  function selectApp(i: number) {
    setIndex(i);
    setTypedLen(reduce ? APPS[i].prefix.length : 0);
    setPhase(reduce ? "hold" : "typing");
  }

  const showGhost = reduce || phase !== "typing";
  const inked = reduce || phase === "accept" || phase === "hold";
  const showCaret = !reduce && (phase === "typing" || phase === "suggest");
  const typed = reduce || phase !== "typing" ? app.prefix : app.prefix.slice(0, typedLen);
  const line = app.dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const headerBg = app.dark ? "#26262b" : "#f1f1f4";

  const typedLine = (
    <>
      <span style={{ color: app.text }}>{typed}</span>
      {showCaret && (
        <m.span
          aria-hidden="true"
          className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.12em] rounded-[1px] align-baseline"
          style={{ backgroundColor: app.text }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
      )}
      <m.span
        initial={false}
        animate={{ opacity: showGhost ? 1 : 0, color: inked ? app.text : app.ghost }}
        transition={{
          opacity: { duration: 0.3, ease: EASE },
          color: { duration: 0.35, ease: EASE },
        }}
        style={{ color: app.ghost }}
      >
        {app.ghostText}
      </m.span>
    </>
  );

  return (
    <div ref={containerRef} className="w-full select-none">
      <span className="sr-only">
        A live preview of Cotabby suggesting text inside Gmail, Apple Mail,
        Outlook, Slack, Discord, iMessage, Notes, and Notion.
      </span>

      <div
        aria-hidden="true"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-full max-w-[34rem] overflow-hidden rounded-[1.5rem] border-2 border-line bg-surface shadow-[0_11.8px_0_var(--line)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={app.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            {/* macOS title bar (window chrome) */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ background: headerBg, borderBottom: `1px solid ${line}` }}
            >
              <div className="flex items-center gap-1.5">
                {WINDOW_DOTS.map((color) => (
                  <span
                    key={color}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="ml-1 flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[0.5rem] border border-line-soft bg-white">
                  <Image
                    src={app.iconSrc}
                    alt=""
                    width={32}
                    height={32}
                    sizes="20px"
                    className={`h-3.5 w-3.5 object-contain${
                      app.iconSrc.endsWith(".jpeg") ? " rounded-[0.3rem]" : ""
                    }`}
                  />
                </span>
                <span
                  className="truncate text-[0.82rem] font-bold tracking-tight"
                  style={{ color: app.subtle }}
                >
                  {app.name}
                </span>
              </div>
            </div>

            {/* App content (per-app skin) */}
            <div
              className="relative min-h-[16rem] sm:min-h-[18rem]"
              style={{ background: app.surface }}
            >
              {renderBody(app, typedLine, line)}
            </div>
          </m.div>
        </AnimatePresence>

        {/* Tab button — the accept affordance. Plain chunky dark key; it gives
            a small press on accept and never fades in or out. */}
        <m.div
          aria-hidden="true"
          initial={false}
          animate={phase === "accept" && !reduce ? { y: [0, 2, 0] } : { y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut", times: [0, 0.4, 1] }}
          className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 rounded-[0.7rem] px-4 py-3 text-[1.05rem] font-bold text-white"
          style={{ background: "#3a3a3c" }}
        >
          <span aria-hidden="true">⇥</span>
          <span>tab</span>
        </m.div>
      </div>

      {/* App tabs — progress indicator + jump-to control. */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
        {APPS.map((entry, i) => {
          const isActive = i === index;
          return (
            <button
              key={entry.key}
              type="button"
              onClick={() => selectApp(i)}
              aria-label={`Show Cotabby in ${entry.short}`}
              aria-pressed={isActive}
              className={`flex h-10 w-10 items-center justify-center rounded-[0.75rem] border-2 bg-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                isActive
                  ? "-translate-y-0.5 border-line shadow-[0_4px_0_var(--line)]"
                  : "border-line-soft opacity-50 hover:-translate-y-0.5 hover:opacity-100"
              }`}
            >
              <Image
                src={entry.iconSrc}
                alt=""
                width={40}
                height={40}
                sizes="22px"
                className={`h-6 w-6 object-contain${
                  entry.iconSrc.endsWith(".jpeg") ? " rounded-[0.5rem]" : ""
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
