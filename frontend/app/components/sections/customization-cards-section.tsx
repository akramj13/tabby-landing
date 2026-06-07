"use client";

import {
  AppWindow,
  BookOpen,
  Cpu,
  Palette,
  PenLine,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { IconTile } from "@/app/components/ui/icon-tile";
import { Stagger, StaggerItem } from "@/app/components/ui/motion";
import { TabbyPanel } from "@/app/components/ui/tabby-panel";
import { SectionHeading } from "@/app/components/ui/section-heading";

type Feature = {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: Cpu,
    iconColor: "text-violet-500",
    title: "your model, your call",
    description: "Apple Intelligence on-device or your own GGUF.",
  },
  {
    icon: Ruler,
    iconColor: "text-blue-500",
    title: "dial the length",
    description: "2–4 words or 12–20. Finish a thought, not an essay.",
  },
  // {
  //   icon: PenLine,
  //   iconColor: "text-emerald-500",
  //   title: "write like you",
  //   description: "Drop in a few rules and completions match your voice, not a generic default.",
  // },
  {
    icon: BookOpen,
    iconColor: "text-amber-500",
    title: "feed it context",
    description: "Paste your style guide once. Cotabby will remember it.",
  },
  {
    icon: AppWindow,
    iconColor: "text-rose-500",
    title: "pick your apps",
    description: "Block Cotabby on any app with one toggle.",
  },
  {
    icon: Palette,
    iconColor: "text-fuchsia-500",
    title: "make it invisible",
    description: "Tweak color and opacity until it's perfect.",
  },
];

export function CustomizationCardsSection() {
  return (
    <section className="mx-auto max-w-content">
      <SectionHeading
        title="make Cotabby feel like yours"
        titleSize="text-[2.4rem] sm:text-[4.1rem]"
        subtitle="Tune the suggestions so they feel helpful, not intrusive."
      />

      <div className="tabby-panel mt-12 grid gap-6 rounded-[1.55rem] p-5 sm:p-7 lg:grid-cols-[1.7fr_1fr] lg:items-center lg:gap-8">
        <TabbyPanel
          size="xl"
          className="relative aspect-video w-full overflow-hidden"
        >
          <Image
            src="/gifs/settings.webp"
            alt="Cotabby settings"
            fill
            unoptimized
            className="object-cover"
          />
        </TabbyPanel>

        <Stagger stagger={0.1} className="flex flex-col gap-4 sm:gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <div className="flex items-start gap-3.5">
                  <IconTile size="md" tone="bg-surface-3">
                    <Icon
                      className={`h-5 w-5 ${feature.iconColor}`}
                      strokeWidth={2}
                    />
                  </IconTile>
                  <div>
                    <h3 className="text-lg font-bold leading-tight tracking-tight text-ink sm:text-xl">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed tracking-tight text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
