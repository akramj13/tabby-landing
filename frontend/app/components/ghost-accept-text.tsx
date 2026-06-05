"use client";

import { useEffect } from "react";
import { useAnimate, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// Ghost suggestion → accepted text. Mirrors Cotabby's own inline autocomplete:
// a caret blinks, the phrase appears as coral ghost text, then commits to ink.
const GHOST_COLOR = "#e85548";
const INK_COLOR = "rgb(28, 28, 28)"; // --foreground #1c1c1c

const sleep = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

type GhostAcceptTextProps = {
  text: string;
  startDelay?: number;
  className?: string;
};

export function GhostAcceptText({
  text,
  startDelay = 1.5,
  className,
}: GhostAcceptTextProps) {
  const [scope, animate] = useAnimate();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    let cancelled = false;

    const run = async () => {
      await sleep(startDelay);
      if (cancelled) return;

      // Caret appears at the insertion point and blinks twice.
      await animate("[data-caret]", { opacity: 1 }, { duration: 0.2 });
      await animate(
        "[data-caret]",
        { opacity: [1, 0, 1, 0, 1] },
        { duration: 0.9, ease: "linear" },
      );
      if (cancelled) return;

      // Suggestion populates as faint-blue ghost text.
      await animate("[data-ghost]", { opacity: 1 }, { duration: 0.4, ease: EASE });
      await sleep(0.5);
      if (cancelled) return;

      // Accept: ghost commits to solid ink, caret retracts.
      animate("[data-caret]", { opacity: 0 }, { duration: 0.25 });
      await animate(
        "[data-ghost]",
        { color: INK_COLOR, scale: [1, 1.04, 1] },
        { duration: 0.4, ease: EASE },
      );
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [animate, prefersReducedMotion, startDelay]);

  return (
    <span ref={scope} className={className} aria-hidden="true">
      <span
        data-caret
        className="inline-block h-[0.78em] w-[0.055em] translate-y-[0.08em] rounded-[0.02em] bg-accent"
        style={{ opacity: prefersReducedMotion ? 0 : 0 }}
      />
      <span
        data-ghost
        className="ml-[0.06em] inline-block"
        style={{
          opacity: prefersReducedMotion ? 1 : 0,
          color: prefersReducedMotion ? INK_COLOR : GHOST_COLOR,
        }}
      >
        {text}
      </span>
    </span>
  );
}
