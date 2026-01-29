import type { Restaurant } from "@/lib/restaurants"

export const ESTABLISHMENT_CATEGORIES = [
  "All",
  "Restaurant",
  "Food Truck",
  "Ghost Kitchen",
  "Market",
  "Market + Kitchen",
] as const

export type EstablishmentCategory = (typeof ESTABLISHMENT_CATEGORIES)[number]

function highlightsInclude(highlights: string[], needle: string): boolean {
  const lower = needle.toLowerCase()
  return highlights.some((h) => h.toLowerCase().includes(lower))
}

function isMarketPlusKitchen(highlights: string[]): boolean {
  if (highlightsInclude(highlights, "Market-Kitchen")) return true
  if (highlightsInclude(highlights, "Restaurant + Market")) return true
  if (highlightsInclude(highlights, "Market") && highlightsInclude(highlights, "Kitchen"))
    return true
  return false
}

/**
 * Returns establishment type: uses explicit category when set, otherwise derives from highlights.
 * Used for filtering the directory by category.
 */
export function getEstablishmentCategory(restaurant: Restaurant): Exclude<EstablishmentCategory, "All"> {
  const explicit = restaurant.category
  if (
    explicit === "Food Truck" ||
    explicit === "Ghost Kitchen" ||
    explicit === "Market" ||
    explicit === "Market + Kitchen" ||
    explicit === "Restaurant"
  ) {
    return explicit
  }
  const h = restaurant.highlights
  if (highlightsInclude(h, "Food truck")) return "Food Truck"
  if (highlightsInclude(h, "Ghost kitchen")) return "Ghost Kitchen"
  if (isMarketPlusKitchen(h)) return "Market + Kitchen"
  if (highlightsInclude(h, "Market")) return "Market"
  return "Restaurant"
}

/** Tailwind classes for category badge (top-corner pill): bg, text */
export const CATEGORY_BADGE_CLASSES: Record<Exclude<EstablishmentCategory, "All">, string> = {
  "Food Truck": "bg-orange-500 text-white",
  "Ghost Kitchen": "bg-slate-500 text-white",
  Restaurant: "bg-amber-600 text-white",
  Market: "bg-emerald-600 text-white",
  "Market + Kitchen": "bg-green-600 text-white",
}

/** Tailwind classes for category header strip (above card content) */
export const CATEGORY_STRIP_CLASSES: Record<Exclude<EstablishmentCategory, "All">, string> = {
  "Food Truck": "bg-orange-400",
  "Ghost Kitchen": "bg-slate-400",
  Restaurant: "bg-amber-500",
  Market: "bg-emerald-500",
  "Market + Kitchen": "bg-green-500",
}
