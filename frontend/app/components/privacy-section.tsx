"use client";

import { motion, type Variants } from "framer-motion";
import { FadeIn, ScaleIn, Stagger, StaggerItem } from "./motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const flowContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const flowItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE },
  },
};

type PillarProps = {
  label: string;
  description: string;
};

function Pillar({ label, description }: PillarProps) {
  return (
    <div className="flex gap-4 rounded-[1.1rem] border-2 border-line bg-surface-2 p-5 shadow-[0_3px_0_var(--line)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-line bg-accent/15 text-ink">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold tracking-tight text-ink">
          {label}
        </span>
        <span className="text-sm leading-relaxed tracking-tight text-muted">
          {description}
        </span>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="28" height="12" viewBox="0 0 28 12" fill="none" aria-hidden="true" className="shrink-0 text-line">
      <path d="M0 6h22M18 2l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlowNode({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border-2 border-line px-4 py-3.5 text-center shadow-[0_3px_0_var(--line)] ${accent ? "bg-ink text-background" : "bg-surface-2 text-ink"}`}>
      {children}
    </div>
  );
}

function BlockedNode({ label }: { label: string }) {
  return (
    <motion.div
      variants={flowItem}
      className="flex items-center gap-1.5 rounded-xl border-2 border-dashed border-line-soft bg-background px-3 py-2"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 text-accent">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-xs font-medium tracking-tight text-subtle">{label}</span>
    </motion.div>
  );
}

function DataFlowVisual() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={flowContainer}
      className="overflow-hidden rounded-[1.7rem] border-2 border-line bg-surface-3 p-6 shadow-[0_5px_0_var(--line)] sm:p-8"
    >
      {/* Header */}
      <motion.div variants={flowItem} className="mb-6 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.14em] text-subtle uppercase">your mac</span>
        <span className="flex items-center gap-1.5 text-xs tracking-tight text-subtle">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-moss" />
          </span>
          on-device
        </span>
      </motion.div>

      {/* Mac boundary box */}
      <motion.div
        variants={flowItem}
        className="rounded-[1.1rem] border-2 border-dashed border-line-soft p-5"
      >
        {/* Flow row */}
        <div className="flex items-center justify-between gap-2">
          <FlowNode>
            <span className="text-[0.7rem] font-semibold tracking-widest uppercase text-subtle">input</span>
            <span className="mt-1 text-sm font-semibold tracking-tight">your text</span>
          </FlowNode>

          <Arrow />

          <FlowNode accent>
            <span className="text-[0.7rem] font-semibold tracking-widest uppercase opacity-50">tabby</span>
            <span className="mt-1 text-sm font-semibold tracking-tight">on-device engine</span>
          </FlowNode>

          <Arrow />

          <FlowNode>
            <span className="text-[0.7rem] font-semibold tracking-widest uppercase text-moss">output</span>
            <span className="mt-1 text-sm font-semibold tracking-tight">suggestion</span>
          </FlowNode>
        </div>

        {/* Engine label */}
        <motion.div
          variants={flowItem}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-surface-2 px-3 py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-moss" />
          <span className="text-xs font-medium tracking-tight text-subtle">
            Apple Intelligence or local GGUF · no hosted API
          </span>
        </motion.div>
      </motion.div>

      {/* Blocked items */}
      <motion.div variants={flowContainer} className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium tracking-tight text-subtle">blocked:</span>
        <BlockedNode label="cloud upload" />
        <BlockedNode label="telemetry" />
        <BlockedNode label="accounts" />
      </motion.div>
    </motion.div>
  );
}

export function PrivacySection() {
  return (
    <section className="mx-auto max-w-305">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <FadeIn>
            <h2 className="tabby-display max-w-xl text-[2.7rem] leading-none tracking-tight text-ink sm:text-[3.9rem]">
              your writing stays on your Mac.
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="max-w-xl text-base leading-relaxed tracking-tight text-muted sm:text-lg">
              tabby runs through on-device engines on your Mac, whether that is
              Apple Intelligence or a local GGUF model. Every keystroke and
              suggestion stays on-device, with no required hosted API, no
              sign-up, and no background uploads.
            </p>
          </FadeIn>

          <Stagger stagger={0.1} className="grid gap-3">
            <StaggerItem>
              <Pillar
                label="On-device inference"
                description="Use Apple Intelligence or a local GGUF model, with no cloud round-trip required."
              />
            </StaggerItem>
            <StaggerItem>
              <Pillar
                label="No accounts, ever"
                description="No login, no dashboard, and nothing to sign up for."
              />
            </StaggerItem>
            <StaggerItem>
              <Pillar
                label="Auditable"
                description="AGPL-3.0 licensed and built in public, with every release easy to inspect."
              />
            </StaggerItem>
          </Stagger>
        </div>

        <ScaleIn delay={0.2}>
          <DataFlowVisual />
        </ScaleIn>
      </div>
    </section>
  );
}
