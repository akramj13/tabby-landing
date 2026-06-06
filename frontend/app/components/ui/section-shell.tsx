import type { ReactNode } from "react";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
};

export function SectionShell({ children, className }: SectionShellProps) {
  return (
    <section
      className={`tabby-shell relative mx-auto flex w-full max-w-shell flex-col overflow-hidden rounded-4xl ${
        className ?? ""
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">{children}</div>
    </section>
  );
}
