import type { ReactNode } from "react";
import { LegalHeader, type LegalPageKey } from "@/app/components/layout/legal-header";

type LegalPageShellProps = {
  current: LegalPageKey;
  title: string;
  summary: string;
  updatedAt: string;
  children: ReactNode;
};

export function LegalPageShell({
  current,
  title,
  summary,
  updatedAt,
  children,
}: LegalPageShellProps) {
  return (
    <div className="relative px-3 pb-14 pt-5 sm:px-4 sm:pb-16 sm:pt-8 lg:px-6 lg:pb-20 lg:pt-10">
      <div className="mx-auto w-full max-w-shell">
        <LegalHeader current={current} />
      </div>

      <main className="mx-auto mt-8 w-full max-w-225 space-y-6 px-1 text-sm leading-relaxed tracking-tight text-muted sm:mt-10 sm:text-base">
        <h1 className="tabby-display text-[2.6rem] leading-[0.95] tracking-tight text-ink sm:text-[3.4rem] lg:text-[4rem]">
          {title}
        </h1>
        <p className="max-w-3xl">{summary}</p>
        <p className="text-xs font-semibold tracking-[0.08em] text-subtle sm:text-sm">
          LAST UPDATED {updatedAt}
        </p>

        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}
