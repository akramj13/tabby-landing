import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FeedbackForm } from "./feedback-form";

export const metadata: Metadata = {
  title: "Feedback - Cotabby",
  description: "Report a bug or request a feature for tabby.",
};

export default function FeedbackPage() {
  return (
    <div className="relative px-3 pb-14 pt-5 sm:px-4 sm:pb-16 sm:pt-8 lg:px-6 lg:pb-20 lg:pt-10">
      <div className="mx-auto w-full max-w-shell">
        <header className="border-b-2 border-line pb-5 sm:pb-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-subtle transition-colors hover:text-ink sm:mb-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
            Back to Cotabby
          </Link>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/app-icons/new-logo.webp"
              alt="Cotabby logo"
              width={56}
              height={56}
              sizes="56px"
              className="h-14 w-14 rounded-2xl border-2 border-line bg-surface-2 shadow-[0_6.7px_0_var(--line)]"
            />
            <span className="flex h-14 flex-col justify-center">
              <span className="flex items-center gap-2">
                <span className="tabby-display text-[2.4rem] leading-[0.88] tracking-tight text-ink sm:text-[2.8rem]">
                  Cotabby
                </span>
                <span className="text-[0.55rem] font-semibold uppercase leading-none tracking-widest text-ink/40">
                  beta
                </span>
              </span>
              <span className="mt-1 text-xs font-semibold leading-none tracking-tight text-subtle sm:text-sm">
                feedback
              </span>
            </span>
          </Link>
        </header>
      </div>

      <main className="mx-auto mt-8 w-full max-w-175 px-1 sm:mt-10">
        <h1 className="tabby-display text-[2.6rem] leading-[0.95] tracking-tight text-ink sm:text-[3.4rem] lg:text-[4rem]">
          Feedback
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          Found a bug or have an idea? Let us know and we&apos;ll create a
          tracked issue on GitHub.
        </p>

        <FeedbackForm />
      </main>
    </div>
  );
}
