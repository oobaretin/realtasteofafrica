import type { MetadataRoute } from "next"

import { AREAS } from "@/lib/areas"
import { RESTAURANTS, getAllCitySlugs } from "@/lib/restaurants"
import { SITE_URL } from "@/lib/site"
import { getCollectionSlugs } from "@/data/collections"

const STATIC_PATHS = [
  "/",
  "/restaurants",
  "/collections",
  "/saved",
  "/contact",
  "/trust",
  "/submit",
  "/claim",
  "/catering",
  "/menu",
] as const

const STATIC_PRIORITIES: Partial<Record<(typeof STATIC_PATHS)[number], number>> = {
  "/": 1,
  "/restaurants": 0.95,
  "/collections": 0.85,
  "/claim": 0.75,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  function listingLastModified(lastAuditDate?: string): Date {
    if (!lastAuditDate?.trim()) return now
    const d = new Date(`${lastAuditDate.trim()}T12:00:00`)
    return Number.isNaN(d.getTime()) ? now : d
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency:
      path === "/" || path === "/restaurants" || path === "/collections"
        ? "weekly"
        : ("monthly" as const),
    priority: STATIC_PRIORITIES[path] ?? 0.7,
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
    lastModified: listingLastModified(r.lastAuditDate),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))

  const collectionEntries = getCollectionSlugs().map((slug) => ({
    url: `${SITE_URL}/collections/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }))

  return [
    ...staticEntries,
    ...areaEntries,
    ...cityEntries,
    ...collectionEntries,
    ...restaurantEntries,
  ]
}
