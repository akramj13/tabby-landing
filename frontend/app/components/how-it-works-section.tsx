"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { FadeIn } from "./motion";

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

function InstallVisual() {
  return (
    <div className="rounded-[1.1rem] border-2 border-line bg-surface-2 p-4">
      <div className="flex items-center justify-between gap-3 rounded-[0.8rem] border-2 border-line bg-background px-4 py-3 shadow-[0_3px_0_var(--line)]">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-subtle">
            macOS install
          </p>
          <p className="mt-1 text-sm font-semibold tracking-tight text-ink">
            Download the .dmg
          </p>
        </div>
        <span className="inline-flex items-center rounded-[0.55rem] border-2 border-line bg-accent/15 px-3 py-1.5 text-xs font-semibold tracking-tight text-ink shadow-[0_2px_0_var(--line)]">
          drag to Applications
        </span>
      </div>
    </div>
  );
}

function TypeAnywhereVisual() {
  const apps = ["Mail", "Notes", "Slack", "Notion", "Docs"];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06, delayChildren: 0.08 },
        },
      }}
      className="flex flex-wrap gap-2"
    >
      {apps.map((app) => (
        <motion.span
          key={app}
          variants={{
            hidden: { opacity: 0, y: 12, scale: 0.92 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.42, ease: EASE },
            },
          }}
          className="inline-flex items-center rounded-[0.7rem] border-2 border-line bg-surface-2 px-3 py-1.5 text-xs font-medium tracking-tight text-ink shadow-[0_2px_0_var(--line)] sm:text-sm"
        >
          {app}
        </motion.span>
      ))}
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 12, scale: 0.92 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.42, ease: EASE },
          },
        }}
        className="inline-flex items-center rounded-[0.7rem] border-2 border-dashed border-line-soft px-3 py-1.5 text-xs font-medium tracking-tight text-subtle sm:text-sm"
      >
        + anywhere
      </motion.span>
    </motion.div>
  );
}

function TabVisual() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <div className="rounded-[1.1rem] border-2 border-line bg-surface-2 p-4">
      <div className="flex items-center gap-3">
        <motion.kbd
          animate={
            prefersReducedMotion
              ? { y: 0, boxShadow: "0 3px 0 var(--line)" }
              : {
                  y: [0, -2, 0],
                  boxShadow: [
                    "0 3px 0 var(--line)",
                    "0 5px 0 var(--line)",
                    "0 3px 0 var(--line)",
                  ],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1.3, ease: "easeInOut", repeat: Infinity }
          }
          className="inline-flex h-10 min-w-13 items-center justify-center rounded-[0.6rem] border-2 border-line bg-background px-2.5 text-sm font-semibold text-ink"
        >
          Tab
        </motion.kbd>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
        <span className="text-sm tracking-tight text-ink">
          ghost text becomes <span className="font-semibold">your</span> words
        </span>
      </div>
      <div className="mt-4 overflow-hidden rounded-[0.8rem] border border-line-soft bg-background px-3 py-2 text-sm tracking-tight text-muted">
        I folded your feedback into the deck
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 1] }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-accent"
        >
          {" and tightened the closing CTA."}
        </motion.span>
      </div>
    </div>
  );
}

const steps: StepDefinition[] = [
  {
    number: "01",
    title: "Install once",
    description:
      "Download the .dmg, drag tabby into Applications, and launch it like any other Mac app.",
    visual: <InstallVisual />,
  },
  {
    number: "02",
    title: "Type anywhere",
    description:
      "tabby watches your cursor. When you pause mid-sentence, it suggests the next thought inline as ghost text.",
    visual: <TypeAnywhereVisual />,
  },
  {
    number: "03",
    title: "Press Tab",
    description:
      "The suggestion snaps in. Keep typing to adjust it, or press Escape and tabby steps out of the way.",
    visual: <TabVisual />,
  },
];

function StepCard({ index, step }: { index: number; step: StepDefinition }) {
  return (
    <motion.article
      custom={index}
      variants={stepCardVariants}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: EASE } }}
      className="tabby-panel-soft relative flex h-full flex-col gap-5 rounded-[1.55rem] p-6 sm:p-7"
    >
      <div className="flex items-center justify-between">
        <span className="tabby-display text-[2.8rem] leading-none tracking-tight text-ink/90">
          {step.number}
        </span>
        <span className="ml-5 h-0.5 flex-1 bg-line-soft" />
      </div>
      <div>
        <h3 className="text-[1.55rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.75rem]">
          {step.title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed tracking-tight text-muted sm:text-base">
        {step.description}
      </p>
      <div className="mt-auto">{step.visual}</div>
    </motion.article>
  );
}

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-305">
      <FadeIn>
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="tabby-display text-[2.7rem] leading-[1.02] tracking-tight text-ink sm:text-[4rem]">
            how tabby works
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed tracking-tight text-muted sm:text-base">
            Install once. It lives in your menu bar and listens quietly in every
            text field on your Mac.
          </p>
        </div>
      </FadeIn>
      <motion.div
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
      </motion.div>
    </section>
  );
}
