"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { MailingListInput } from "@/app/components/ui/mailing-list-input";
import { IconTile } from "@/app/components/ui/icon-tile";
import { SUPPORT_EMAIL } from "@/app/lib/site";

const textLinks = [
  { href: "#how-it-works", label: "how it works" },
  { href: "#privacy", label: "privacy" },
  { href: "#faq", label: "faq" },
  { href: "/feedback", label: "feedback" },
  { href: `mailto:${SUPPORT_EMAIL}`, label: "contact" },
] as const;

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
  return (
    <header id="site-header" className="border-b-2 border-line pb-6 sm:pb-8">
      <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-8">
          <Link
            href="#top"
            onClick={(event) => scrollToAnchor(event, "#top")}
            className="flex items-center gap-3"
          >
            <IconTile size="lg" tone="bg-white">
              <Image
                src="/logo.webp"
                alt="Cotabby logo"
                width={72}
                height={72}
                sizes="72px"
                priority
                className="h-full w-full object-contain"
              />
            </IconTile>
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
            {textLinks.map((link) => {
              const className =
                "tabby-link text-sm font-bold tracking-tight transition hover:text-ink sm:text-base";
              if (link.href.startsWith("#") || link.href.startsWith("/")) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(event) => scrollToAnchor(event, link.href)}
                    className={className}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a key={link.href} href={link.href} className={className}>
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex w-full justify-start sm:w-auto sm:items-end lg:justify-end">
          <MailingListInput className="sm:w-auto" />
        </div>
      </div>
    </header>
  );
}
