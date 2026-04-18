import type { Restaurant } from "@/lib/restaurants"

export const ESTABLISHMENT_CATEGORIES = [
  "All",
  /** Browse: restaurants, food trucks, and ghost kitchens (not retail markets). */
  "EatInGroup",
  /** Browse: grocery / retail markets including market+kitchen hybrids. */
  "MarketGroup",
  "Restaurant",
  "Food Truck",
  "Ghost Kitchen",
  "Market",
  "Market + Kitchen",
] as const

export type EstablishmentCategory = (typeof ESTABLISHMENT_CATEGORIES)[number]

/** Resolved category for a single listing (never a browse-group value). */
export type ResolvedEstablishmentCategory = Exclude<
  EstablishmentCategory,
  "All" | "EatInGroup" | "MarketGroup"
>

/** Granular type options (single category). */
export const FILTER_GRANULAR_TYPE_OPTIONS: {
  value: Exclude<EstablishmentCategory, "All" | "EatInGroup" | "MarketGroup">
  label: string
}[] = [
  { value: "Restaurant", label: "Restaurant" },
  { value: "Food Truck", label: "Food truck" },
  { value: "Ghost Kitchen", label: "Ghost kitchen" },
  { value: "Market", label: "Market" },
  { value: "Market + Kitchen", label: "Market + kitchen" },
]

/** Option groups for the browse filter &lt;select&gt; (URL `type` param). */
export const FILTER_TYPE_OPTION_GROUPS: { label: string; options: { value: string; label: string }[] }[] =
  [
    {
      label: "Browse",
      options: [
        { value: "All", label: "All types" },
        { value: "EatInGroup", label: "Where to eat" },
        { value: "MarketGroup", label: "Markets & groceries" },
      ],
    },
    {
      label: "Specific type",
      options: FILTER_GRANULAR_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    },
  ]

/** Flat list of every valid `type` query value. */
export const ALL_FILTER_TYPE_VALUES: string[] = FILTER_TYPE_OPTION_GROUPS.flatMap((g) =>
  g.options.map((o) => o.value)
)

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
export function getEstablishmentCategory(restaurant: Restaurant): ResolvedEstablishmentCategory {
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

/** URL `type` filter: All, browse groups (EatInGroup, MarketGroup), or a single category. */
export function listingMatchesTypeFilter(restaurant: Restaurant, filter: string): boolean {
  if (!filter || filter === "All") return true
  const resolved = getEstablishmentCategory(restaurant)
  if (filter === "EatInGroup") {
    return (
      resolved === "Restaurant" || resolved === "Food Truck" || resolved === "Ghost Kitchen"
    )
  }
  if (filter === "MarketGroup") {
    return resolved === "Market" || resolved === "Market + Kitchen"
  }
  return resolved === filter
}

export function typeFilterBadgeLabel(value: string): string {
  if (value === "EatInGroup") return "Where to eat"
  if (value === "MarketGroup") return "Markets & groceries"
  return value
}

/** Tailwind classes for category badge (top-corner pill): bg, text */
export const CATEGORY_BADGE_CLASSES: Record<ResolvedEstablishmentCategory, string> = {
  "Food Truck": "bg-orange-500 text-white",
  "Ghost Kitchen": "bg-slate-500 text-white",
  Restaurant: "bg-amber-600 text-white",
  Market: "bg-emerald-600 text-white",
  "Market + Kitchen": "bg-green-600 text-white",
}

/** Tailwind classes for category header strip (above card content) */
export const CATEGORY_STRIP_CLASSES: Record<ResolvedEstablishmentCategory, string> = {
  "Food Truck": "bg-orange-400",
  "Ghost Kitchen": "bg-slate-400",
  Restaurant: "bg-amber-500",
  Market: "bg-emerald-500",
  "Market + Kitchen": "bg-green-500",
}
