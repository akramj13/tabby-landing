import { AppsCarouselSection } from "@/app/components/sections/apps-carousel-section";
import { AlternatingFeatureSection } from "@/app/components/sections/alternating-feature-section";
import { CustomizationCardsSection } from "@/app/components/sections/customization-cards-section";
import { DemoVideoSection } from "@/app/components/sections/demo-video-section";
import { FaqSection } from "@/app/components/sections/faq-section";
import { PermissionsSection } from "@/app/components/sections/permissions-section";
import { FinalFooterSection } from "@/app/components/sections/final-footer-section";
import { Header } from "@/app/components/sections/header";
import { Hero } from "@/app/components/sections/hero";
import { HowItWorksSection } from "@/app/components/sections/how-it-works-section";
import { ScrollProgressBar } from "@/app/components/ui/motion";
import { Section } from "@/app/components/ui/section";
import { SectionShell } from "@/app/components/ui/section-shell";
import { SloganCtaSection } from "@/app/components/sections/slogan-cta-section";
import { StatsStripSection } from "@/app/components/sections/stats-strip-section";
import { StructuredData } from "@/app/components/layout/structured-data";
import { FloatingButton } from "@/app/components/ui/floating-button";
import { GiantWordmarkSection } from "@/app/components/sections/giant-wordmark-section";
import { SleepingCatMascot } from "@/app/components/ui/sleeping-cat-mascot";

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
      <div className="relative z-10 mx-auto flex w-full max-w-shell flex-col gap-16 sm:gap-20 lg:gap-24">
        <div className="relative">
          <SectionShell>
            <Header />
            <Hero />
          </SectionShell>
          <SleepingCatMascot />
        </div>

        <Section>
          <StatsStripSection />
        </Section>

        <Section id="demo">
          <DemoVideoSection />
        </Section>

        <Section>
          <AppsCarouselSection />
        </Section>

        <Section id="how-it-works">
          <HowItWorksSection />
        </Section>

        <Section>
          <AlternatingFeatureSection />
        </Section>

        <Section>
          <CustomizationCardsSection />
        </Section>

        <Section id="privacy">
          <PermissionsSection />
        </Section>

        <Section id="faq">
          <FaqSection />
        </Section>

        <Section>
          <SloganCtaSection />
        </Section>

        <Section>
          <FinalFooterSection />
        </Section>

        <GiantWordmarkSection />
      </div>
    </div>
  );
}
