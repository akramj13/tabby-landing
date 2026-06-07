import type { Metadata } from "next";
import { SITE_NAME } from "@/app/lib/site";

/**
 * Per-route metadata for sub-pages. Sets an explicit canonical + `og:url` for
 * the page's own path and re-declares the shared OpenGraph card fields.
 *
 * Why this exists: Next.js shallow-merges metadata down the route tree, so
 * without an explicit `alternates`/`openGraph` here every sub-page inherits the
 * root layout's `canonical: "/"` and `og:url` = homepage — telling search
 * engines the page is a duplicate of the home page. The file-convention
 * `opengraph-image.png` still applies automatically (file-based metadata wins),
 * so we deliberately don't re-declare the image.
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description?: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title,
      description,
    },
  };
}
