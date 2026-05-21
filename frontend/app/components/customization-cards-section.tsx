"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  FadeIn,
  HoverLift,
  ScaleIn,
  Stagger,
  StaggerItem,
  WordReveal,
} from "./motion";

type CustomItemProps = {
  eyebrow: string;
  title: string;
  description: string;
  preview: ReactNode;
};

function CustomItem({ eyebrow, title, description, preview }: CustomItemProps) {
  return (
    <HoverLift lift={5} className="h-full">
      <article className="tabby-panel-soft flex h-full min-h-124 flex-col gap-4 rounded-[1.55rem] p-6 sm:min-h-128 sm:p-7">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss sm:text-[0.75rem]">
            {eyebrow}
          </p>
        </div>
        <h3 className="text-[1.65rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.9rem]">
          {title}
        </h3>
        <p className="min-h-23 max-w-md text-sm leading-relaxed tracking-tight text-muted sm:min-h-24 sm:text-base">
          {description}
        </p>
        <div className="mt-auto">{preview}</div>
      </article>
    </HoverLift>
  );
}

function ModelsPreview() {
  const models = [
    { name: "tabby-fast", note: "~0.4 GB · speed-optimized", active: true },
    { name: "tabby-quality", note: "~0.8 GB · higher quality", active: false },
  ];
  return (
    <div className="rounded-[1.2rem] border-2 border-line bg-surface-2 p-4 shadow-[0_3px_0_var(--line)]">
      <div className="space-y-2.5">
        {models.map((m) => (
          <div
            key={m.name}
            className={`flex items-center justify-between gap-3 rounded-[0.7rem] border-2 px-3 py-2 ${
              m.active
                ? "border-line bg-accent/15 shadow-[0_2px_0_var(--line)]"
                : "border-line-soft bg-background"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${m.active ? "bg-accent" : "bg-subtle-foreground/40"}`}
              />
              <span className="text-sm font-semibold tracking-tight text-ink">
                {m.name}
              </span>
            </div>
            <span className="text-xs tracking-tight text-subtle">{m.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LengthPreview() {
  return (
    <div className="rounded-[1.2rem] border-2 border-line bg-surface-2 p-5 shadow-[0_3px_0_var(--line)]">
      <div className="flex items-center justify-between text-xs font-semibold tracking-[0.12em] uppercase text-muted">
        <span>3-7 words</span>
        <span className="text-ink">7-12 words</span>
        <span>12-20 words</span>
      </div>
      <div className="relative mt-4 h-2 rounded-full border-2 border-line bg-background">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "55%" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 h-full rounded-full bg-accent"
        />
        <motion.div
          initial={{ left: "0%" }}
          whileInView={{ left: "55%" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-line bg-background shadow-[0_2px_0_var(--line)]"
        />
      </div>
      <p className="mt-4 text-sm leading-relaxed tracking-tight text-subtle">
        Suggestions stay concise by default so they still feel like an extension
        of your own sentence.
      </p>
    </div>
  );
}

function PersonalizationPreview() {
  const signals = ["writing style", "memory", "adapts over time"];
  return (
    <div className="rounded-[1.2rem] border-2 border-line bg-surface-2 p-5 shadow-[0_3px_0_var(--line)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border-2 border-line bg-moss/15 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink shadow-[0_2px_0_var(--line)]">
          coming soon
        </span>
        {signals.map((signal, i) => (
          <span
            key={signal}
            className={`inline-flex items-center rounded-full border-2 border-line px-3 py-1 text-xs font-semibold tracking-tight shadow-[0_2px_0_var(--line)] ${
              i === 0 ? "bg-accent/20 text-ink" : "bg-background text-muted"
            }`}
          >
            {signal}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed tracking-tight text-muted">
        Over time, tabby will learn the way you phrase things,
        <span className="text-accent">
          {" remember what matters to you, and keep suggestions sounding like you."}
        </span>
      </p>
    </div>
  );
}

export function CustomizationCardsSection() {
  return (
    <section className="mx-auto max-w-305">
      <WordReveal
        as="h2"
        text="make tabby feel like yours"
        className="tabby-display text-center text-[2.9rem] leading-[1.02] tracking-tight text-ink sm:text-[4.1rem]"
      />
      <FadeIn delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          Tune the suggestions so they feel helpful, not intrusive.
        </p>
      </FadeIn>

      <Stagger stagger={0.12} className="mt-12 grid gap-6 lg:grid-cols-3">
        <StaggerItem>
          <ScaleIn>
            <CustomItem
              eyebrow="models"
              title="choose your model"
              description="Two built-in models ship with tabby. Pick fast for speed, or quality when you want sharper suggestions. You can also drop in your own GGUF."
              preview={<ModelsPreview />}
            />
          </ScaleIn>
        </StaggerItem>
        <StaggerItem>
          <ScaleIn delay={0.08}>
            <CustomItem
              eyebrow="length"
              title="short or long"
              description="Three presets control how many words tabby suggests at a time. Default is 7-12 - enough to finish your thought, not enough to take over."
              preview={<LengthPreview />}
            />
          </ScaleIn>
        </StaggerItem>
        <StaggerItem>
          <ScaleIn delay={0.16}>
            <CustomItem
              eyebrow="ai personalization"
              title="learns your voice"
              description="Coming soon: tabby will adapt to how you naturally write, keep lightweight memory over time, and make suggestions feel more like you."
              preview={<PersonalizationPreview />}
            />
          </ScaleIn>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
