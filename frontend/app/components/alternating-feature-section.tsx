"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FadeIn, WordReveal } from "./motion";

const VIDEO_ID = "p3TIgxQFQGE";

// Load the YT IFrame API script once across all players
let ytApiLoading = false;
const ytReadyCallbacks: (() => void)[] = [];

function onYTReady(cb: () => void) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).YT?.Player) {
    cb();
    return;
  }
  ytReadyCallbacks.push(cb);
  if (!ytApiLoading) {
    ytApiLoading = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onYouTubeIframeAPIReady = () => {
      ytReadyCallbacks.forEach((fn) => fn());
      ytReadyCallbacks.length = 0;
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  }
}

type SegmentPlayerProps = { start: number; end: number };

function SegmentPlayer({ start, end }: SegmentPlayerProps) {
  const uid = useId().replace(/:/g, "yt");
  const hostRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [ready, setReady] = useState(false);

  // Defer iframe API load until this player is near the viewport.
  // Saves ~1 MB of YouTube JS on initial page load.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldMount) return;
    onYTReady(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playerRef.current = new (window as any).YT.Player(uid, {
        videoId: VIDEO_ID,
        playerVars: {
          start,
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
        },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onReady: (e: any) => {
            e.target.playVideo();
            setReady(true);
            intervalRef.current = setInterval(() => {
              try {
                const t = playerRef.current?.getCurrentTime?.();
                if (typeof t === "number" && t >= end) {
                  playerRef.current.seekTo(start, true);
                }
              } catch {
                // player not ready yet
              }
            }, 150);
          },
        },
      });
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [shouldMount, uid, start, end]);

  return (
    <div
      ref={hostRef}
      className={`h-full w-full transition-opacity duration-500 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <div id={uid} className="h-full w-full" />
    </div>
  );
}

type VideoBlockProps = {
  className?: string;
  label: string;
  start: number;
  end: number;
};

function VideoBlock({ className = "", label, start, end }: VideoBlockProps) {
  return (
    <div
      role="img"
      aria-label={`${label} demo video`}
      className={`relative aspect-video w-full overflow-hidden rounded-[1.35rem] border-2 border-line bg-surface shadow-[0_11.8px_0_var(--line)] ${className}`}
    >
      <SegmentPlayer start={start} end={end} />
      <div className="absolute inset-0 z-10" />
    </div>
  );
}

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type HeadlineProps = {
  text: string;
  icon: string;
  iconPad?: boolean;
  align?: "left" | "right";
};

function SectionHeadline({
  text,
  icon,
  iconPad = false,
  align = "left",
}: HeadlineProps) {
  return (
    <div className={align === "right" ? "md:flex md:justify-end" : ""}>
      <div className="inline-flex items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[0.85rem] border-2 border-line bg-surface-2 shadow-[0_5px_0_var(--line)] sm:h-14 sm:w-14">
          <Image
            src={icon}
            alt=""
            fill
            sizes="56px"
            className={`object-contain${iconPad ? " p-2" : " p-1.5"}`}
          />
        </div>
        <h3 className="tabby-display text-[2.75rem] leading-[0.96] tracking-tight text-ink sm:text-[3.6rem]">
          {text}
        </h3>
      </div>
    </div>
  );
}

type FeatureRowProps = {
  layout: "text-left" | "text-right";
  headline: string;
  icon: string;
  iconPad?: boolean;
  label: string;
  start?: number;
  end?: number;
  visual?: ReactNode;
};

function FeatureRow({
  layout,
  headline,
  icon,
  iconPad,
  label,
  start,
  end,
  visual,
}: FeatureRowProps) {
  const textFromLeft = layout === "text-left";

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <m.div
        variants={textFromLeft ? slideLeft : slideRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        className={textFromLeft ? "" : "md:order-2"}
      >
        <SectionHeadline
          text={headline}
          icon={icon}
          iconPad={iconPad}
          align={textFromLeft ? "left" : "right"}
        />
      </m.div>
      <m.div
        variants={textFromLeft ? slideRight : slideLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        transition={{ delay: 0.12 }}
        className={textFromLeft ? "" : "md:order-1"}
      >
        {visual !== undefined ? (
          <div
            aria-label={`${label} demo`}
            className="relative aspect-video w-full overflow-hidden rounded-[1.35rem] border-2 border-line bg-surface shadow-[0_11.8px_0_var(--line)]"
          >
            {visual}
          </div>
        ) : start !== undefined && end !== undefined ? (
          <VideoBlock label={label} start={start} end={end} />
        ) : null}
      </m.div>
    </div>
  );
}

const EMOJI_LEAD = "Nice work ";
const EMOJI_TRIGGER = ":smi";
const EMOJI_CHOSEN = "😄";
const EMOJI_CANDIDATES = [
  { glyph: "😄", alias: "smile" },
  { glyph: "😁", alias: "smiley" },
] as const;

// Decorative animation that mirrors the inline emoji picker shown in the macOS
// app's onboarding (see Cotabby/UI/Onboarding/OnboardingFeatureShowcase.swift).
// Loops: type `:smi` → popup of candidates → accept top match → reset. Static
// accepted state when the system requests Reduce Motion.
function EmojiAutocompleteVisual() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [triggerCount, setTriggerCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [committed, setCommitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = setTimeout(() => {
          timeoutId = null;
          resolve();
        }, ms);
      });

    async function loop() {
      if (prefersReducedMotion) {
        setTriggerCount(EMOJI_TRIGGER.length);
        setShowPopup(false);
        setCommitted(true);
        return;
      }

      // Offset against the ghost-text demo videos so the eye doesn't catch
      // both animations starting in unison.
      await sleep(700);

      while (!cancelled) {
        setTriggerCount(0);
        setShowPopup(false);
        setCommitted(false);
        await sleep(350);
        if (cancelled) return;

        for (let i = 1; i <= EMOJI_TRIGGER.length; i++) {
          setTriggerCount(i);
          await sleep(70);
          if (cancelled) return;
        }

        setShowPopup(true);
        await sleep(1500);
        if (cancelled) return;

        setShowPopup(false);
        setCommitted(true);
        await sleep(900);
        if (cancelled) return;

        setCommitted(false);
        setTriggerCount(0);
        await sleep(600);
      }
    }

    void loop();
    return () => {
      cancelled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion]);

  const queryAfterColon = EMOJI_TRIGGER.slice(1, triggerCount);
  const showColon = triggerCount >= 1;

  return (
    <div className="absolute inset-0 flex items-center justify-center px-5 py-6 sm:px-8 sm:py-8">
      <div className="relative w-full max-w-[26rem]">
        <div className="rounded-[0.85rem] border-2 border-line-soft bg-background/70 px-4 py-3 text-[1.05rem] tracking-tight sm:text-[1.2rem]">
          <span className="text-ink">{EMOJI_LEAD}</span>
          {committed ? (
            <span className="text-ink">{EMOJI_CHOSEN}</span>
          ) : (
            <>
              {showColon && <span className="text-subtle">:</span>}
              <span className="text-ink">{queryAfterColon}</span>
              {!prefersReducedMotion && (
                <m.span
                  aria-hidden="true"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                  className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[0.05em] bg-ink align-middle"
                />
              )}
            </>
          )}
        </div>

        <AnimatePresence>
          {showPopup && (
            <m.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top left" }}
              className="absolute left-[5.2rem] top-[2.85rem] z-10 w-[13.5rem] overflow-hidden rounded-[0.85rem] border-2 border-line bg-surface-2 shadow-[0_5px_0_var(--line)] sm:left-[6rem] sm:top-[3.15rem] sm:w-[15rem]"
            >
              <div className="flex items-center px-3 py-2 font-mono text-[0.78rem] tracking-tight">
                <span className="text-subtle">:</span>
                <span className="text-ink">smi</span>
              </div>
              <div className="border-t border-line-soft" />
              <div className="space-y-0.5 p-1.5">
                {EMOJI_CANDIDATES.map((candidate, i) => {
                  const isSelected = i === 0;
                  return (
                    <div
                      key={candidate.alias}
                      className={`flex items-center gap-2 rounded-[0.5rem] px-2 py-1.5 ${
                        isSelected ? "bg-accent text-white" : "text-ink"
                      }`}
                    >
                      <span className="text-base leading-none">{candidate.glyph}</span>
                      <span className="font-mono text-[0.78rem] tracking-tight">
                        :{candidate.alias}:
                      </span>
                      <span className="flex-1" />
                      {isSelected && (
                        <kbd className="inline-flex h-[1.1rem] items-center justify-center rounded-[0.35rem] border border-white/40 bg-white/20 px-1.5 text-[0.6rem] font-bold tracking-wide text-white">
                          Tab
                        </kbd>
                      )}
                    </div>
                  );
                })}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AlternatingFeatureSection() {
  return (
    <section className="mx-auto max-w-305">
      <WordReveal
        as="h2"
        text="main use cases, one by one"
        className="tabby-display text-center text-[2.9rem] leading-[1.02] tracking-tight text-ink sm:text-[4.1rem]"
      />
      <FadeIn delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          A few examples of Cotabby quietly finishing thoughts (and dropping in
          the right emoji) in the apps you already use - clips from a real
          session.
        </p>
      </FadeIn>
      <div className="mt-14 space-y-14 sm:space-y-16 md:space-y-20">
        <FeatureRow
          layout="text-left"
          headline="write your emails faster"
          icon="/app-icons/gmail.svg"
          label="email"
          start={14}
          end={22}
        />
        <FeatureRow
          layout="text-right"
          headline="write your notes faster"
          icon="/app-icons/apple-notes.svg"
          label="notes"
          start={23}
          end={32}
        />
        <FeatureRow
          layout="text-left"
          headline="write your Slack messages faster"
          icon="/app-icons/slack.webp"
          iconPad
          label="slack"
          start={33}
          end={40}
        />
        <FeatureRow
          layout="text-right"
          headline="write your messages faster"
          icon="/app-icons/imessage.svg"
          label="messages"
          start={41}
          end={50}
        />
        <FeatureRow
          layout="text-left"
          headline="drop in the right emoji"
          icon="/app-icons/emoji.svg"
          label="emoji"
          visual={<EmojiAutocompleteVisual />}
        />
      </div>
    </section>
  );
}
