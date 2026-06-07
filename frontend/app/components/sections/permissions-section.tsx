"use client";

import type { ComponentType, SVGProps } from "react";
import { useRef } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { Keyboard, Monitor } from "lucide-react";
import { AccessibilityIcon } from "@/app/components/ui/icons";
import { HoverLift, Stagger, StaggerItem } from "@/app/components/ui/motion";
import { IconTile } from "@/app/components/ui/icon-tile";
import { TabbyPanel } from "@/app/components/ui/tabby-panel";
import { SectionHeading } from "@/app/components/ui/section-heading";

type Permission = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  /** Short, plain-language reason shown under the title. */
  why: string;
  /** Tailwind bg color for the icon tile (matches macOS System Settings). */
  tileBg: string;
};

// Mirrors the macOS System Settings → Privacy & Security rows verbatim:
// the Universal Access figure, a keyboard, and a display — each a white SF-style
// glyph on the muted graphite tile macOS actually uses for these list rows.
const SYSTEM_TILE = "bg-zinc-500";

const PERMISSIONS: Permission[] = [
  {
    icon: AccessibilityIcon,
    title: "Accessibility",
    why: "Finds the focused text field and places ghost text right at your caret.",
    tileBg: SYSTEM_TILE,
  },
  {
    icon: Keyboard,
    title: "Input Monitoring",
    why: "Detects typing and lets Tab accept the suggestion.",
    tileBg: SYSTEM_TILE,
  },
  {
    icon: Monitor,
    title: "Screen Recording",
    why: "Reads a screenshot around the field for visual (OCR) context.",
    tileBg: SYSTEM_TILE,
  },
];

function Toggle({ on, delay }: { on: boolean; delay: number }) {
  return (
    <m.span
      aria-hidden="true"
      className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full px-0.5"
      animate={{
        backgroundColor: on
          ? "var(--color-accent-green)"
          : "var(--color-surface-4)",
      }}
      transition={{ duration: 0.25, delay }}
    >
      <m.span
        className="h-6 w-6 rounded-full bg-white shadow-sm"
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 32, delay }}
      />
    </m.span>
  );
}

export function PermissionsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="mx-auto max-w-content">
      <SectionHeading
        title="your Mac, your data"
        titleSize="text-[2.9rem] sm:text-[4.1rem]"
        subtitle="Three macOS permissions, granted once — here's what each is for."
      />

      <div ref={ref} className="mx-auto mt-12 max-w-2xl">
        <Stagger stagger={0.12} className="space-y-4">
          {PERMISSIONS.map((permission, i) => {
            const Icon = permission.icon;
            return (
              <StaggerItem key={permission.title}>
                <HoverLift lift={3}>
                  <TabbyPanel
                    size="lg"
                    tone="bg-surface"
                    className="flex items-center gap-4 p-5 sm:gap-5 sm:p-6"
                  >
                    <IconTile size="lg" tone={`${permission.tileBg} text-white`}>
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </IconTile>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold leading-tight tracking-tight text-ink sm:text-xl">
                        {permission.title}
                      </h3>
                      <p className="mt-1 text-sm leading-snug tracking-tight text-muted">
                        {permission.why}
                      </p>
                    </div>
                    <Toggle
                      on={inView}
                      delay={reduced ? 0 : 0.25 + i * 0.22}
                    />
                  </TabbyPanel>
                </HoverLift>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
