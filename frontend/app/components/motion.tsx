"use client";

import { m, type HTMLMotionProps, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 260, damping: 28 };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

type FadeInProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  once?: boolean;
};

export function FadeIn({
  children,
  delay = 0,
  once = true,
  ...rest
}: FadeInProps) {
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={fadeUp}
      transition={{ duration: 0.65, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  once?: boolean;
  stagger?: number;
};

export function Stagger({
  children,
  once = true,
  stagger = 0.08,
  ...rest
}: StaggerProps) {
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
  };
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={variants}
      {...rest}
    >
      {children}
    </m.div>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function StaggerItem({ children, ...rest }: StaggerItemProps) {
  return (
    <m.div variants={fadeUp} {...rest}>
      {children}
    </m.div>
  );
}

type HeroRevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
};

export function HeroReveal({ children, delay = 0, ...rest }: HeroRevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

type ScaleInProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  from?: number;
  once?: boolean;
};

export function ScaleIn({
  children,
  delay = 0,
  from = 0.9,
  once = true,
  ...rest
}: ScaleInProps) {
  return (
    <m.div
      initial={{ opacity: 0, scale: from, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

type WordRevealProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  stagger?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

export function WordReveal({
  text,
  className,
  wordClassName,
  stagger = 0.06,
  once = true,
  as = "h2",
}: WordRevealProps) {
  const words = text.split(" ");
  const parent: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
  };
  const child: Variants = {
    hidden: { opacity: 0, y: "60%", rotate: 2 },
    visible: {
      opacity: 1,
      y: "0%",
      rotate: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };

  const MotionTag = m[as] as typeof m.h2;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-15% 0px -15% 0px" }}
      variants={parent}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="relative inline-block overflow-hidden pb-[0.12em] align-baseline"
        >
          <m.span
            variants={child}
            className={`inline-block ${wordClassName ?? ""}`}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </m.span>
        </span>
      ))}
    </MotionTag>
  );
}

type HoverLiftProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  lift?: number;
};

export function HoverLift({ children, lift = 4, ...rest }: HoverLiftProps) {
  return (
    <m.div
      whileHover={{ y: -lift, transition: SPRING }}
      whileTap={{ y: -lift / 2, scale: 0.99 }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

type CountUpProps = {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

export function CountUp({
  to,
  duration = 1.6,
  suffix = "",
  prefix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = (now - start) / 1000;
          const t = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * to));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

type ScrollProgressBarProps = {
  className?: string;
};

export function ScrollProgressBar({ className }: ScrollProgressBarProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      node.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ transformOrigin: "0% 50%", transform: "scaleX(0)" }}
      className={
        className ?? "fixed left-0 right-0 top-0 z-50 h-0.75 bg-accent"
      }
    />
  );
}
