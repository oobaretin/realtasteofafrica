export type PriceLevel = 1 | 2 | 3 | 4

export type Restaurant = {
  slug: string
  name: string
  cuisines: string[]
  areaSlug: string
  city: string
  state: string
  addressLine: string
  phone?: string
  websiteUrl?: string
  mapsUrl?: string
  priceLevel?: PriceLevel
  highlights: string[]
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

export function getAllCuisineTags(): string[] {
  const set = new Set<string>()
  for (const r of RESTAURANTS) for (const c of r.cuisines) set.add(c)
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

