import { FadeIn, ScaleIn, WordReveal } from "./motion";

export function DemoVideoSection() {
  return (
    <div className="mx-auto">
      <WordReveal
        as="h2"
        text="watch tabby in action"
        className="tabby-display text-center text-[2.8rem] leading-[1.02] tracking-tight text-ink sm:text-[4rem]"
      />
      <FadeIn delay={0.1}>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed tracking-tight text-muted sm:text-base">
          See how the suggestions feel inside a real writing flow, instead of
          floating around like a checklist.
        </p>
      </FadeIn>

      <ScaleIn delay={0.1} from={0.94}>
        <div className="relative isolate mt-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[14%] -right-[2%] top-[4%] -z-10 h-[82%] rounded-[2.8rem] bg-[radial-gradient(circle_at_top_right,_rgba(224,135,119,0.38),_transparent_66%)] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[8%] left-[4%] -z-10 h-[78%] w-[68%] rounded-[2.8rem] bg-[radial-gradient(circle_at_bottom_left,_rgba(142,174,130,0.24),_transparent_70%)] blur-[78px]"
          />
          <div className="relative aspect-video w-full overflow-hidden rounded-[1.35rem] border-2 border-line bg-background shadow-[0_7px_0_var(--line)]">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/p3TIgxQFQGE?autoplay=1&mute=1&playsinline=1&rel=0&loop=1&playlist=p3TIgxQFQGE&controls=0&disablekb=1"
              title="tabby demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="absolute inset-0 z-10" />
          </div>
        </div>
      </ScaleIn>
    </div>
  );
}
