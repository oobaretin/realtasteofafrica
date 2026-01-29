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

/** Tailwind classes for category badge: bg, text, border */
export const CATEGORY_BADGE_CLASSES: Record<Exclude<EstablishmentCategory, "All">, string> = {
  "Food Truck": "bg-orange-100 text-orange-800 border-orange-200",
  "Ghost Kitchen": "bg-slate-200 text-slate-700 border-slate-300",
  Restaurant: "bg-amber-50 text-amber-800 border-amber-200",
  Market: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Market + Kitchen": "bg-teal-100 text-teal-800 border-teal-200",
}
