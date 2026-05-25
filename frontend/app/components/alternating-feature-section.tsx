"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
            // Reveal only once the player is initialized, so YouTube's
            // brief loading chrome (controls/title) never flashes.
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
  }, [uid, start, end]);

  return (
    <div
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
  start: number;
  end: number;
};

function FeatureRow({
  layout,
  headline,
  icon,
  iconPad,
  label,
  start,
  end,
}: FeatureRowProps) {
  const textFromLeft = layout === "text-left";

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <motion.div
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
      </motion.div>
      <motion.div
        variants={textFromLeft ? slideRight : slideLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        transition={{ delay: 0.12 }}
        className={textFromLeft ? "" : "md:order-1"}
      >
        <VideoBlock label={label} start={start} end={end} />
      </motion.div>
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
          A few examples of Cotabby quietly finishing thoughts in the apps you
          already use - clips from a real session.
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
          icon="/app-icons/slack.png"
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
      </div>
    </section>
  );
}
