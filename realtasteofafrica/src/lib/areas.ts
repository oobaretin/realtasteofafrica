export type Area = {
  slug: string
  name: string
  regionLabel: string
  description: string
}

export const AREAS: Area[] = [
  {
    slug: "houston",
    name: "Houston",
    regionLabel: "Greater Houston, TX",
    description:
      "Start here: Houston + neighboring cities. We’ll expand nationwide as we grow.",
  },
  {
    slug: "katy",
    name: "Katy",
    regionLabel: "West Houston, TX",
    description: "Restaurants in Katy and nearby west Houston neighborhoods.",
  },
  {
    slug: "sugar-land",
    name: "Sugar Land",
    regionLabel: "Southwest Houston, TX",
    description: "Restaurants in Sugar Land and nearby southwest Houston.",
  },
  {
    slug: "pasadena",
    name: "Pasadena",
    regionLabel: "Southeast Houston, TX",
    description: "Restaurants in Pasadena and nearby southeast Houston.",
  },
]

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug)
}

