"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Cpu, SlidersHorizontal, Sparkles, type LucideIcon } from "lucide-react";
import {
  FadeIn,
  HoverLift,
  ScaleIn,
  Stagger,
  StaggerItem,
  WordReveal,
} from "./motion";

type CustomItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  preview: ReactNode;
};

function CustomItem({ icon: Icon, title, description, preview }: CustomItemProps) {
  return (
    <HoverLift lift={5} className="h-full">
      <article className="tabby-panel-soft flex h-full min-h-124 flex-col gap-4 rounded-[1.55rem] p-6 sm:min-h-128 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-surface-3 text-ink shadow-[0_3.4px_0_var(--line)]">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <h3 className="text-[1.65rem] font-bold leading-tight tracking-tight text-ink sm:text-[1.9rem]">
            {title}
          </h3>
        </div>
        <p className="min-h-23 max-w-md text-sm leading-relaxed tracking-tight text-muted sm:min-h-24 sm:text-base">
          {description}
        </p>
        <div className="mt-auto">{preview}</div>
      </article>
    </HoverLift>
  );
}

const MODELS = [
  {
    name: "tabby-pico-1",
    note: "~0.1 GB · ultra-light",
    tag: "pico",
    color: "#36b5c4",
    tint: "rgba(54, 181, 196, 0.16)",
  },
  {
    name: "tabby-nano-1",
    note: "~0.4 GB · tiny & fast",
    tag: "nano",
    color: "#e0a32e",
    tint: "rgba(224, 163, 46, 0.16)",
  },
  {
    name: "tabby-fast-1",
    note: "~0.4 GB · speed-optimized",
    tag: "fast",
    color: "#ff8273",
    tint: "rgba(255, 130, 115, 0.16)",
  },
  {
    name: "tabby-balanced-1",
    note: "~3.1 GB · balanced quality",
    tag: "balanced",
    color: "#5aa888",
    tint: "rgba(90, 168, 136, 0.16)",
  },
  {
    name: "tabby-max-1",
    note: "~5.0 GB · most capable",
    tag: "max",
    color: "#8b7fd4",
    tint: "rgba(139, 127, 212, 0.16)",
  },
] as const;

function ModelsPreview() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % MODELS.length),
      2200,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-[1.2rem] border-2 border-line bg-surface-2 p-2 shadow-[0_5px_0_var(--line)]">
      {MODELS.map((m, i) => {
        const isActive = i === active;
        return (
          <div
            key={m.name}
            className="relative flex items-center gap-3 rounded-[0.85rem] px-3 py-2.5"
          >
            {isActive && (
              <motion.div
                layoutId="model-active-highlight"
                className="absolute inset-0 rounded-[0.85rem]"
                style={{ backgroundColor: m.tint }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <motion.span
              className="relative z-10 h-2 w-2 shrink-0 rounded-full"
              animate={{
                backgroundColor: isActive ? m.color : "rgba(120, 120, 120, 0.4)",
              }}
              transition={{ duration: 0.4 }}
            />
            <div className="relative z-10 min-w-0 flex-1">
              <p className="text-sm font-bold tracking-tight text-ink">
                {m.name}
              </p>
              <p className="text-xs tracking-tight text-subtle">{m.note}</p>
            </div>
            {isActive && (
              <motion.span
                key={m.tag}
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ backgroundColor: m.color }}
                className="relative z-10 shrink-0 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-white"
              >
                {m.tag}
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LengthPreview() {
  return (
    <div className="rounded-[1.2rem] border-2 border-line bg-surface-2 p-5 shadow-[0_5px_0_var(--line)]">
      <div className="flex items-center justify-between text-xs font-bold tracking-[0.12em] uppercase text-muted">
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
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-line bg-background shadow-[0_3.4px_0_var(--line)]"
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
    <div className="rounded-[1.2rem] border-2 border-line bg-surface-2 p-5 shadow-[0_5px_0_var(--line)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border-2 border-line bg-moss/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink shadow-[0_3.4px_0_var(--line)]">
          coming soon
        </span>
        {signals.map((signal, i) => (
          <span
            key={signal}
            className={`inline-flex items-center rounded-full border-2 border-line px-3 py-1 text-xs font-bold tracking-tight shadow-[0_3.4px_0_var(--line)] ${
              i === 0 ? "bg-accent/20 text-ink" : "bg-background text-muted"
            }`}
          >
            {signal}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed tracking-tight text-muted">
        Over time, Cotabby will learn the way you phrase things,
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
        text="make Cotabby feel like yours"
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
              icon={Cpu}
              title="choose your model"
              description="Five built-in models ship with Cotabby - from the featherweight pico for instant suggestions up to max when you want the sharpest output. You can also drop in your own GGUF."
              preview={<ModelsPreview />}
            />
          </ScaleIn>
        </StaggerItem>
        <StaggerItem>
          <ScaleIn delay={0.08}>
            <CustomItem
              icon={SlidersHorizontal}
              title="short or long"
              description="Three presets control how many words Cotabby suggests at a time. Default is 7-12 - enough to finish your thought, not enough to take over."
              preview={<LengthPreview />}
            />
          </ScaleIn>
        </StaggerItem>
        <StaggerItem>
          <ScaleIn delay={0.16}>
            <CustomItem
              icon={Sparkles}
              title="learns your voice"
              description="Coming soon: Cotabby will adapt to how you naturally write, keep lightweight memory over time, and make suggestions feel more like you."
              preview={<PersonalizationPreview />}
            />
          </ScaleIn>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
