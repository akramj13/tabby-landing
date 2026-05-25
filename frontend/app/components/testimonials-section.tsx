import { FadeIn, HoverLift, ScaleIn, Stagger, StaggerItem } from "./motion";

type ReviewCardProps = {
  quote: string;
  name: string;
  meta: string;
  accent?: "default" | "featured" | "muted";
  className?: string;
  quoteClassName?: string;
  showBig?: boolean;
};

type AvatarProps = {
  initials: string;
  tone: "accent" | "moss" | "surface";
};

function Avatar({ initials, tone }: AvatarProps) {
  const bg =
    tone === "accent"
      ? "bg-accent/25"
      : tone === "moss"
        ? "bg-moss/25"
        : "bg-surface-4";
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-[0.9rem] border-2 border-line text-ink shadow-[0_3.4px_0_var(--line)] ${bg}`}
    >
      <span className="text-sm font-bold tracking-tight">{initials}</span>
    </div>
  );
}

function ReviewCard({
  quote,
  name,
  meta,
  accent = "default",
  className = "",
  quoteClassName = "",
  showBig = false,
}: ReviewCardProps) {
  const surfaceClass =
    accent === "featured"
      ? "bg-surface-2"
      : accent === "muted"
        ? "bg-surface-3"
        : "bg-surface-2";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const tone: AvatarProps["tone"] =
    accent === "featured" ? "accent" : accent === "muted" ? "moss" : "surface";

  return (
    <HoverLift lift={4} className="h-full">
      <article
        className={`relative flex h-full flex-col rounded-[1.3rem] border-2 border-line p-6 shadow-[0_8.4px_0_var(--line)] sm:p-7 ${surfaceClass} ${className}`}
      >
        {showBig && (
          <span
            aria-hidden="true"
            className="tabby-display pointer-events-none absolute -top-3 right-5 text-[5rem] leading-none text-accent/30 sm:text-[6rem]"
          >
            &ldquo;
          </span>
        )}
        <p
          className={`relative text-base leading-relaxed tracking-tight text-ink sm:text-[1.1rem] lg:text-[1.15rem] ${quoteClassName}`}
        >
          {quote}
        </p>

        <div className="mt-auto flex items-center gap-3 border-t-2 border-line-soft pt-5">
          <Avatar initials={initials} tone={tone} />
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight text-ink">
              {name}
            </p>
            <p className="text-sm tracking-tight text-subtle">{meta}</p>
          </div>
        </div>
      </article>
    </HoverLift>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-305">
      <FadeIn>
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="tabby-display text-[2.7rem] leading-[1.02] tracking-tight text-ink sm:text-[4rem]">
            people using Cotabby, daily
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed tracking-tight text-muted sm:text-base">
            A handful of believable notes from people using Cotabby for class,
            internships, side projects, and everyday writing on macOS.
          </p>
        </div>
      </FadeIn>

      <Stagger
        stagger={0.1}
        className="mt-12 grid gap-4 sm:gap-5 md:grid-cols-12 md:auto-rows-[minmax(176px,auto)] xl:auto-rows-[minmax(188px,auto)]"
      >
        <StaggerItem className="md:col-span-7 md:row-span-2">
          <ScaleIn>
            <ReviewCard
              accent="featured"
              showBig
              className="min-h-76 lg:min-h-100"
              quoteClassName="text-[1.38rem] leading-[1.18] sm:text-[1.82rem] lg:text-[2.14rem]"
              quote="I used to rewrite follow-up emails three times before sending. Now the first suggestion is usually close enough that I tweak a line and hit send. It still sounds like me, just faster. I spend less time second-guessing every sentence and more time actually replying."
              name="Maya Chen"
              meta="February 14, 2026"
            />
          </ScaleIn>
        </StaggerItem>

        <StaggerItem className="md:col-span-5">
          <ScaleIn delay={0.08}>
            <ReviewCard
              className="min-h-54 lg:min-h-61"
              quote="The inline ghost text is quiet, which I like. It helps me stay in flow instead of switching to a separate writing tool."
              name="Darren Park"
              meta="January 23, 2026"
            />
          </ScaleIn>
        </StaggerItem>

        <StaggerItem className="md:col-span-5">
          <ScaleIn delay={0.16}>
            <ReviewCard
              accent="muted"
              className="min-h-54 lg:min-h-61"
              quote="For meeting notes, it picks up where I was going and keeps the tone natural. I spend less time cleaning up rough drafts after calls."
              name="Sofia Malik"
              meta="March 8, 2026"
            />
          </ScaleIn>
        </StaggerItem>

        <StaggerItem className="md:col-span-5">
          <ScaleIn delay={0.18}>
            <ReviewCard
              className="min-h-53 lg:min-h-60"
              quote="The local-only story sold me. I can use it on customer email without a privacy review."
              name="Priya Nair"
              meta="April 19, 2026"
            />
          </ScaleIn>
        </StaggerItem>

        <StaggerItem className="md:col-span-7">
          <ScaleIn delay={0.22}>
            <ReviewCard
              accent="featured"
              className="min-h-53 lg:min-h-60"
              quoteClassName="sm:text-[1.15rem] lg:text-[1.22rem]"
              quote="We are shipping updates faster because release summaries and internal docs start with a strong draft instead of a blank page - and nothing leaves the machine."
              name="Noah Rivera"
              meta="May 2, 2026"
            />
          </ScaleIn>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
