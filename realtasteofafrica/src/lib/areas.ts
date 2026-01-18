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
    slug: "dfw",
    name: "DFW",
    regionLabel: "Dallas–Fort Worth, TX",
    description:
      "African restaurants across Dallas, Fort Worth, and nearby cities in the metroplex.",
  },
  {
    slug: "austin",
    name: "Austin",
    regionLabel: "Austin, TX",
    description: "African restaurants in Austin and nearby suburbs.",
  },
  {
    slug: "central-texas",
    name: "Central Texas",
    regionLabel: "Central Texas",
    description:
      "African restaurants in Central Texas (Killeen, Temple, Round Rock, and nearby areas).",
  },
  {
    slug: "san-antonio",
    name: "San Antonio",
    regionLabel: "San Antonio, TX",
    description: "African restaurants in San Antonio and nearby areas.",
  },
  {
    slug: "west-texas",
    name: "West Texas",
    regionLabel: "West Texas (Amarillo and beyond)",
    description:
      "African restaurants in West Texas, including Amarillo and nearby cities.",
  },
  {
    slug: "el-paso",
    name: "El Paso",
    regionLabel: "El Paso, TX",
    description: "African restaurants and markets in El Paso and nearby areas.",
  },
  {
    slug: "south-texas",
    name: "South Texas",
    regionLabel: "South Texas (RGV and beyond)",
    description:
      "African restaurants and markets in South Texas, including the Rio Grande Valley.",
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
]

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug)
}

