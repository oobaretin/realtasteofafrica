export type PriceLevel = 1 | 2 | 3 | 4

export type Restaurant = {
  slug: string
  name: string
  cuisines: string[]
  /** Primary cuisine tag derived from name (Nigerian, Ethiopian, Ghanaian, West African). */
  cuisine?: string
  /** When true, show in homepage Featured / Curated Picks. */
  isFeatured?: boolean
  /** When true, owner has claimed and verified; show Real Taste Verified badge. */
  isVerified?: boolean
  areaSlug: string
  city: string
  state: string
  addressLine: string
  phone?: string
  websiteUrl?: string
  mapsUrl?: string
  priceLevel?: PriceLevel
  highlights: string[]
  /** Explicit category from data; when set, used instead of deriving from highlights. */
  category?: "Food Truck" | "Ghost Kitchen" | "Market" | "Market + Kitchen" | "Restaurant"
  /** Internal: set to true after you've audited this listing (e.g. confirmed open). */
  internalVerified?: boolean
  /** Date this listing was last verified (e.g. "2026-01-15"); when in 2026, card shows "Verified 2026". */
  lastAuditDate?: string
  writeUp?: string
}

// Data is generated from `data/restaurants.csv` via `npm run import:restaurants`
import { RESTAURANTS as GENERATED_RESTAURANTS } from "@/data/restaurants.generated"
export const RESTAURANTS: Restaurant[] = GENERATED_RESTAURANTS

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return RESTAURANTS.find((r) => r.slug === slug)
}

export function getRestaurantsByArea(areaSlug: string): Restaurant[] {
  return RESTAURANTS.filter((r) => r.areaSlug === areaSlug)
}

/** URL-safe slug from city name (e.g. "San Antonio" → "san-antonio"). */
export function cityToSlug(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, "-")
}

export function getRestaurantsByCity(citySlug: string): Restaurant[] {
  return RESTAURANTS.filter((r) => cityToSlug(r.city) === citySlug)
}

/** All city slugs that have at least one restaurant (for static generation). */
export function getAllCitySlugs(): string[] {
  const set = new Set<string>()
  for (const r of RESTAURANTS) set.add(cityToSlug(r.city))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export function getAllCuisineTags(): string[] {
  const set = new Set<string>()
  for (const r of RESTAURANTS) for (const c of r.cuisines) set.add(c)
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export function getFeaturedRestaurants(): Restaurant[] {
  return RESTAURANTS.filter((r) => r.isFeatured === true)
}

