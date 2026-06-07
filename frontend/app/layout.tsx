import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { CREATOR, SITE_NAME, SITE_URL } from "@/app/lib/site";
import { Providers } from "@/app/components/ui/providers";

const bodyFont = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "./fonts/OpenRunde-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/OpenRunde-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/OpenRunde-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/OpenRunde-Bold.woff2", weight: "700", style: "normal" },
  ],
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
  applicationName: SITE_NAME,
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
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: CREATOR.xHandle,
    title,
    description,
    creator: CREATOR.xHandle,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f0",
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
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="" />
      </head>
      <body className="flex min-h-full flex-col bg-background text-ink">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
