import { AppsCarouselSection } from "./components/apps-carousel-section";
import { AlternatingFeatureSection } from "./components/alternating-feature-section";
import { CustomizationCardsSection } from "./components/customization-cards-section";
import { DemoVideoSection } from "./components/demo-video-section";
import { FaqSection } from "./components/faq-section";
import { PermissionsSection } from "./components/permissions-section";
import { FinalFooterSection } from "./components/final-footer-section";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { HowItWorksSection } from "./components/how-it-works-section";
import { ScrollProgressBar } from "./components/motion";
import { SectionShell } from "./components/section-shell";
import { SloganCtaSection } from "./components/slogan-cta-section";
import { StatsStripSection } from "./components/stats-strip-section";
import { StructuredData } from "./components/structured-data";
import { FloatingButton } from "./components/floating-button";
import { GiantWordmarkSection } from "./components/giant-wordmark-section";
import Image from "next/image";

export const dynamic = "force-static";

export default function Home() {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-hidden bg-background px-3 pb-14 pt-5 sm:px-4 sm:pb-16 sm:pt-8 lg:px-6 lg:pb-20 lg:pt-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(28,28,28,0.10) 1px, transparent 0),
            linear-gradient(180deg, rgba(28,28,28,0.10) 1px, transparent 0),
            repeating-linear-gradient(45deg, rgba(255,130,115,0.14) 0 2px, transparent 2px 6px)
          `,
          backgroundSize: "96px 96px, 96px 96px, 96px 96px",
        }}
      />
      <StructuredData />
      <ScrollProgressBar />
      <FloatingButton />
      <div className="relative z-10 mx-auto flex w-full max-w-340 flex-col gap-16 sm:gap-20 lg:gap-24">
        <div className="relative">
          <SectionShell>
            <Header />
            <Hero />
          </SectionShell>
          <Image
            src="/app-icons/cat-standing.svg"
            alt=""
            aria-hidden="true"
            width={998}
            height={887}
            priority
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 16rem, 11rem"
            className="pointer-events-none absolute bottom-0 left-[-36] z-20 w-44 translate-y-[10%] sm:left-10 sm:w-64 sm:translate-y-[10%] lg:left-[-24] lg:w-[26rem] lg:translate-y-[4%]"
          />
          <Image
            src="/app-icons/cat-sleep.svg"
            alt=""
            aria-hidden="true"
            width={675}
            height={600}
            priority
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 15rem, 10rem"
            className="pointer-events-none absolute bottom-0 right-4 z-20 w-40 translate-y-[54%] sm:right-10 sm:w-60 sm:translate-y-[55%] lg:right-16 lg:w-[24rem] lg:translate-y-[55%]"
          />
        </div>

        <section className="px-6 sm:px-8 lg:px-10">
          <StatsStripSection />
        </section>

        <section id="demo" className="tabby-anchor px-6 sm:px-8 lg:px-10">
          <DemoVideoSection />
        </section>

        <section className="px-6 sm:px-8 lg:px-10">
          <AppsCarouselSection />
        </section>

        <section
          id="how-it-works"
          className="tabby-anchor px-6 sm:px-8 lg:px-10"
        >
          <HowItWorksSection />
        </section>

        <section className="px-6 sm:px-8 lg:px-10">
          <AlternatingFeatureSection />
        </section>

        <section className="px-6 sm:px-8 lg:px-10">
          <CustomizationCardsSection />
        </section>

        <section id="privacy" className="tabby-anchor px-6 sm:px-8 lg:px-10">
          <PermissionsSection />
        </section>

        <section id="faq" className="tabby-anchor px-6 sm:px-8 lg:px-10">
          <FaqSection />
        </section>

        <section className="px-6 sm:px-8 lg:px-10">
          <SloganCtaSection />
        </section>

        <section className="px-6 sm:px-8 lg:px-10">
          <FinalFooterSection />
        </section>

        <GiantWordmarkSection />
      </div>
    </div>
  );
}
