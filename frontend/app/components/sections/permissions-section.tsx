"use client";

import { Accessibility, Check, Keyboard, ScanLine, type LucideIcon } from "lucide-react";
import {
  HoverLift,
  ScaleIn,
  Stagger,
  StaggerItem,
} from "@/app/components/ui/motion";
import { SectionHeading } from "@/app/components/ui/section-heading";

type Permission = {
  icon: LucideIcon;
  title: string;
  description: string;
  stays: string;
};

const permissions: Permission[] = [
  {
    icon: Accessibility,
    title: "reads text fields",
    description:
      "Reads the focused field, caret position, and nearby text through the macOS Accessibility API to place suggestions.",
    stays: "Processed in memory, never written to disk or sent anywhere.",
  },
  {
    icon: Keyboard,
    title: "detects your typing",
    description:
      "Watches keyboard events to detect typing and Tab presses for accepting suggestions.",
    stays: "Categorized as you type, never logged, stored, or transmitted.",
  },
  {
    icon: ScanLine,
    title: "captures visual context",
    description:
      "Captures a small region around the focused field via ScreenCaptureKit so the model can read layout and context.",
    stays: "Read locally in real time, discarded the instant it's used.",
  },
];

function PermissionCard({ permission }: { permission: Permission }) {
  const Icon = permission.icon;
  return (
    <HoverLift lift={5} className="h-full">
      <article className="tabby-panel flex h-full flex-col rounded-[1.55rem] p-6 sm:p-7">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-surface-3 text-ink shadow-[0_3.4px_0_var(--line)]">
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
        <h3 className="mt-5 text-[1.6rem] font-bold leading-tight tracking-tight text-ink sm:text-[1.85rem]">
          {permission.title}
        </h3>
        <p className="mt-3 mb-5 text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          {permission.description}
        </p>
        <div className="mt-auto flex items-start gap-3 rounded-2xl border-2 border-line-soft bg-surface-3 p-4">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-blue text-background">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <p className="text-sm font-medium leading-relaxed tracking-tight text-ink/85">
            {permission.stays}
          </p>
        </div>
      </article>
    </HoverLift>
  );
}

export function PermissionsSection() {
  return (
    <section className="mx-auto max-w-content">
      <SectionHeading
        title="your Mac, your data"
        titleSize="text-[2.9rem] sm:text-[4.1rem]"
        subtitle="Cotabby needs three macOS permissions to work. Here's exactly what each one does and why nothing ever leaves your machine."
      />

      <Stagger stagger={0.12} className="mt-14 grid items-stretch gap-8 lg:grid-cols-3">
        {permissions.map((p, i) => (
          <StaggerItem key={p.title} className="h-full">
            <ScaleIn delay={i * 0.08} className="h-full">
              <PermissionCard permission={p} />
            </ScaleIn>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
