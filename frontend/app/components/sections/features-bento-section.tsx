import Image from "next/image";
import { Smile, SpellCheck, WandSparkles, Zap, type LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "@/app/components/ui/motion";
import { IconTile } from "@/app/components/ui/icon-tile";
import { SectionHeading } from "@/app/components/ui/section-heading";

type Feature = {
  gif: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** Tailwind bg color for the icon tile + top accent stripe. */
  tileBg: string;
};

const FEATURES: Feature[] = [
  {
    gif: "/gifs/autocomplete-feature.webp",
    icon: WandSparkles,
    title: "autocomplete",
    description:
      "Ghost-text suggestions appear as you type. Press Tab to accept a word at a time, or keep typing to ignore.",
    tileBg: "bg-violet-500",
  },
  {
    gif: "/gifs/emoji-feature.webp",
    icon: Smile,
    title: "emoji shortcodes",
    description:
      "Type a colon and a few letters — :smi, :tada — then Tab to drop in the emoji, anywhere.",
    tileBg: "bg-amber-400",
  },
  {
    gif: "/gifs/autocorrect-feature.webp",
    icon: SpellCheck,
    title: "autocorrect",
    description:
      "Catches typos and clumsy phrasing inline, so you never break your flow to fix them.",
    tileBg: "bg-emerald-500",
  },
  {
    gif: "/gifs/macros-feature.webp",
    icon: Zap,
    title: "macros",
    description:
      "Expand short triggers into the full snippets you type over and over.",
    tileBg: "bg-sky-500",
  },
];

// Every tile uses the autocomplete GIF's aspect ratio so the grid is uniform.
const TILE_ASPECT = "aspect-[500/182]";

export function FeaturesBentoSection() {
  return (
    <section className="mx-auto max-w-content">
      <SectionHeading
        title="more than autocomplete"
        titleSize="text-[2.5rem] sm:text-[4rem]"
        subtitle="Four ways Cotabby speeds up your typing — all running locally on your Mac."
      />

      <Stagger stagger={0.1} className="mt-12 grid gap-5 sm:grid-cols-2">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <StaggerItem key={feature.title} className="h-full">
              <article className="tabby-panel group flex h-full flex-col rounded-[1.55rem] p-4 sm:p-5">
                <div
                  className={`relative ${TILE_ASPECT} overflow-hidden rounded-[1.1rem] border-2 border-line bg-surface-3`}
                >
                  <Image
                    src={feature.gif}
                    alt={`${feature.title} demo`}
                    fill
                    unoptimized
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-5 px-1 pb-1">
                  <div className="flex items-center gap-3">
                    <IconTile size="md" tone={`${feature.tileBg} text-white`} hoverLift>
                      <Icon className="h-5 w-5" strokeWidth={2.5} />
                    </IconTile>
                    <h3 className="text-[1.45rem] font-bold leading-tight tracking-tight text-ink sm:text-[1.7rem]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed tracking-tight text-muted sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
