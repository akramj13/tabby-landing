import { AppsCarouselSection } from "./components/apps-carousel-section";
import { AlternatingFeatureSection } from "./components/alternating-feature-section";
import { CustomizationCardsSection } from "./components/customization-cards-section";
import { DemoVideoSection } from "./components/demo-video-section";
import { FaqSection } from "./components/faq-section";
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
export default function Home() {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-hidden bg-background px-3 pb-14 pt-5 sm:px-4 sm:pb-16 sm:pt-8 lg:px-6 lg:pb-20 lg:pt-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
      />
      <StructuredData />
      <ScrollProgressBar />
      <FloatingButton />
      <div className="relative z-10 mx-auto flex w-full max-w-340 flex-col gap-16 sm:gap-20 lg:gap-24">
        <SectionShell>
          <Header />
          <Hero />
        </SectionShell>

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

        <section id="faq" className="tabby-anchor px-6 sm:px-8 lg:px-10">
          <FaqSection />
        </section>

        <section className="px-6 sm:px-8 lg:px-10">
          <SloganCtaSection />
        </section>

        <section className="px-6 sm:px-8 lg:px-10">
          <FinalFooterSection />
        </section>
      </div>
    </div>
  );
}
