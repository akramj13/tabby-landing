"use client";

import { m } from "framer-motion";
import { ArrowBigUp } from "lucide-react";
import Image from "next/image";
import { IconTile } from "@/app/components/ui/icon-tile";
import { TabbyPanel } from "@/app/components/ui/tabby-panel";
import { SectionHeading } from "@/app/components/ui/section-heading";

const EASE = [0.34, 1.56, 0.64, 1] as const; // springy back-out for the "pop"
const VIEWPORT = { once: true, amount: 0.3 } as const;
const POP_STEP = 0.16; // seconds between each bubble popping in

type Review = {
  user: string;
  quote: string;
  /** Position of the bubble's center as a % of the cloud container. */
  left: number;
  top: number;
  /** Resting rotation for a hand-pinned feel. */
  rotate: number;
  /** Order in which this bubble pops in (lower = earlier). */
  order: number;
};

// Ranked snippets — strongest social proof first, scattered so the punchiest
// lines (anti-subscription, "finally someone built this") sit up top.
const REVIEWS: Review[] = [
  { user: "Zealousideal-Hat-68", quote: "This is exactly what I was looking for.", left: 50, top: 12, rotate: -2, order: 1 },
  { user: "10dot", quote: "Pay more money to eat more of my own RAM… is just laughable.", left: 80, top: 26, rotate: -3, order: 2 },
  { user: "bearclaw191991", quote: "Thank YOU. I literally have no more money for subscriptions.", left: 20, top: 24, rotate: 3, order: 3 },
  { user: "cronberry", quote: "Just uninstalled Cotypist and installed Cotabby instead.", left: 82, top: 62, rotate: -2, order: 4 },
  { user: "hexxeric", quote: "Open-source — what I have been waiting for.", left: 76, top: 86, rotate: 3, order: 5 },
  { user: "areyouredditenough", quote: "You're doing god's work here!", left: 17, top: 58, rotate: 2, order: 6 },
  { user: "jittarao", quote: "I might just cancel my Cotypist sub.", left: 38, top: 86, rotate: -2, order: 7 },
];

export function ReviewsCloudSection() {
  return (
    <section className="mx-auto max-w-content">
      <SectionHeading
        title="people are switching"
        titleSize="text-[2.4rem] sm:text-[4rem]"
        subtitle="What folks are saying after ditching their autocomplete subscription."
      />

      {/* Mobile: a simple stacked column. sm+: the scattered "constellation"
         cloud with the center icon and connector lines (which would clip on
         narrow screens). */}
      <div className="relative mx-auto mt-12 flex w-full flex-col items-center gap-3 sm:mt-12 sm:block sm:h-[40rem]">
        {/* Faint dashed lines tying every bubble back to the center icon. Drawn
           behind the bubbles; each line draws in just before its bubble pops. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {REVIEWS.map((review) => (
            <m.line
              key={review.user}
              x1="50"
              y1="50"
              x2={review.left}
              y2={review.top}
              stroke="var(--color-line)"
              strokeWidth={1}
              strokeDasharray="3 4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.4 }}
              viewport={VIEWPORT}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: 0.3 + review.order * POP_STEP,
              }}
            />
          ))}
        </svg>

        {/* Center Cotabby icon — pops first */}
        <m.div
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: EASE }}
          className="z-10 hidden sm:absolute sm:left-1/2 sm:top-1/2 sm:block sm:-translate-x-1/2 sm:-translate-y-1/2"
        >
          <IconTile size="3xl" tone="bg-white" className="tabby-cat-breathe">
            <Image
              src="/app-icons/cotabby-icon.webp"
              alt="Cotabby"
              width={112}
              height={112}
              className="h-full w-full object-contain"
            />
          </IconTile>
        </m.div>

        {/* Review bubbles — pop in one by one after the icon */}
        {REVIEWS.map((review, index) => (
          <m.figure
            key={review.user}
            initial={{ opacity: 0, scale: 0.5, y: 12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: review.rotate }}
            viewport={VIEWPORT}
            transition={{
              duration: 0.5,
              ease: EASE,
              delay: 0.45 + review.order * POP_STEP,
            }}
            style={{ left: `${review.left}%`, top: `${review.top}%` }}
            className={`w-full max-w-sm sm:absolute sm:block sm:w-56 sm:max-w-none sm:-translate-x-1/2 sm:-translate-y-1/2 ${
              index >= 4 ? "hidden" : ""
            }`}
          >
            <TabbyPanel size="sm" tone="bg-surface" className="px-3.5 py-2.5">
              <blockquote className="text-[0.78rem] font-semibold leading-snug tracking-tight text-ink sm:text-sm">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-2 flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5">
                  <Image
                    src="/app-icons/reddit.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4 shrink-0"
                  />
                  <span className="truncate text-[0.68rem] font-bold tracking-tight text-subtle">
                    u/{review.user}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center rounded-full bg-surface-3 p-1">
                  <ArrowBigUp
                    className="h-3.5 w-3.5 fill-current text-[#ff4500]"
                    strokeWidth={0}
                  />
                </span>
              </figcaption>
            </TabbyPanel>
          </m.figure>
        ))}
      </div>
    </section>
  );
}
