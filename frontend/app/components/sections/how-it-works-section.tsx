"use client";

import { m, type Variants, useReducedMotion } from "framer-motion";
import { Folder } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FadeIn } from "@/app/components/ui/motion";
import { DownloadButton } from "@/app/components/ui/download-button";
import { AppleIcon } from "@/app/components/ui/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

type StepDefinition = {
  number: string;
  title: string;
  description: string;
  visual: ReactNode;
};

const stepCardVariants: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    y: 26,
    rotate: index % 2 === 0 ? -1.2 : 1.2,
    scale: 0.965,
  }),
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: EASE,
      delay: index * 0.06,
    },
  }),
};

type InstallPhase = "idle" | "dragging" | "dropped" | "hidden" | "reset";

const INSTALL_PHASE_DURATION_MS: Record<InstallPhase, number> = {
  idle: 500,
  dragging: 1100,
  dropped: 350,
  hidden: 450,
  reset: 350,
};

const INSTALL_NEXT_PHASE: Record<InstallPhase, InstallPhase> = {
  idle: "dragging",
  dragging: "dropped",
  dropped: "hidden",
  hidden: "reset",
  reset: "idle",
};

function InstallVisual() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [phase, setPhase] = useState<InstallPhase>("idle");

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return;
    const id = setTimeout(() => {
      setPhase((p) => INSTALL_NEXT_PHASE[p]);
    }, INSTALL_PHASE_DURATION_MS[phase]);
    return () => clearTimeout(id);
  }, [phase, isInView, prefersReducedMotion]);

  const atDestination = phase === "dragging" || phase === "dropped" || phase === "hidden";
  const shrunk = phase === "dropped" || phase === "hidden";
  const invisible = phase === "hidden";

  return (
    <div
      ref={containerRef}
      className="rounded-[1.1rem] border-2 border-line bg-surface-2 p-4"
    >
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-subtle">
        macOS install
      </p>
      <div className="relative mt-3 flex h-14 items-center justify-end rounded-[0.8rem] border-2 border-dashed border-line-soft bg-background/40 px-3">
        <m.div
          aria-hidden="true"
          initial={false}
          animate={
            prefersReducedMotion
              ? { left: "calc(100% - 2.75rem)", opacity: 0, scale: 1 }
              : {
                  left: atDestination ? "calc(100% - 2.75rem)" : "0rem",
                  scale: shrunk ? 0.55 : 1,
                  opacity: invisible || phase === "reset" ? 0 : 1,
                }
          }
          transition={{
            duration: INSTALL_PHASE_DURATION_MS[phase] / 1000,
            ease: phase === "dragging" ? EASE : "easeOut",
          }}
          className="absolute top-1/2 z-10 h-9 w-9 -translate-y-1/2 overflow-hidden rounded-[0.55rem] border-2 border-line bg-surface shadow-tabby-2xs"
        >
          <Image
            src="/logo.webp"
            alt=""
            fill
            sizes="36px"
            className="object-cover"
          />
        </m.div>
        <div className="flex h-10 w-11 shrink-0 items-center justify-center rounded-[0.55rem] border-2 border-line bg-accent-blue/25 shadow-tabby-2xs">
          <Folder className="h-5 w-5 text-ink" strokeWidth={2.2} />
        </div>
      </div>
      <div className="mt-3">
        <DownloadButton size="sm" fullWidth icon={<AppleIcon className="h-5 w-5 shrink-0" />}>
          Download for Mac
        </DownloadButton>
      </div>
    </div>
  );
}

const TYPE_ANYWHERE_APPS = [
  { name: "Gmail", icon: "/app-icons/gmail.svg", rotate: -7, from: -18 },
  { name: "Notes", icon: "/app-icons/apple-notes.svg", rotate: 5, from: 14 },
  { name: "Slack", icon: "/app-icons/slack.webp", rotate: -3, from: -12 },
  { name: "Notion", icon: "/app-icons/notion.svg", rotate: 8, from: 20 },
  { name: "iMessage", icon: "/app-icons/imessage.svg", rotate: -6, from: -16 },
  { name: "Outlook", icon: "/app-icons/microsoft-outlook.webp", rotate: 4, from: 10 },
  { name: "Discord", icon: "/app-icons/discord.webp", rotate: -2, from: -22 },
] as const;

function TypeAnywhereVisual() {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.07, delayChildren: 0.08 },
        },
      }}
      className="flex flex-wrap items-center gap-2.5"
    >
      {TYPE_ANYWHERE_APPS.map((app) => (
        <m.div
          key={app.name}
          variants={{
            hidden: { opacity: 0, x: app.from, y: 14, scale: 0.85, rotate: 0 },
            visible: {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: app.rotate,
              transition: { duration: 0.5, ease: EASE },
            },
          }}
          whileHover={{
            rotate: 0,
            y: -3,
            transition: { duration: 0.22, ease: EASE },
          }}
          role="img"
          aria-label={app.name}
          className="relative h-11 w-11 overflow-hidden rounded-[0.7rem] border-2 border-line bg-surface-2 shadow-tabby-xs"
        >
          <Image
            src={app.icon}
            alt=""
            fill
            sizes="44px"
            className="object-contain p-1.5"
          />
        </m.div>
      ))}
      <m.span
        variants={{
          hidden: { opacity: 0, y: 12, scale: 0.92 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.42, ease: EASE },
          },
        }}
        className="inline-flex h-11 items-center rounded-[0.7rem] border-2 border-dashed border-line-soft px-3 text-xs font-semibold tracking-tight text-subtle sm:text-sm"
      >
        + anywhere
      </m.span>
    </m.div>
  );
}

const TAB_FRAGMENTS = [
  "Thanks for the catch.",
  " I'll fold this into the deck",
  " and tighten the closing CTA.",
] as const;

const TAB_GHOST_COLOR = "rgba(255, 130, 115, 0.6)";
const TAB_INK_COLOR = "rgb(28, 28, 28)";

type TabPhase =
  | "idle"
  | "ghost-1"
  | "tap-1"
  | "ghost-2"
  | "tap-2"
  | "ghost-3"
  | "tap-3"
  | "done"
  | "reset";

const TAB_PHASE_DURATION_MS: Record<TabPhase, number> = {
  idle: 450,
  "ghost-1": 600,
  "tap-1": 360,
  "ghost-2": 650,
  "tap-2": 360,
  "ghost-3": 650,
  "tap-3": 360,
  done: 1600,
  reset: 450,
};

const TAB_NEXT_PHASE: Record<TabPhase, TabPhase> = {
  idle: "ghost-1",
  "ghost-1": "tap-1",
  "tap-1": "ghost-2",
  "ghost-2": "tap-2",
  "tap-2": "ghost-3",
  "ghost-3": "tap-3",
  "tap-3": "done",
  done: "reset",
  reset: "idle",
};

// For each fragment index i (0-2): visible from ghost-(i+1) onward; turns ink during tap-(i+1).
const TAB_GHOST_PHASES: Record<number, readonly TabPhase[]> = {
  0: ["ghost-1", "tap-1", "ghost-2", "tap-2", "ghost-3", "tap-3", "done"],
  1: ["ghost-2", "tap-2", "ghost-3", "tap-3", "done"],
  2: ["ghost-3", "tap-3", "done"],
};

const TAB_INK_PHASES: Record<number, readonly TabPhase[]> = {
  0: ["tap-1", "ghost-2", "tap-2", "ghost-3", "tap-3", "done"],
  1: ["tap-2", "ghost-3", "tap-3", "done"],
  2: ["tap-3", "done"],
};

function TabVisual() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [phase, setPhase] = useState<TabPhase>("idle");

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return;
    const id = setTimeout(() => {
      setPhase((p) => TAB_NEXT_PHASE[p]);
    }, TAB_PHASE_DURATION_MS[phase]);
    return () => clearTimeout(id);
  }, [phase, isInView, prefersReducedMotion]);

  const isPressing =
    phase === "tap-1" || phase === "tap-2" || phase === "tap-3";

  const tapsCompleted =
    phase === "done"
      ? 3
      : phase === "tap-3" || phase === "ghost-3"
        ? 2
        : phase === "tap-2" || phase === "ghost-2"
          ? 1
          : 0;

  const armedDotIndex =
    phase === "ghost-1" || phase === "tap-1"
      ? 0
      : phase === "ghost-2" || phase === "tap-2"
        ? 1
        : phase === "ghost-3" || phase === "tap-3"
          ? 2
          : -1;

  return (
    <div
      ref={containerRef}
      className="rounded-[1.1rem] border-2 border-line bg-surface-2 p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <m.kbd
          animate={
            prefersReducedMotion || !isPressing
              ? { y: 0 }
              : { y: [0, 2, 0] }
          }
          transition={
            isPressing
              ? { duration: 0.28, ease: "easeOut", times: [0, 0.4, 1] }
              : { duration: 0.18, ease: "easeOut" }
          }
          className="inline-flex items-center gap-2 rounded-[0.7rem] px-4 py-3 text-[1.05rem] font-bold text-white"
          style={{ background: "#3a3a3c" }}
        >
          <span aria-hidden="true">⇥</span>
          <span>tab</span>
        </m.kbd>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => {
            const completed = i < tapsCompleted;
            const armed = i === armedDotIndex;
            return (
              <m.span
                key={i}
                aria-hidden="true"
                animate={{
                  width: armed ? 22 : 12,
                  backgroundColor: completed
                    ? "var(--accent)"
                    : armed
                      ? "var(--foreground)"
                      : "var(--line-soft)",
                  scale: armed && isPressing ? 0.85 : 1,
                }}
                transition={{ duration: 0.28, ease: EASE }}
                className="inline-block h-1.5 rounded-full"
              />
            );
          })}
          <span className="ml-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-subtle">
            {tapsCompleted}/3 taps
          </span>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-[0.8rem] border border-line-soft bg-background px-3 py-2.5 text-sm leading-relaxed tracking-tight text-muted">
        {prefersReducedMotion ? (
          <span className="text-ink">{TAB_FRAGMENTS.join("")}</span>
        ) : (
          TAB_FRAGMENTS.map((fragment, i) => {
            const visible = TAB_GHOST_PHASES[i].includes(phase);
            const inked = TAB_INK_PHASES[i].includes(phase);
            return (
              <m.span
                key={i}
                initial={false}
                animate={{
                  opacity: visible ? 1 : 0,
                  color: inked ? TAB_INK_COLOR : TAB_GHOST_COLOR,
                }}
                transition={{
                  opacity: {
                    duration: visible ? 0.34 : 0.24,
                    ease: EASE,
                  },
                  color: {
                    duration: 0.36,
                    ease: EASE,
                    delay: inked ? 0.14 : 0,
                  },
                }}
              >
                {fragment}
              </m.span>
            );
          })
        )}
      </div>
    </div>
  );
}

const steps: StepDefinition[] = [
  {
    number: "01",
    title: "Install once",
    description:
      "Download the .dmg, drag Cotabby into Applications, and launch it like any other Mac app.",
    visual: <InstallVisual />,
  },
  {
    number: "02",
    title: "Type anywhere",
    description:
      "Cotabby watches your cursor. When you pause mid-sentence, it suggests the next thought inline as ghost text.",
    visual: <TypeAnywhereVisual />,
  },
  {
    number: "03",
    title: "Press Tab",
    description:
      "Each Tab accepts the next word, so you stay in control. Keep typing to adjust, or press Escape and Cotabby steps out of the way.",
    visual: <TabVisual />,
  },
];

function StepCard({ index, step }: { index: number; step: StepDefinition }) {
  return (
    <m.article
      custom={index}
      variants={stepCardVariants}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: EASE } }}
      className="tabby-panel relative flex h-full flex-col gap-5 rounded-[1.55rem] p-6 sm:p-7"
    >
      <div className="flex items-center justify-between">
        <span className="tabby-display text-[2.8rem] leading-none tracking-tight text-ink/90">
          {step.number}
        </span>
        <span className="ml-5 h-0.5 flex-1 bg-line-soft" />
      </div>
      <div>
        <h3 className="text-[1.55rem] font-bold leading-tight tracking-tight text-ink sm:text-[1.75rem]">
          {step.title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed tracking-tight text-muted sm:text-base">
        {step.description}
      </p>
      <div className="mt-auto">{step.visual}</div>
    </m.article>
  );
}

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-content">
      <FadeIn>
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="tabby-display text-[2.7rem] leading-[1.02] tracking-tight text-ink sm:text-[4rem]">
            how Cotabby works
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed tracking-tight text-muted sm:text-base">
            Install once. It lives in your menu bar and listens quietly in every
            text field on your Mac.
          </p>
        </div>
      </FadeIn>
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.14, delayChildren: 0.06 },
          },
        }}
        className="mt-12 grid gap-6 md:grid-cols-3"
      >
        {steps.map((step, index) => (
          <StepCard key={step.number} index={index} step={step} />
        ))}
      </m.div>
    </section>
  );
}
