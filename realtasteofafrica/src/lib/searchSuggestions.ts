import type { Area } from "@/lib/areas"
import { cityToSlug, type Restaurant } from "@/lib/restaurants"

export type SearchSuggestion = {
  id: string
  label: string
  sublabel?: string
  href: string
  kind: "restaurant" | "city" | "cuisine" | "area"
}

function normalize(s: string) {
  return s.toLowerCase().trim()
}

/** Client-side suggestions for restaurant search boxes. */
export function getSearchSuggestions(
  query: string,
  restaurants: Restaurant[],
  cuisineTags: string[],
  areas: Area[],
  limit = 8
): SearchSuggestion[] {
  const q = normalize(query)
  if (q.length < 2) return []

  const out: SearchSuggestion[] = []
  const seen = new Set<string>()

  const push = (s: SearchSuggestion) => {
    if (seen.has(s.id) || out.length >= limit) return
    seen.add(s.id)
    out.push(s)
  }

  for (const r of restaurants) {
    if (normalize(r.name).includes(q)) {
      push({
        id: `r-${r.slug}`,
        kind: "restaurant",
        label: r.name,
        sublabel: `${r.city}, TX · ${r.cuisines[0] ?? "African"}`,
        href: `/restaurants/${r.slug}`,
      })
    }
  }

  const cities = new Map<string, number>()
  for (const r of restaurants) {
    const key = r.city
    if (normalize(key).includes(q)) {
      cities.set(key, (cities.get(key) ?? 0) + 1)
    }
  }
  for (const [city, count] of [...cities.entries()].sort((a, b) => b[1] - a[1])) {
    push({
      id: `city-${city}`,
      kind: "city",
      label: city,
      sublabel: `${count} spots`,
      href: `/cities/${cityToSlug(city)}`,
    })
  }

  for (const tag of cuisineTags) {
    if (normalize(tag).includes(q)) {
      push({
        id: `cuisine-${tag}`,
        kind: "cuisine",
        label: tag,
        sublabel: "Cuisine",
        href: `/restaurants?cuisine=${encodeURIComponent(tag)}`,
      })
    }
  }

  for (const a of areas) {
    if (normalize(a.name).includes(q) || normalize(a.regionLabel).includes(q)) {
      push({
        id: `area-${a.slug}`,
        kind: "area",
        label: a.name,
        sublabel: a.regionLabel,
        href: `/restaurants?area=${a.slug}`,
      })
    }
  }

  return out.slice(0, limit)
}
