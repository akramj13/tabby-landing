"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { PawMark } from "./paw-mark";

type CardProps = {
  title: string;
  description: string;
  evidence: ReactNode;
  pawClassName: string;
};

function OpenSourceEvidence() {
  return (
    <div className="rounded-[0.9rem] border-2 border-line-soft bg-surface-2 p-3">
      <div className="flex items-center gap-2 font-mono text-[0.72rem] sm:text-xs">
        <span className="text-accent-deep">$</span>
        <span className="text-ink">git clone</span>
        <span className="truncate text-subtle">github.com/fujacob/tabby</span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-accent-deep">
          AGPL-3.0
        </span>
        <span className="rounded-full bg-background px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-subtle">
          free forever
        </span>
      </div>
    </div>
  );
}

function OnDeviceEvidence() {
  const blocked = ["cloud", "analytics", "accounts"];
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="tabby-display text-[2.4rem] leading-none tracking-tight text-ink">
          100%
        </span>
        <span className="text-sm font-medium tracking-tight text-muted">
          on your Mac
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {blocked.map((item) => (
          <span
            key={item}
            className="rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold tracking-tight text-subtle line-through decoration-pop-red/70 decoration-2"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ModelEvidence() {
  const engines = [
    { name: "Apple Intelligence", tag: "system" },
    { name: "Open-source GGUF", tag: "3 built-in" },
    { name: "Bring your own", tag: ".gguf" },
  ];
  return (
    <div className="space-y-1">
      {engines.map((e) => (
        <div key={e.name} className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="flex-1 text-sm font-semibold tracking-tight text-ink">
            {e.name}
          </span>
          <span className="shrink-0 text-xs tracking-tight text-subtle">
            {e.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

const CARDS: CardProps[] = [
  {
    title: "Open Source",
    description: "Read every line, fork it, contribute back.",
    evidence: <OpenSourceEvidence />,
    pawClassName: "right-6 top-6 w-12 -rotate-[14deg]",
  },
  {
    title: "Local",
    description: "Your writing never leaves your Mac.",
    evidence: <OnDeviceEvidence />,
    pawClassName: "right-7 top-5 w-11 rotate-[19deg]",
  },
  {
    title: "Model Customization",
    description: "Apple Intelligence, local GGUF, or bring your own.",
    evidence: <ModelEvidence />,
    pawClassName: "right-5 top-7 w-[3.4rem] -rotate-[27deg]",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function Card({ title, description, evidence, pawClassName }: CardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border-2 border-line bg-surface px-5 py-6 shadow-[0_6.7px_0_var(--line)] sm:px-6">
      <PawMark
        className={`pointer-events-none absolute z-0 text-ink/80 ${pawClassName}`}
      />
      <div className="tabby-display relative z-10 text-[1.6rem] leading-[1.05] tracking-tight text-ink sm:text-[1.95rem]">
        {title}
      </div>
      <div className="mt-2.5 text-sm leading-relaxed tracking-tight text-subtle sm:text-base">
        {description}
      </div>
      <div className="mt-auto border-t-2 border-line-soft pt-5">{evidence}</div>
    </div>
  );
}

export function StatsStripSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 88%", "end 45%"],
  });

  const translate = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [30, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [0.965, 1],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.55, 1], [0.18, 0.75, 1]);

  const smoothY = useSpring(translate, {
    stiffness: 140,
    damping: 26,
    mass: 0.55,
  });
  const smoothScale = useSpring(scale, {
    stiffness: 150,
    damping: 24,
    mass: 0.55,
  });
  const smoothOpacity = useSpring(opacity, {
    stiffness: 180,
    damping: 28,
    mass: 0.4,
  });

  return (
    <section ref={sectionRef} className="mx-auto max-w-305">
      <motion.div
        style={{
          y: smoothY,
          scale: smoothScale,
          opacity: smoothOpacity,
          transformOrigin: "50% 50%",
        }}
        className="rounded-[1.6rem] p-2 sm:p-3"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.45 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.62, ease: EASE },
                },
              }}
              className="h-full"
            >
              <Card
                title={card.title}
                description={card.description}
                evidence={card.evidence}
                pawClassName={card.pawClassName}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
