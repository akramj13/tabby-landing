import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { CREATOR, SITE_URL } from "./lib/site";
import { Providers } from "./components/providers";

const bodyFont = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

const title = "Cotabby - local AI autocomplete for macOS";
const description =
  "Local AI autocomplete for macOS text fields. Use Apple Intelligence or local GGUF models, accept inline suggestions with Tab, and keep every token on your Mac.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "Cotabby",
  keywords: [
    "Mac autocomplete",
    "macOS text fields",
    "local AI autocomplete",
    "Apple Intelligence autocomplete",
    "GGUF autocomplete",
    "local AI Mac",
  ],
  authors: [{ name: CREATOR.name, url: CREATOR.linkedin }],
  creator: CREATOR.name,
  publisher: CREATOR.name,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Cotabby",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: CREATOR.xHandle,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-ink">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
