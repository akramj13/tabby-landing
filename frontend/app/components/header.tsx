"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { DownloadButton } from "./download-button";
import { useEmailGate } from "./email-gate";
import { AppleIcon } from "./icons";

const textLinks = [
  { href: "#demo", label: "demo" },
  { href: "#how-it-works", label: "how it works" },
  { href: "#faq", label: "faq" },
] as const;

const downloadActionClass =
  "tabby-button tabby-button-blue inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold tracking-tight sm:h-14 sm:px-6 sm:text-base";

function scrollToAnchor(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) {
    return;
  }

  const target = document.querySelector<HTMLElement>(href);
  if (!target) {
    return;
  }

  const y = target.getBoundingClientRect().top + window.scrollY - 80; // Allow some leeway

  event.preventDefault();

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({
    top: y,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

export function Header() {
  const { openMailingList } = useEmailGate();
  return (
    <header id="site-header" className="border-b-2 border-line pb-6 sm:pb-8">
      <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-8">
          <Link
            href="#top"
            onClick={(event) => scrollToAnchor(event, "#top")}
            className="flex items-center gap-3"
          >
            <Image
              src="/app-icons/new-logo.webp"
              alt="Cotabby logo"
              width={48}
              height={48}
              sizes="44px"
              priority
              className="h-11 w-11 rounded-[0.95rem] border-2 border-line bg-surface-2 shadow-[0_5px_0_var(--line)]"
            />
            <span className="flex h-11 items-center gap-2">
              <span className="tabby-display text-[2.5rem] leading-[0.88] tracking-tight text-ink sm:text-[3rem]">
                Cotabby
              </span>
              <span className="text-[0.65rem] font-semibold uppercase leading-none tracking-widest text-ink/65">
                beta
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 pl-1 lg:pb-1 lg:pl-0"
          >
            {textLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => scrollToAnchor(event, link.href)}
                className="tabby-link text-sm font-bold tracking-tight transition hover:text-ink sm:text-base"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={openMailingList}
              className="tabby-link text-sm font-bold tracking-tight transition hover:text-ink sm:text-base"
            >
              join mailing list
            </button>
          </nav>
        </div>

        <div className="flex w-full justify-start sm:w-auto sm:items-center lg:justify-end">
          <DownloadButton className={downloadActionClass}>
            <AppleIcon className="h-5 w-5" />
            Download for Mac
          </DownloadButton>
        </div>
      </div>
    </header>
  );
}
