import type { Restaurant } from "@/lib/restaurants"
import { cityToSlug } from "@/lib/restaurants"

function topEntry(counts: Map<string, number>): string | undefined {
  let best: string | undefined
  let bestCount = 0
  for (const [key, count] of counts) {
    if (count > bestCount) {
      best = key
      bestCount = count
    }
  }
  return best
}

export type CollectionBrowseLinks = {
  city?: string
  citySlug?: string
  cuisine?: string
  areaSlug?: string
}

/** Derive browse links from a guide's restaurant list for cross-linking. */
export function getCollectionBrowseLinks(
  restaurants: Restaurant[]
): CollectionBrowseLinks {
  if (restaurants.length === 0) return {}

  const cityCounts = new Map<string, number>()
  const cuisineCounts = new Map<string, number>()
  const areaCounts = new Map<string, number>()

  for (const r of restaurants) {
    cityCounts.set(r.city, (cityCounts.get(r.city) ?? 0) + 1)
    areaCounts.set(r.areaSlug, (areaCounts.get(r.areaSlug) ?? 0) + 1)
    for (const c of r.cuisines) {
      cuisineCounts.set(c, (cuisineCounts.get(c) ?? 0) + 1)
    }
    if (r.cuisine) {
      cuisineCounts.set(r.cuisine, (cuisineCounts.get(r.cuisine) ?? 0) + 1)
    }
  }

  const city = topEntry(cityCounts)
  const cuisine = topEntry(cuisineCounts)
  const areaSlug = topEntry(areaCounts)

  return {
    city,
    citySlug: city ? cityToSlug(city) : undefined,
    cuisine,
    areaSlug,
  }
}
