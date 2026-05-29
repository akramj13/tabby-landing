import { FadeIn, WordReveal } from "./motion";
import { CotabbyLogoChip } from "./cotabby-logo-chip";

export function AppsCarouselSection() {
  const chips = [
    { label: "Apple Mail", iconSrc: "/app-icons/apple-mail.webp" },
    { label: "Apple Notes", iconSrc: "/app-icons/apple-notes.svg" },
    { label: "Google Chrome", iconSrc: "/app-icons/google-chrome.webp" },
    { label: "Microsoft Outlook", iconSrc: "/app-icons/microsoft-outlook.webp" },
    { label: "Gmail", iconSrc: "/app-icons/gmail.svg" },
    { label: "iMessage", iconSrc: "/app-icons/imessage.svg" },
    { label: "Notion", iconSrc: "/app-icons/notion.svg" },
    { label: "Discord", iconSrc: "/app-icons/discord.webp" },
    { label: "Slack", iconSrc: "/app-icons/slack.webp" },
  ];
  const track = [...chips, ...chips];
  const reverseTrack = [...chips.slice().reverse(), ...chips.slice().reverse()];

  return (
    <div className="mx-auto">
      <WordReveal
        as="h2"
        text="works in apps like"
        className="tabby-display text-center text-[2.7rem] leading-[1.02] tracking-tight text-ink sm:text-[3.6rem]"
      />
      <FadeIn delay={0.1}>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          Mail, notes, docs, messages, wherever you happen to be typing.
        </p>
      </FadeIn>

      <div className="relative mt-10 space-y-3 overflow-hidden rounded-[1.5rem] px-3 py-4 sm:px-4 sm:py-5">
        <div
          className="tabby-marquee-track"
          aria-label="Supported apps carousel"
        >
          {track.map((app, index) => (
            <CotabbyLogoChip
              key={`chip-${app.label}-${index}`}
              label={app.label}
              iconSrc={app.iconSrc}
              className="tabby-marquee-item"
            />
          ))}
        </div>
        <div
          className="tabby-marquee-track tabby-marquee-track-reverse"
          aria-hidden="true"
        >
          {reverseTrack.map((app, index) => (
            <CotabbyLogoChip
              key={`chip-rev-${app.label}-${index}`}
              label={app.label}
              iconSrc={app.iconSrc}
              className="tabby-marquee-item"
            />
          ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-linear-to-r from-background to-transparent sm:w-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-l from-background to-transparent sm:w-20"
        />
      </div>
    </div>
  );
}
