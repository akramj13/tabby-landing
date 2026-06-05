"use client";

import {
  AnimatePresence,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GITHUB_URL } from "../lib/site";
import { DownloadButton } from "./download-button";
import { GithubStarLabel } from "./github-star-label";
import { AppleIcon, GithubIcon } from "./icons";
import { HeroAppDemo } from "./hero-app-demo";
import { HeroReveal } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const HERO_ACCEPT_COLOR = "#e85548";

const secondaryActionClass =
  "tabby-button tabby-button-secondary inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-7 text-[1.05rem] font-bold tracking-tight sm:h-16 sm:w-auto sm:min-w-[270px] sm:text-[1.2rem]";

const primaryActionClass =
  "tabby-button tabby-button-blue inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-7 text-[1.05rem] font-bold tracking-tight sm:h-16 sm:w-auto sm:min-w-[270px] sm:text-[1.2rem]";

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
  { lead: "AI suggestions", accept: "for macOS." },
  { lead: "Write faster", accept: "in every app." },
  { lead: "Finish thoughts", accept: "before you type." },
  { lead: "Finish words", accept: "right inline." },
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
      <section className="mx-auto grid max-w-[88rem] grid-cols-1 items-center gap-12 px-2 pt-10 pb-16 sm:px-4 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] lg:items-start lg:gap-16 lg:pt-6 lg:pb-24">
        <m.div
          variants={copyContainer}
          initial="hidden"
          animate={revealState}
          className="flex w-full flex-col items-center lg:items-start lg:text-left"
        >
          <m.div
            variants={copyItem}
            className="mx-auto flex max-w-[88rem] flex-col items-center lg:mx-0 lg:items-start"
          >
            <h1
              aria-label={`${headline.lead} ${headline.accept}`}
              className="tabby-display mx-auto max-w-[88rem] text-center leading-[0.94] tracking-tight text-ink lg:mx-0 lg:text-left"
            >
              <AnimatePresence mode="wait">
                <m.span
                  key={headlineIndex}
                  initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                    transition: { duration: 0.5, ease: EASE },
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(8px)",
                    y: -10,
                    transition: { duration: 0.3, ease: EASE },
                  }}
                  className="inline-block text-[2.5rem] sm:text-[4.8rem] lg:text-[4.6rem]"
                >
                  {headline.lead}{" "}
                  <span style={{ color: HERO_ACCEPT_COLOR }}>
                    {headline.accept}
                  </span>
                </m.span>
              </AnimatePresence>
            </h1>
          </m.div>

          <m.p
            variants={copyItem}
            className="mt-6 lg:mt-10 max-w-3xl text-balance text-base leading-relaxed tracking-tight text-muted sm:text-xl lg:text-xl text-center lg:text-left"
          >
            Open-source AI autocomplete for the apps you already use, powered by
            Apple Intelligence or local models and kept entirely on your Mac.
          </m.p>

          <m.div
            variants={copyItem}
            className="mt-9 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row lg:justify-start"
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
          </m.div>

          <m.p
            variants={copyItem}
            className="mt-5 text-xs tracking-tight text-subtle sm:text-sm"
          >
            Cotabby is free and 100% open source.{" "}
            <Link
              href="https://ko-fi.com/cotabby"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-semibold"
              style={{
                color: "#ec4899",
                textDecorationLine: "underline",
                textDecorationColor: "#ec4899",
                textDecorationThickness: "1px",
                textUnderlineOffset: "2px",
              }}
            >
              Support development &amp; buy us a coffee
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="ml-1 inline-block align-[-0.15em] transition-transform group-hover:scale-110"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
              </svg>
            </Link>
          </m.p>
        </m.div>

        <HeroReveal delay={0.15} className="w-full">
          <HeroAppDemo />
        </HeroReveal>
      </section>
    </main>
  );
}
