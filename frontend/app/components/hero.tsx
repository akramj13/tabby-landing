"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { GITHUB_URL } from "../lib/site";
import { DownloadButton } from "./download-button";
import { GithubStarLabel } from "./github-star-label";
import { AppleIcon, GithubIcon } from "./icons";
import { TextAnimate } from "./text";

const EASE = [0.22, 1, 0.36, 1] as const;

const secondaryActionClass =
  "tabby-button tabby-button-secondary inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-7 text-[1.05rem] font-semibold tracking-tight sm:h-16 sm:w-auto sm:min-w-[270px] sm:text-[1.2rem]";

const primaryActionClass =
  "tabby-button tabby-button-primary inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-7 text-[1.05rem] font-semibold tracking-tight sm:h-16 sm:w-auto sm:min-w-[270px] sm:text-[1.2rem]";

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

export function Hero() {
  const revealState = "visible" as const;

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
              aria-label="Write at the speed of thought. In any app."
              className="tabby-display mx-auto max-w-5xl text-center leading-[0.94] tracking-tight text-ink"
            >
              <TextAnimate
                as="span"
                by="word"
                animation="blurInUp"
                duration={0.8}
                delay={0.18}
                startOnView={false}
                once
                className="inline text-[3.15rem] sm:text-[4.8rem] lg:text-[6.2rem]"
                segmentClassName="will-change-transform"
              >
                Write at the speed of thought.
              </TextAnimate>
              <TextAnimate
                as="span"
                by="word"
                animation="blurInUp"
                duration={0.65}
                delay={0.46}
                startOnView={false}
                once
                className="ml-[0.18em] inline text-[3.15rem] text-accent sm:text-[4.8rem] lg:text-[6.2rem]"
                segmentClassName="will-change-transform"
              >
                In any app.
              </TextAnimate>
            </h1>
          </motion.div>

          <motion.p
            variants={copyItem}
            className="mt-6 max-w-3xl text-balance text-base leading-relaxed tracking-tight text-muted sm:text-xl lg:text-2xl"
          >
            Inline AI autocomplete for the apps you already use, powered by
            Apple Intelligence or local models and kept entirely on your Mac.
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
