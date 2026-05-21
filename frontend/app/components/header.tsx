"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { DISCORD_URL, GITHUB_URL } from "../lib/site";
import { DownloadButton } from "./download-button";
import { GithubStarLabel } from "./github-star-label";
import { AppleIcon, DiscordIcon, GithubIcon } from "./icons";

const textLinks = [
  { href: "#demo", label: "demo" },
  { href: "#how-it-works", label: "how it works" },
  { href: "#privacy", label: "privacy" },
  { href: "#faq", label: "faq" },
] as const;

const secondaryActionClass =
  "tabby-button tabby-button-secondary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold tracking-tight sm:h-14 sm:px-6 sm:text-base";

const primaryActionClass =
  "tabby-button tabby-button-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold tracking-tight sm:h-14 sm:px-6 sm:text-base";

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
            <Image
              src="/512.png"
              alt="tabby paw logo"
              width={48}
              height={48}
              className="h-11 w-11 rounded-[0.95rem] border-2 border-line bg-surface-2 shadow-[0_3px_0_var(--line)]"
            />
            <span className="flex h-11 items-center gap-2">
              <span className="tabby-display text-[2.5rem] leading-[0.88] tracking-tight text-ink sm:text-[3rem]">
                tabby
              </span>
              <span className="rounded-md border-2 border-line bg-accent/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase leading-none tracking-widest text-accent">
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
                className="tabby-link text-sm font-semibold tracking-tight transition hover:text-ink sm:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryActionClass}
          >
            <DiscordIcon className="h-5 w-5" />
            Discord
          </Link>
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryActionClass}
          >
            <GithubIcon className="h-5 w-5" />
            <GithubStarLabel />
          </Link>
          <DownloadButton className={primaryActionClass}>
            <AppleIcon className="h-5 w-5" />
            Download for Mac
          </DownloadButton>
        </div>
      </div>
    </header>
  );
}
