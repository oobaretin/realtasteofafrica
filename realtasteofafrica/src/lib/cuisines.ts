/**
 * Curated cuisine tags with example restaurant names from the directory.
 * Used for "Explore by cuisine" and SEO.
 */
export type CuisineTag = {
  tag: string
  exampleNames: string[]
}

export const CUISINE_TAGS: CuisineTag[] = [
  {
    tag: "Nigerian",
    exampleNames: [
      "ChòpnBlọk",
      "Aria Suya",
      "Taste of Nigeria",
      "Sarabell Calabar",
      "Finger Licking",
      "Sabo Suya",
      "Suya Hut",
      "Abula HotPot",
      "Omalicha Kitchen",
      "Lagos Buka",
      "Lagos Kitchen",
      "Amala Joint",
      "Rodo Nigerian Cuisine",
    ],
  },
  {
    tag: "Ethiopian",
    exampleNames: [
      "Blue Nile",
      "Lucy Ethiopian",
      "Desta Ethiopian",
      "Lalibela Ethiopian",
      "Addis Abeba",
      "Yenat Guada",
      "Sheba's Ethiopian Kitchen",
      "Amen Cafe",
      "African Village Ethiopian",
    ],
  },
  {
    tag: "Ghanaian",
    exampleNames: [
      "Afrikiko",
      "Delight's Ghanaian Cuisine",
      "Jollof Haus (Fusion)",
      "Makola Marketplace",
    ],
  },
  {
    tag: "Senegalese",
    exampleNames: ["Dakar Street Food"],
  },
  {
    tag: "Somali",
    exampleNames: [
      "Somali African Safari Restaurant",
      "Somali Restaurant Bulsho",
    ],
  },
  {
    tag: "Eritrean",
    exampleNames: ["Marhaba Eritrean", "Amen Cafe"],
  },
  {
    tag: "Cameroonian",
    exampleNames: ["Chez Michelle"],
  },
  {
    tag: "Southern African",
    exampleNames: ["Rhosabjal Cuisine", "South African Food Affair"],
  },
  {
    tag: "Pan-African / Fusion",
    exampleNames: [
      "The Port of Peri Peri",
      "Nando's PERi-PERi",
      "Safari",
      "EKO Bistro Fusion",
    ],
  },
]
