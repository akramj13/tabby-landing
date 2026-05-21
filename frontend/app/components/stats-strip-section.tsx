"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ComponentType, type SVGProps } from "react";
import { ModelIcon, OpenSourceIcon, PrivateIcon } from "./icons";

type CardProps = {
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const CARDS: CardProps[] = [
  {
    title: "Open Source",
    description:
      "AGPL-3.0 licensed. Free forever - read every line, fork it, contribute back.",
    Icon: OpenSourceIcon,
  },
  {
    title: "On-Device",
    description:
      "No cloud, no analytics, no accounts. Your writing never leaves your Mac.",
    Icon: PrivateIcon,
  },
  {
    title: "Model Customization",
    description:
      "Apple Intelligence, open-source GGUF models, or bring your own.",
    Icon: ModelIcon,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function Card({ title, description, Icon }: CardProps) {
  return (
    <div className="flex h-full flex-col rounded-[1.25rem] border-2 border-line bg-background px-5 py-6 shadow-[0_4px_0_var(--line)] sm:px-6">
      <div className="flex h-13 w-13 items-center justify-center rounded-[1rem] border-2 border-line bg-accent-soft text-ink shadow-[0_3px_0_var(--line)] sm:h-14 sm:w-14">
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
      <div className="tabby-display mt-5 text-[1.75rem] leading-[1.05] tracking-tight text-ink sm:text-[2.1rem]">
        {title}
      </div>
      <div className="mt-3 text-sm leading-relaxed tracking-tight text-subtle sm:text-base">
        {description}
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
                Icon={card.Icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
