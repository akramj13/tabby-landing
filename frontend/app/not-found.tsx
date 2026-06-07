import { TabbyButton } from "@/app/components/ui/tabby-button";

// Root not-found UI. Renders inside the root layout (fonts, background, and
// providers already applied) for any unmatched URL. Next.js returns a 404
// status and auto-injects `<meta name="robots" content="noindex">`, so no
// metadata export is needed here.
export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden px-4 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/paper.avif)",
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          opacity: 0.5,
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="tabby-display text-[6rem] leading-none tracking-tight text-ink sm:text-[9rem]">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          this page wandered off
        </h1>
        <p className="mt-3 max-w-md text-balance text-base leading-relaxed tracking-tight text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Let&apos;s get you back to Cotabby.
        </p>
        <div className="mt-8">
          <TabbyButton href="/" variant="blue" size="md">
            Back to Cotabby
          </TabbyButton>
        </div>
      </div>
    </main>
  );
}
