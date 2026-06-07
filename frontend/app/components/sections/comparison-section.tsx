"use client";

import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import {
  Check,
  Cpu,
  Forward,
  Infinity as InfinityIcon,
  Languages,
  PenLine,
  Ruler,
  ScanEye,
  Smile,
  SpellCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { OpenSourceIcon } from "@/app/components/ui/icons";
import { IconTile } from "@/app/components/ui/icon-tile";
import { ScaleIn } from "@/app/components/ui/motion";
import { PeekingCatMascot } from "@/app/components/ui/peeking-cat-mascot";
import { SectionHeading } from "@/app/components/ui/section-heading";

type Feature = {
  label: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  /** Whether Cotypist's free plan offers this. Cotabby offers everything. */
  cotypist: boolean;
};

// Shared capabilities first, then everything Cotypist's free plan leaves out -
// so the Cotypist column visibly fills with X's from the middle down.
// Cotypist free-plan parity verified 2026-06-07; re-check periodically.
const FEATURES: Feature[] = [
  { label: "Word-by-word acceptance", icon: Forward, cotypist: true },
  { label: "Emoji suggestions", icon: Smile, cotypist: true },
  { label: "Works across languages", icon: Languages, cotypist: true },
  { label: "Screen-aware suggestions", icon: ScanEye, cotypist: true },
  { label: "Autocorrect", icon: SpellCheck, cotypist: false },
  { label: "Full choice of models", icon: Cpu, cotypist: false },
  { label: "Configurable completion length", icon: Ruler, cotypist: false },
  { label: "Custom writing instructions", icon: PenLine, cotypist: false },
  { label: "Unlimited completions", icon: InfinityIcon, cotypist: false },
  { label: "Fully open source", icon: OpenSourceIcon, cotypist: false },
];

const GRID =
  "grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] sm:grid-cols-[1.6fr_1fr_1fr]";

function YesMark() {
  return (
    <IconTile size="sm" tone="bg-accent-green text-white">
      <Check className="h-5 w-5" strokeWidth={3} aria-label="Included" />
    </IconTile>
  );
}

function NoMark() {
  return (
    <IconTile size="sm" tone="bg-accent text-white">
      <X className="h-4 w-4" strokeWidth={3} aria-label="Not included" />
    </IconTile>
  );
}

function ColumnHeader({
  name,
  tagline,
  iconSrc,
  iconScale = 1,
  muted = false,
}: {
  name: string;
  tagline: string;
  iconSrc: string;
  iconScale?: number;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-2 py-4 text-center">
      <IconTile size="xs" tone="bg-surface">
        <Image
          src={iconSrc}
          alt={`${name} logo`}
          width={40}
          height={40}
          style={{ transform: `scale(${iconScale})` }}
          className="h-full w-full object-cover"
        />
      </IconTile>
      <span
        className={`text-sm font-bold leading-none tracking-tight sm:text-lg ${
          muted ? "text-subtle" : "text-ink"
        }`}
      >
        {name}
      </span>
      <span
        className={`hidden text-[0.7rem] font-semibold leading-none tracking-tight sm:block ${
          muted ? "text-subtle" : "text-muted"
        }`}
      >
        {tagline}
      </span>
    </div>
  );
}

export function ComparisonSection() {
  const lastIndex = FEATURES.length - 1;

  return (
    <section className="mx-auto max-w-content">
      <SectionHeading
        title="Cotabby vs Cotypist"
        titleSize="text-[2.4rem] sm:text-[4rem]"
        subtitle="Everything Cotypist's free plan does — plus everything it leaves out."
      />

      <ScaleIn className="relative mx-auto mt-14 max-w-3xl">
        <PeekingCatMascot />
        <div className="relative z-10 tabby-panel rounded-[1.85rem] p-5 sm:p-9">
          <div className={`${GRID} gap-x-3 sm:gap-x-6`}>
            {/* Header row */}
            <div className="flex items-end pb-4 pl-1">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-subtle">
                Feature
              </span>
            </div>
            <ColumnHeader
              name="Cotabby"
              tagline="free for everyone"
              iconSrc="/app-icons/cotabby-icon.webp"
            />
            <ColumnHeader
              name="Cotypist"
              tagline="limited free plan"
              iconSrc="/app-icons/cotypist.webp"
              iconScale={1.35}
              muted
            />

            {/* Feature rows */}
            {FEATURES.map((feature, i) => {
              const isLast = i === lastIndex;
              const divider = isLast ? "" : "border-b border-line-soft";
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="contents">
                  <div
                    className={`flex items-center gap-2.5 py-3.5 pl-1 pr-2 sm:gap-3 ${divider}`}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0 text-subtle sm:h-[1.05rem] sm:w-[1.05rem]"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                    <span className="text-sm leading-snug tracking-tight text-ink sm:text-base">
                      {feature.label}
                    </span>
                  </div>

                  <div
                    className={`flex items-center justify-center py-3.5 ${divider}`}
                  >
                    <YesMark />
                  </div>

                  <div
                    className={`flex items-center justify-center py-3.5 ${divider}`}
                  >
                    {feature.cotypist ? <YesMark /> : <NoMark />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScaleIn>
    </section>
  );
}
