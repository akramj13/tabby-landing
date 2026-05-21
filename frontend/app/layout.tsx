import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CREATOR, SITE_URL } from "./lib/site";
import { Providers } from "./components/providers";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const title = "tabby - on-device AI autocomplete for macOS";
const description =
  "On-device AI autocomplete for macOS text fields. Use Apple Intelligence or local GGUF models, accept inline suggestions with Tab, and keep every token on your Mac.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "tabby",
  keywords: [
    "Mac autocomplete",
    "macOS text fields",
    "local AI autocomplete",
    "Apple Intelligence autocomplete",
    "GGUF autocomplete",
    "on-device AI Mac",
  ],
  authors: [{ name: CREATOR.name, url: CREATOR.linkedin }],
  creator: CREATOR.name,
  publisher: CREATOR.name,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "tabby",
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
    <html lang="en" className={`${bodyFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-ink">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
