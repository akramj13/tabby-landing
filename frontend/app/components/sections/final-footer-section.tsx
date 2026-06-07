import Image from "next/image";
import Link from "next/link";
import {
  CREATOR,
  DISCORD_URL,
  GITHUB_URL,
  SUPPORT_EMAIL,
} from "@/app/lib/site";
import { DownloadButton } from "@/app/components/ui/download-button";
import { IconTile } from "@/app/components/ui/icon-tile";
import {
  AppleIcon,
  DiscordIcon,
  GithubIcon,
  LinkedInIcon,
  XIcon,
} from "@/app/components/ui/icons";
import { FadeIn } from "@/app/components/ui/motion";
import { SupportButton } from "@/app/components/ui/support-button";
import { TabbyButton } from "@/app/components/ui/tabby-button";

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
              free, private, and yours.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed tracking-tight text-muted sm:text-base">
              Cozy AI autocomplete for the everyday notes, emails, and messages.
            </p>
          </div>

          <div className="relative w-full max-w-85 space-y-3">
            <SupportButton size="sm" fullWidth />
            <DownloadButton
              size="sm"
              fullWidth
              icon={<AppleIcon className="h-5 w-5" />}
            >
              Download for Mac
            </DownloadButton>
            <TabbyButton
              href={GITHUB_URL}
              external
              variant="secondary"
              size="sm"
              fullWidth
              icon={<GithubIcon className="h-5 w-5" />}
            >
              Star on GitHub
            </TabbyButton>
          </div>
        </div>
      </FadeIn>

      <div className="mt-10 flex flex-col gap-6 border-t-2 border-line-soft pt-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex items-center gap-3">
            <IconTile size="md" tone="bg-white">
              <Image
                src="/logo.webp"
                alt="Cotabby logo"
                width={48}
                height={48}
                sizes="44px"
                className="h-full w-full object-contain"
              />
            </IconTile>
            <div className="flex h-11 items-center gap-2">
              <span className="tabby-display text-[2rem] leading-[0.88] tracking-tight text-ink sm:text-[2.4rem]">
                Cotabby
              </span>
              <span className="text-[0.55rem] font-semibold uppercase leading-none tracking-widest text-ink/65">
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
                className="tabby-link text-[1rem] font-semibold leading-none tracking-tight sm:text-[1.1rem]"
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
              className="tabby-link text-sm font-semibold leading-none tracking-tight sm:text-base"
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
                  className="transition-colors hover:opacity-80"
                >
                  <IconTile
                    size="md"
                    tone="bg-surface-2 text-ink hover:bg-surface-3"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </IconTile>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
