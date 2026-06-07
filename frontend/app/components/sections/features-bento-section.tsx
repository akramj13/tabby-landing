import { Smile, SpellCheck, WandSparkles, Zap, type LucideIcon } from "lucide-react";
import { BattingPawMascot } from "@/app/components/ui/batting-paw-mascot";
import { Stagger, StaggerItem } from "@/app/components/ui/motion";
import { DemoVideo } from "@/app/components/ui/demo-video";
import { IconTile } from "@/app/components/ui/icon-tile";
import { SectionHeading } from "@/app/components/ui/section-heading";

type Feature = {
  /** Clip name under /videos (no extension). */
  video: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** Tailwind bg color for the icon tile + top accent stripe. */
  tileBg: string;
};

const FEATURES: Feature[] = [
  {
    video: "autocomplete-feature",
    icon: WandSparkles,
    title: "autocomplete",
    description:
      "Ghost-text suggestions appear as you type. Press Tab to accept a word at a time, or keep typing to ignore.",
    tileBg: "bg-violet-500",
  },
  {
    video: "emoji-feature",
    icon: Smile,
    title: ":emoji: autocomplete",
    description:
      "Type a colon and a few letters — :smi, :tada — then Tab to drop in the emoji, anywhere.",
    tileBg: "bg-amber-400",
  },
  {
    video: "autocorrect-feature",
    icon: SpellCheck,
    title: "autocorrect",
    description:
      "Catches typos and clumsy phrasing inline, so you never break your flow to fix them.",
    tileBg: "bg-emerald-500",
  },
  {
    video: "macros-feature",
    icon: Zap,
    title: "/macro expansion",
    description:
      "Expand short triggers into the full snippets you type over and over.",
    tileBg: "bg-sky-500",
  },
];

// Every tile uses the autocomplete GIF's aspect ratio so cropping never happens.
const TILE_ASPECT = "aspect-[500/182]";

function FeatureMedia({ feature }: { feature: Feature }) {
  return (
    <div
      className={`relative ${TILE_ASPECT} overflow-hidden rounded-[1.1rem] border-2 border-line bg-surface-3`}
    >
      <DemoVideo
        name={feature.video}
        label={`${feature.title} demo`}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

function FeatureLabel({
  feature,
  size,
}: {
  feature: Feature;
  size: "hero" | "card";
}) {
  const Icon = feature.icon;
  const hero = size === "hero";
  return (
    <div className="flex items-center gap-3">
      <IconTile
        size={hero ? "lg" : "md"}
        tone={`${feature.tileBg} text-white`}
        hoverLift
      >
        <Icon className={hero ? "h-6 w-6" : "h-5 w-5"} strokeWidth={2.5} />
      </IconTile>
      <h3
        className={`font-bold leading-tight tracking-tight text-ink ${
          hero
            ? "text-[1.7rem] sm:text-[2.1rem]"
            : "text-[1.35rem] sm:text-[1.55rem]"
        }`}
      >
        {feature.title}
      </h3>
    </div>
  );
}

export function FeaturesBentoSection() {
  const [hero, ...rest] = FEATURES;

  return (
    <section className="mx-auto max-w-content">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-visible">
        <BattingPawMascot />
        <div className="relative z-20 mx-auto max-w-content px-6 sm:px-8 lg:px-10">
          <SectionHeading
            title="more than autocomplete"
            titleSize="text-[2.5rem] sm:text-[4rem]"
            subtitle="Four ways Cotabby speeds up your typing — all running locally on your Mac."
          />
        </div>
      </div>

      <Stagger stagger={0.1} className="mt-12 flex flex-col gap-5">
        {/* Featured: autocomplete is the whole product — give it the stage. */}
        <StaggerItem>
          <article className="tabby-panel group flex flex-col gap-5 rounded-[1.55rem] p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="lg:w-[58%]">
              <FeatureMedia feature={hero} />
            </div>
            <div className="px-1 pb-1 lg:flex-1">
              <FeatureLabel feature={hero} size="hero" />
              <p className="mt-3 max-w-xl text-base leading-relaxed tracking-tight text-muted sm:text-lg">
                {hero.description}
              </p>
            </div>
          </article>
        </StaggerItem>

        {/* The other three: supporting cast, compact 3-up row. */}
        <div className="grid gap-5 sm:grid-cols-3">
          {rest.map((feature) => (
            <StaggerItem key={feature.title} className="h-full">
              <article className="tabby-panel group flex h-full flex-col rounded-[1.55rem] p-4 sm:p-5">
                <FeatureMedia feature={feature} />
                <div className="mt-5 px-1 pb-1">
                  <FeatureLabel feature={feature} size="card" />
                  <p className="mt-2.5 text-sm leading-relaxed tracking-tight text-muted sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
