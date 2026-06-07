import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/app/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      "Local AI autocomplete for macOS — accept suggestions word-by-word with Tab, all running on your Mac.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f0",
    theme_color: "#faf7f0",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
