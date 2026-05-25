"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GITHUB_URL } from "../lib/site";
import { DownloadButton } from "./download-button";
import { GhostAcceptText } from "./ghost-accept-text";
import { GithubStarLabel } from "./github-star-label";
import { AppleIcon, GithubIcon } from "./icons";
import { TextAnimate } from "./text";

const EASE = [0.22, 1, 0.36, 1] as const;

const secondaryActionClass =
  "tabby-button tabby-button-secondary inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-7 text-[1.05rem] font-bold tracking-tight sm:h-16 sm:w-auto sm:min-w-[270px] sm:text-[1.2rem]";

const primaryActionClass =
  "tabby-button tabby-button-primary inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-7 text-[1.05rem] font-bold tracking-tight sm:h-16 sm:w-auto sm:min-w-[270px] sm:text-[1.2rem]";

const copyContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const copyItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE },
  },
};

// Rotating hero headlines. Each is a lead clause (blurs in word-by-word) plus a
// short accept-phrase (the ghost-text accept animation). Kept similar in length
// so the layout barely shifts as they cycle.
const HEADLINES = [
  { lead: "Write at the speed of thought.", accept: "In any app." },
  { lead: "Finish your thoughts faster.", accept: "In any app." },
  { lead: "Skip the repetitive typing.", accept: "On your Mac." },
  { lead: "Turn quick notes into words.", accept: "In any app." },
  { lead: "Let your ideas keep flowing.", accept: "Right inline." },
] as const;

const HEADLINE_INTERVAL_MS = 5600;

export function Hero() {
  const revealState = "visible" as const;
  const prefersReducedMotion = useReducedMotion();
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(
      () => setHeadlineIndex((i) => (i + 1) % HEADLINES.length),
      HEADLINE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const headline = HEADLINES[headlineIndex];

  return (
    <main id="hero" className="relative mt-6 sm:mt-8">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-2 py-10 text-center sm:px-4 sm:py-14 lg:py-18">
        <motion.div
          variants={copyContainer}
          initial="hidden"
          animate={revealState}
          className="flex w-full flex-col items-center"
        >
          <motion.div
            variants={copyItem}
            className="mx-auto flex max-w-6xl flex-col items-center"
          >
            <h1
              aria-label={`${headline.lead} ${headline.accept}`}
              className="tabby-display mx-auto max-w-5xl text-center leading-[0.94] tracking-tight text-ink"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={headlineIndex}
                  exit={{
                    opacity: 0,
                    filter: "blur(8px)",
                    transition: { duration: 0.3, ease: EASE },
                  }}
                  className="inline-block"
                >
                  <TextAnimate
                    as="span"
                    by="word"
                    animation="blurInUp"
                    duration={0.8}
                    delay={0.1}
                    startOnView={false}
                    once
                    className="inline text-[3.15rem] sm:text-[4.8rem] lg:text-[6.2rem]"
                    segmentClassName="will-change-transform"
                  >
                    {headline.lead}
                  </TextAnimate>
                  <GhostAcceptText
                    text={headline.accept}
                    startDelay={1.3}
                    className="ml-[0.18em] inline text-[3.15rem] sm:text-[4.8rem] lg:text-[6.2rem]"
                  />
                </motion.span>
              </AnimatePresence>
            </h1>
          </motion.div>

          <motion.p
            variants={copyItem}
            className="mt-6 max-w-3xl text-balance text-base leading-relaxed tracking-tight text-muted sm:text-xl lg:text-2xl"
          >
            Open-source AI autocomplete for the apps you already use, powered
            by Apple Intelligence or local models and kept entirely on your Mac.
          </motion.p>

          <motion.div
            variants={copyItem}
            className="mt-9 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryActionClass}
            >
              <GithubIcon className="h-6 w-6 shrink-0" />
              <GithubStarLabel />
            </Link>
            <DownloadButton className={primaryActionClass}>
              <AppleIcon className="h-6 w-6 shrink-0" />
              Download for Mac
            </DownloadButton>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
