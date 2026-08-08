import type { MetadataRoute } from "next"

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "RT Africa",
    description: SITE_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#f1f5f9",
    theme_color: "#b45309",
    icons: [
      {
        src: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
