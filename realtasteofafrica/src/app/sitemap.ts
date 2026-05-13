import type { MetadataRoute } from "next"

import { AREAS } from "@/lib/areas"
import { RESTAURANTS, getAllCitySlugs } from "@/lib/restaurants"
import { SITE_URL } from "@/lib/site"
import { getCollectionSlugs } from "@/data/collections"

const STATIC_PATHS = [
  "/",
  "/restaurants",
  "/contact",
  "/submit",
  "/claim",
  "/claim/success",
  "/catering",
  "/collections",
  "/menu",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency:
      path === "/" || path === "/restaurants"
        ? "weekly"
        : ("monthly" as const),
    priority: path === "/" ? 1 : path === "/restaurants" ? 0.95 : 0.7,
  }))

  const areaEntries = AREAS.map((a) => ({
    url: `${SITE_URL}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.82,
  }))

  const cityEntries = getAllCitySlugs().map((citySlug) => ({
    url: `${SITE_URL}/cities/${citySlug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const restaurantEntries = RESTAURANTS.map((r) => ({
    url: `${SITE_URL}/restaurants/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))

  const collectionEntries = getCollectionSlugs().map((slug) => ({
    url: `${SITE_URL}/collections/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  }))

  return [
    ...staticEntries,
    ...areaEntries,
    ...cityEntries,
    ...collectionEntries,
    ...restaurantEntries,
  ]
}
