import Image from "next/image";
import Link from "next/link";
import { CREATOR, DISCORD_URL, GITHUB_URL, SUPPORT_EMAIL } from "../lib/site";
import { DownloadButton } from "./download-button";
import { GithubStarLabel } from "./github-star-label";
import { AppleIcon, DiscordIcon, GithubIcon, LinkedInIcon, XIcon } from "./icons";
import { FadeIn } from "./motion";

const footerPrimaryActionClass =
  "tabby-button tabby-button-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-[1rem] font-semibold leading-none tracking-tight sm:h-14 sm:text-[1.2rem]";

const footerSecondaryActionClass =
  "tabby-button tabby-button-secondary inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-[1rem] font-semibold leading-none tracking-tight sm:text-[1.2rem]";

const FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Release notes", href: "/release-notes" },
] as const;

const SOCIALS = [
  { label: "LinkedIn", href: CREATOR.linkedin, Icon: LinkedInIcon },
  { label: "X", href: CREATOR.x, Icon: XIcon },
  { label: "Discord", href: DISCORD_URL, Icon: DiscordIcon },
] as const;

export function FinalFooterSection() {
  return (
    <section className="border-t-2 border-line-soft pt-8 sm:pt-10">
      <FadeIn>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <h2 className="tabby-display max-w-175 text-[3.4rem] leading-[0.94] tracking-tight text-ink sm:text-[5.4rem]">
              type a lot faster.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed tracking-tight text-muted sm:text-base">
              Cozy AI autocomplete for the everyday notes, emails, and messages
              you were going to write anyway.
            </p>
          </div>

          <div className="w-full max-w-85 space-y-3">
            <DownloadButton className={footerPrimaryActionClass}>
              <AppleIcon className="h-5 w-5" />
              Download for Mac
            </DownloadButton>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={footerSecondaryActionClass}
            >
              <GithubIcon className="h-5 w-5" />
              <GithubStarLabel />
            </Link>
          </div>
        </div>
      </FadeIn>

      <div className="mt-10 flex flex-col gap-6 border-t-2 border-line-soft pt-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex items-center gap-3">
            <Image
              src="/512.png"
              alt="tabby paw logo"
              width={48}
              height={48}
              className="h-11 w-11 rounded-[0.95rem] border-2 border-line bg-surface-2 shadow-[0_3px_0_var(--line)]"
            />
            <div className="flex h-11 items-center gap-2">
              <span className="tabby-display text-[2rem] leading-[0.88] tracking-tight text-ink sm:text-[2.4rem]">
                tabby
              </span>
              <span className="rounded-md border-2 border-line bg-accent/15 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase leading-none tracking-widest text-accent">
                beta
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="tabby-link text-[1rem] font-medium leading-none tracking-tight sm:text-[1.1rem]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tabby-link text-sm font-medium leading-none tracking-tight sm:text-base"
            >
              {SUPPORT_EMAIL}
            </a>

            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] border-2 border-line bg-surface-2 text-ink shadow-[0_3px_0_var(--line)] transition-colors hover:bg-surface-3"
                >
                  <Icon className="h-4.5 w-4.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
