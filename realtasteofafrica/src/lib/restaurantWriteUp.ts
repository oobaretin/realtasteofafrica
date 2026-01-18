import type { Restaurant } from "@/lib/restaurants"

function titleCaseWord(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function niceCuisineList(cuisines: string[]) {
  const cleaned = cuisines.map((c) => titleCaseWord(c.trim())).filter(Boolean)
  return cleaned.slice(0, 3).join(", ")
}

function splitParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim()
  if (!normalized) return []
  return normalized
    .split(/\n{2,}/g)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean)
}

export function getRestaurantWriteUp(r: Restaurant): string[] {
  if (r.writeUp) return splitParagraphs(r.writeUp)

  const cuisine = niceCuisineList(r.cuisines)
  const highlight = r.highlights?.[0]

  const p1 = `${r.name} is a ${cuisine || "African"} restaurant in ${r.city}, ${r.state}.`
  const p2 = highlight
    ? `If you’re not sure what to order, start with ${highlight} and explore the rest of the menu from there.`
    : `If you’re not sure what to order, start with a house favorite and explore the rest of the menu from there.`

  const p3 = r.websiteUrl
    ? "Check the website for the most up-to-date hours and specials."
    : r.mapsUrl
      ? "Use the map link for directions and to confirm hours."
      : ""

  return [p1, p2, p3].filter(Boolean)
}

