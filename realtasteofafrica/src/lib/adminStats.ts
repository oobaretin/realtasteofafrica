import type { Restaurant } from "@/lib/restaurants"
import { AREAS } from "@/lib/areas"

export type AdminStats = {
  total: number
  cityCount: number
  featured: number
  verified: number
  missingPhone: number
  missingWebsite: number
  missingHours: number
  byArea: { slug: string; name: string; count: number }[]
}

export type AdminRestaurantRow = {
  slug: string
  name: string
  city: string
  areaSlug: string
  isVerified?: boolean
  isFeatured?: boolean
}

export function computeAdminStats(restaurants: Restaurant[]): AdminStats {
  const areaCounts = new Map<string, number>()
  for (const r of restaurants) {
    areaCounts.set(r.areaSlug, (areaCounts.get(r.areaSlug) ?? 0) + 1)
  }

  const byArea = AREAS.map((a) => ({
    slug: a.slug,
    name: a.name,
    count: areaCounts.get(a.slug) ?? 0,
  })).filter((a) => a.count > 0)

  return {
    total: restaurants.length,
    cityCount: new Set(restaurants.map((r) => `${r.city}-${r.state}`)).size,
    featured: restaurants.filter((r) => r.isFeatured).length,
    verified: restaurants.filter((r) => r.isVerified).length,
    missingPhone: restaurants.filter((r) => !r.phone?.trim()).length,
    missingWebsite: restaurants.filter((r) => !r.websiteUrl?.trim()).length,
    missingHours: restaurants.filter((r) => !r.hours || Object.keys(r.hours).length === 0).length,
    byArea,
  }
}

export function toAdminRestaurantRows(restaurants: Restaurant[]): AdminRestaurantRow[] {
  return restaurants
    .map((r) => ({
      slug: r.slug,
      name: r.name,
      city: r.city,
      areaSlug: r.areaSlug,
      isVerified: r.isVerified,
      isFeatured: r.isFeatured,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))
}
