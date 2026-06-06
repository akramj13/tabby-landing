"use client";

import { GITHUB_URL } from "../lib/site";
import { DownloadButton } from "./download-button";
import { GithubStarLabel } from "./github-star-label";
import { AppleIcon, GithubIcon } from "./icons";
import { PawMark } from "./paw-mark";
import { FadeIn, ScaleIn, WordReveal } from "./motion";
import { TabbyButton } from "./tabby-button";

export function SloganCtaSection() {
  return (
    <section className="relative overflow-hidden rounded-4xl border-2 border-line bg-surface-2 px-6 py-14 shadow-[0_11.8px_0_var(--line)] sm:px-10 sm:py-20">
      <PawMark className="pointer-events-none absolute right-8 top-7 z-10 w-12 -rotate-12 text-ink/80 sm:w-14" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <PawMark className="absolute left-[3%] top-8 w-9 rotate-[16deg] text-ink/15 sm:w-11" />
        <PawMark className="absolute left-[18%] bottom-9 w-7 -rotate-[22deg] text-ink/12 sm:w-9" />
        <PawMark className="absolute left-[33%] top-10 w-6 rotate-[8deg] text-ink/12 sm:w-8" />
        <PawMark className="absolute left-[47%] bottom-6 w-8 rotate-[28deg] text-ink/15 sm:w-10" />
        <PawMark className="absolute left-[61%] top-9 w-6 -rotate-[12deg] text-ink/12 sm:w-8" />
        <PawMark className="absolute left-[74%] bottom-10 w-9 rotate-[18deg] text-ink/15 sm:w-11" />
        <PawMark className="absolute left-[88%] top-12 w-7 -rotate-[24deg] text-ink/13 sm:w-9" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-7 text-center">
        <WordReveal
          as="h2"
          text="ready to try Cotabby?"
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
            <DownloadButton size="lg" icon={<AppleIcon className="h-6 w-6 sm:h-7 sm:w-7" />}>
              Download for Mac
            </DownloadButton>
            <TabbyButton
              href={GITHUB_URL}
              external
              variant="secondary"
              size="md"
              icon={<GithubIcon className="h-5 w-5" />}
            >
              <GithubStarLabel />
            </TabbyButton>
          </div>
        </ScaleIn>

        <FadeIn delay={0.35}>
          <p className="text-xs tracking-tight text-subtle sm:text-sm">
            macOS 15 or later · Apple Silicon · DMG install
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
