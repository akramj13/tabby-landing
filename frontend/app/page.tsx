import type { Metadata } from "next";
import { AnnouncementBanner } from "@/app/components/layout/announcement-banner";
import { AppsCarouselSection } from "@/app/components/sections/apps-carousel-section";
// import { AlternatingFeatureSection } from "@/app/components/sections/alternating-feature-section";
import { ComparisonSection } from "@/app/components/sections/comparison-section";
import { CustomizationCardsSection } from "@/app/components/sections/customization-cards-section";
import { FaqSection } from "@/app/components/sections/faq-section";
import { FeaturesBentoSection } from "@/app/components/sections/features-bento-section";
import { PermissionsSection } from "@/app/components/sections/permissions-section";
import { ReviewsCloudSection } from "@/app/components/sections/reviews-cloud-section";
import { FinalFooterSection } from "@/app/components/sections/final-footer-section";
import { Header } from "@/app/components/sections/header";
import { Hero } from "@/app/components/sections/hero";
import { HowItWorksSection } from "@/app/components/sections/how-it-works-section";
import { ModelsBeamSection } from "@/app/components/sections/models-beam-section";
import { ScrollProgressBar } from "@/app/components/ui/motion";
import { Section } from "@/app/components/ui/section";
import { SectionShell } from "@/app/components/ui/section-shell";
// import { SloganCtaSection } from "@/app/components/sections/slogan-cta-section";
import { StructuredData } from "@/app/components/layout/structured-data";
import { FloatingButton } from "@/app/components/ui/floating-button";
import { GiantWordmarkSection } from "@/app/components/sections/giant-wordmark-section";
import { SleepingCatMascot } from "@/app/components/ui/sleeping-cat-mascot";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <div
        id="top"
        className="relative min-h-screen overflow-hidden bg-background px-3 pb-14 pt-17 sm:px-4 sm:pb-16 sm:pt-20 lg:px-6 lg:pb-20 lg:pt-22"
      >
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
          <AppsCarouselSection />
        </Section>

        <Section>
          <FeaturesBentoSection />
        </Section>

        <Section id="how-it-works">
          <HowItWorksSection />
        </Section>

        <Section>
          <ReviewsCloudSection />
        </Section>

        {/* <Section>
          <AlternatingFeatureSection />
        </Section> */}

        <Section id="privacy">
          <PermissionsSection />
        </Section>

        <Section>
          <CustomizationCardsSection />
        </Section>

        <Section>
          <ModelsBeamSection />
        </Section>

        <Section>
          <ComparisonSection />
        </Section>

        <Section id="faq">
          <FaqSection />
        </Section>

        {/* <Section>
          <SloganCtaSection />
        </Section> */}

        <Section>
          <FinalFooterSection />
        </Section>

        <GiantWordmarkSection />
      </div>
      </div>
    </>
  );
}
