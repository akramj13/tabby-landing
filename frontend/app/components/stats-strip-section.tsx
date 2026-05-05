"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { CountUp } from "./motion";

type StatProps = {
  displayValue: string;
  countTo?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  hint: string;
};

const STATS: StatProps[] = [
  {
    displayValue: "100%",
    countTo: 100,
    suffix: "%",
    label: "open source, free forever",
    hint: "No sign-up, no account, and nothing locked behind a paywall",
  },
  {
    displayValue: "100%",
    countTo: 100,
    suffix: "%",
    label: "local, no cloud",
    hint: "Your text stays on your Mac, with no required hosted API",
  },
  {
    displayValue: "Apple",
    label: "Intelligence support",
    hint: "Use Apple’s on-device model when it is available on your machine",
  },
  {
    displayValue: "Any",
    label: ".gguf support",
    hint: "Bring your own local model or use Tabby’s built-in downloads",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function Stat({
  displayValue,
  countTo,
  prefix,
  suffix,
  label,
  hint,
}: StatProps) {
  return (
    <div className="flex h-full flex-col gap-1.5 rounded-[1.25rem] border-2 border-line bg-background px-4 py-5 shadow-[0_4px_0_var(--line)] sm:px-6">
      <div className="tabby-display text-[2.3rem] leading-none tracking-tight text-ink sm:text-[2.9rem]">
        {typeof countTo === "number" ? (
          <CountUp to={countTo} prefix={prefix} suffix={suffix} />
        ) : (
          displayValue
        )}
      </div>
      <div className="text-sm font-semibold tracking-tight text-ink sm:text-base">
        {label}
      </div>
      <div className="text-xs leading-relaxed tracking-tight text-subtle sm:text-sm">
        {hint}
      </div>
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
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
              <Stat
                displayValue={stat.displayValue}
                countTo={stat.countTo}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
                hint={stat.hint}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
