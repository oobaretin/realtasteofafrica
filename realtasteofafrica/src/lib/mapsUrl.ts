import type { Restaurant } from "@/lib/restaurants"

export function googleMapsSearchUrl(
  addressLine: string,
  city: string,
  state: string
): string {
  const query = encodeURIComponent(`${addressLine}, ${city}, ${state}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

/** Prefer stored maps link; fall back to Google Maps search from address. */
export function getRestaurantMapsUrl(r: Pick<Restaurant, "mapsUrl" | "addressLine" | "city" | "state" | "name">): string {
  const stored = r.mapsUrl?.trim()
  if (stored && !stored.includes("openstreetmap.org")) {
    return stored
  }
  return googleMapsSearchUrl(r.addressLine, r.city, r.state)
}
