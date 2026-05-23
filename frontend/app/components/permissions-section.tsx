"use client";

import {
  FadeIn,
  HoverLift,
  ScaleIn,
  Stagger,
  StaggerItem,
  WordReveal,
} from "./motion";

type Permission = {
  eyebrow: string;
  icon: "accessibility" | "input" | "screen";
  title: string;
  description: string;
  stays: string;
};

const permissions: Permission[] = [
  {
    eyebrow: "accessibility",
    icon: "accessibility",
    title: "reads text fields",
    description:
      "tabby reads the focused text field, caret position, and surrounding text through the macOS Accessibility API. This is how it knows what you've typed and where to place suggestions.",
    stays: "Text content is processed in-memory and never written to disk or sent anywhere.",
  },
  {
    eyebrow: "input monitoring",
    icon: "input",
    title: "detects your typing",
    description:
      "tabby monitors keyboard events to detect typing activity and Tab key presses for accepting suggestions. It categorizes key events but does not log individual keystrokes.",
    stays: "Keystrokes are categorized but never logged, stored, or transmitted.",
  },
  {
    eyebrow: "screen recording",
    icon: "screen",
    title: "captures visual context",
    description:
      "tabby captures a small region around the focused text field using ScreenCaptureKit. Visual context helps the model understand formatting and what you're replying to.",
    stays: "Screenshots are processed locally in real-time and immediately discarded.",
  },
];

function PermissionIcon({ type }: { type: Permission["icon"] }) {
  if (type === "accessibility") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="8" r="1.5" fill="currentColor" stroke="none" />
        <path d="M8 13.5L12 11l4 2.5" />
        <path d="M9.5 18l1.5-4h2l1.5 4" />
      </svg>
    );
  }
  if (type === "input") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h0" />
        <path d="M10 10h0" />
        <path d="M14 10h0" />
        <path d="M18 10h0" />
        <path d="M8 14h8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

function PermissionCard({ permission }: { permission: Permission }) {
  return (
    <HoverLift lift={5} className="h-full">
      <article className="tabby-panel-soft flex h-full min-h-96 flex-col gap-4 rounded-[1.55rem] p-6 sm:min-h-100 sm:p-7">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-line bg-surface-3 text-ink shadow-[0_2px_0_var(--line)]">
            <PermissionIcon type={permission.icon} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss sm:text-[0.75rem]">
            {permission.eyebrow}
          </p>
        </div>
        <h3 className="text-[1.65rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.9rem]">
          {permission.title}
        </h3>
        <p className="max-w-md text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          {permission.description}
        </p>
        <div className="mt-auto rounded-[1.2rem] border-2 border-line bg-surface-2 p-4 shadow-[0_3px_0_var(--line)]">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 shrink-0 text-moss"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm leading-relaxed tracking-tight text-muted">
              {permission.stays}
            </p>
          </div>
        </div>
      </article>
    </HoverLift>
  );
}

export function PermissionsSection() {
  return (
    <section className="mx-auto max-w-305">
      <WordReveal
        as="h2"
        text="your Mac, your data"
        className="tabby-display text-center text-[2.9rem] leading-[1.02] tracking-tight text-ink sm:text-[4.1rem]"
      />
      <FadeIn delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          tabby needs three macOS permissions to work. Here&apos;s exactly what
          each one does and why nothing ever leaves your machine.
        </p>
      </FadeIn>

      <Stagger stagger={0.12} className="mt-12 grid gap-6 lg:grid-cols-3">
        {permissions.map((p, i) => (
          <StaggerItem key={p.eyebrow}>
            <ScaleIn delay={i * 0.08}>
              <PermissionCard permission={p} />
            </ScaleIn>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
