"use client";

import Link from "next/link";
import { GITHUB_URL } from "../lib/site";
import { DownloadButton } from "./download-button";
import { GithubStarLabel } from "./github-star-label";
import { AppleIcon, GithubIcon } from "./icons";
import { FadeIn, ParallaxY, ScaleIn, WordReveal } from "./motion";

const primaryActionClass =
  "tabby-button tabby-button-primary inline-flex h-14 min-w-[260px] items-center justify-center gap-3 rounded-2xl px-8 text-[1.15rem] font-semibold leading-none tracking-tight sm:h-16 sm:min-w-[320px] sm:text-[1.4rem]";

const secondaryActionClass =
  "tabby-button tabby-button-secondary inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-[1.05rem] font-semibold leading-none tracking-tight sm:h-16 sm:text-[1.2rem]";

export function SloganCtaSection() {
  return (
    <section className="relative overflow-hidden rounded-4xl border-2 border-line bg-surface-2 px-6 py-14 shadow-[0_7px_0_var(--line)] sm:px-10 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <ParallaxY
        strength={30}
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-soft/50 blur-3xl"
      >
        <div />
      </ParallaxY>
      <ParallaxY
        strength={-40}
        className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-moss/25 blur-3xl"
      >
        <div />
      </ParallaxY>

      <div className="relative z-10 flex flex-col items-center gap-7 text-center">
        <WordReveal
          as="h2"
          text="ready to try tabby?"
          className="tabby-display max-w-3xl text-[2.8rem] leading-none tracking-tight text-ink sm:text-[4.8rem]"
        />

        <FadeIn delay={0.15}>
          <p className="max-w-xl text-base leading-relaxed tracking-tight text-muted sm:text-lg">
            It is built to feel like a small cozy helper that lives on your Mac,
            not another dashboard asking for attention.
          </p>
        </FadeIn>

        <ScaleIn delay={0.25} from={0.96}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <DownloadButton className={primaryActionClass}>
              <AppleIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              Download for Mac
            </DownloadButton>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryActionClass}
            >
              <GithubIcon className="h-5 w-5" />
              <GithubStarLabel />
            </Link>
          </div>
        </ScaleIn>

        <FadeIn delay={0.35}>
          <p className="text-xs tracking-tight text-subtle sm:text-sm">
            macOS 26 or later · Apple Silicon · DMG install
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
