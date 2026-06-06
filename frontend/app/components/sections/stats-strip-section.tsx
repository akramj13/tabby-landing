"use client";

import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

type CardProps = {
  title: string;
  description: string;
  evidence: ReactNode;
};

function OpenSourceEvidence() {
  return (
    <div className="tabby-display text-[3.4rem] leading-[0.92] tracking-tight text-ink sm:text-[4.2rem]">
      AGPL-3.0
    </div>
  );
}

const BLOCKED_WORDS = [
  "cloud",
  "analytics",
  "accounts",
  "telemetry",
  "servers",
] as const;

const STRIKE_STYLE = {
  textDecorationColor: "rgba(225, 29, 72, 0.9)",
  textDecorationSkipInk: "none" as const,
};

function OnDeviceEvidence() {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
      {BLOCKED_WORDS.map((item) => (
        <span
          key={item}
          className="tabby-display text-[1.7rem] leading-[1.18] tracking-tight text-ink/85 line-through decoration-[3px] sm:text-[2.05rem]"
          style={STRIKE_STYLE}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ModelEvidence() {
  const engines = [
    {
      name: "Apple",
      icon: (
        <Image
          src="/app-icons/Apple_Intelligence.webp"
          alt=""
          width={96}
          height={96}
          className="h-8 w-8 object-contain"
        />
      ),
    },
    {
      name: "GGUF",
      icon: (
        <Image
          src="/app-icons/hf-logo.webp"
          alt=""
          width={96}
          height={96}
          className="h-8 w-8 object-contain"
        />
      ),
    },
    { name: "Custom", icon: <Plus className="h-7 w-7" strokeWidth={2.4} /> },
  ];
  return (
    <div className="flex items-end justify-around gap-3">
      {engines.map((e) => (
        <div key={e.name} className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[0.8rem] border-2 border-line bg-surface-2 text-ink shadow-[0_3.4px_0_var(--line)]">
            {e.icon}
          </div>
          <span className="text-sm font-bold tracking-tight text-ink">
            {e.name}
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
  },
  {
    title: "Local",
    description: "Your writing never leaves your Mac.",
    evidence: <OnDeviceEvidence />,
  },
  {
    title: "Model Customization",
    description: "Pick your engine. Swap it whenever.",
    evidence: <ModelEvidence />,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function Card({ title, description, evidence }: CardProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border-2 border-line bg-surface px-5 py-6 shadow-[0_6.7px_0_var(--line)] sm:px-6">
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
    <section ref={sectionRef} className="mx-auto max-w-content">
      <m.div
        style={{
          y: smoothY,
          scale: smoothScale,
          opacity: smoothOpacity,
          transformOrigin: "50% 50%",
        }}
        className="rounded-[1.6rem] p-2 sm:p-3"
      >
        <m.div
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
            <m.div
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
              />
            </m.div>
          ))}
        </m.div>
      </m.div>
    </section>
  );
}
