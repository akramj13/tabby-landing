import { LazyYouTube } from "./lazy-youtube";
import { FadeIn, ScaleIn, WordReveal } from "./motion";
import { PawMark } from "./paw-mark";

export function DemoVideoSection() {
  return (
    <div className="mx-auto">
      <WordReveal
        as="h2"
        text="watch Cotabby in action"
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
          <PawMark className="pointer-events-none absolute -top-7 right-12 z-10 w-14 rotate-6 text-ink/80 sm:w-16" />
          <LazyYouTube
            videoId="p3TIgxQFQGE"
            title="Cotabby demo video"
            className="relative aspect-video w-full overflow-hidden rounded-[1.35rem] border-2 border-line bg-surface shadow-[0_11.8px_0_var(--line)]"
            iframeClassName="h-full w-full object-cover"
          />
        </div>
      </ScaleIn>
    </div>
  );
}
