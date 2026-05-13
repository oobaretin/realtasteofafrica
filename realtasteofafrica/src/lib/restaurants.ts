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
  /** WGS84 — set when geocoded for distance / “near me”. */
  latitude?: number
  longitude?: number
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
  /** Hours by day, e.g. { Monday: "11:00 AM - 10:00 PM", Tuesday: "Closed", ... }. When missing, UI shows "Hours not verified - Call to confirm." */
  hours?: { [key: string]: string }
  /** Featured image URL for hero and og:image when shared. */
  imageUrl?: string
}

// Data is generated from `data/restaurants.csv` via `npm run import:restaurants`
import { RESTAURANTS as GENERATED_RESTAURANTS } from "@/data/restaurants.generated"
export const RESTAURANTS: Restaurant[] = GENERATED_RESTAURANTS

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  try {
    return RESTAURANTS.find((r) => r.slug === slug);
  } catch (error) {
    console.error(`Error finding restaurant by slug: ${slug}`, error);
    return undefined;
  }
}

/** Stable 1-based listing number for "Verified Listing # X of N". Order: by slug. */
export function getListingNumber(slug: string): number {
  try {
    const sorted = [...RESTAURANTS].sort((a, b) => a.slug.localeCompare(b.slug));
    const idx = sorted.findIndex((r) => r.slug === slug);
    return idx === -1 ? 0 : idx + 1;
  } catch (error) {
    console.error(`Error getting listing number for slug: ${slug}`, error);
    return 0;
  }
}

export function getRestaurantsByArea(areaSlug: string): Restaurant[] {
  try {
    return RESTAURANTS.filter((r) => r.areaSlug === areaSlug);
  } catch (error) {
    console.error(`Error getting restaurants by area: ${areaSlug}`, error);
    return [];
  }
}

/** URL-safe slug from city name (e.g. "San Antonio" → "san-antonio"). */
export function cityToSlug(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, "-")
}

export function getRestaurantsByCity(citySlug: string): Restaurant[] {
  try {
    return RESTAURANTS.filter((r) => cityToSlug(r.city) === citySlug);
  } catch (error) {
    console.error(`Error getting restaurants by city: ${citySlug}`, error);
    return [];
  }
}

/** All city slugs that have at least one restaurant (for static generation). */
export function getAllCitySlugs(): string[] {
  const set = new Set<string>()
  for (const r of RESTAURANTS) set.add(cityToSlug(r.city))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export function getAllCuisineTags(): string[] {
  try {
    const set = new Set<string>();
    for (const r of RESTAURANTS) {
      for (const c of r.cuisines) {
        set.add(c);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error getting all cuisine tags', error);
    return [];
  }
}

export function getFeaturedRestaurants(): Restaurant[] {
  try {
    return RESTAURANTS.filter((r) => r.isFeatured === true);
  } catch (error) {
    console.error('Error getting featured restaurants', error);
    return [];
  }
}

/** Same city first, then same primary cuisine; excludes slug. */
export function getSimilarRestaurants(
  currentSlug: string,
  city: string,
  cuisineTag?: string,
  limit = 4
): Restaurant[] {
  try {
    const current = getRestaurantBySlug(currentSlug);
    if (!current) return [];
    const rest = RESTAURANTS.filter((r) => r.slug !== currentSlug);
    const sameCity = rest.filter((r) => r.city === city);
    const sameCuisine = cuisineTag
      ? rest.filter(
          (r) =>
            r.cuisines.some((c) => c.toLowerCase() === cuisineTag.toLowerCase()) ||
            r.cuisine?.toLowerCase() === cuisineTag.toLowerCase()
        )
      : [];
    const combined = [...sameCity, ...sameCuisine.filter((r) => !sameCity.includes(r))];
    return combined.slice(0, limit);
  } catch (error) {
    console.error(`Error getting similar restaurants for slug: ${currentSlug}`, error);
    return [];
  }
}

