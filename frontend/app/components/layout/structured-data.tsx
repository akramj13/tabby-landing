import { CREATOR, DOWNLOAD_URL, GITHUB_URL, SITE_NAME, SITE_URL } from "@/app/lib/site";
import { FAQ_ITEMS } from "@/app/components/sections/faq-section";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Safe: the payload is a fully-controlled object serialized server-side.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function StructuredData() {
  // No `aggregateRating`/`Review` here on purpose: the on-page testimonials
  // (reviews-cloud-section) are quotes without star ratings, and Google
  // requires a real `reviewRating`. Fabricating one to earn star snippets
  // risks a manual penalty — add rating markup only if a genuine, on-page
  // rating system ships.
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cotabby",
    operatingSystem: "macOS",
    applicationCategory: "ProductivityApplication",
    url: SITE_URL,
    image: `${SITE_URL}/icon-512.png`,
    downloadUrl: DOWNLOAD_URL,
    description:
      "Free, open-source macOS AI autocomplete. Press Tab to accept quiet inline suggestions in Mail, Notes, Slack, Docs, and more.",
    isAccessibleForFree: true,
    installUrl: GITHUB_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Person",
      name: CREATOR.name,
      url: CREATOR.linkedin,
      sameAs: [CREATOR.linkedin, CREATOR.x],
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };

  return (
    <>
      <JsonLd data={softwareApp} />
      <JsonLd data={webSite} />
      <JsonLd data={faqPage} />
    </>
  );
}
