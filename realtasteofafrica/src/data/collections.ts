import type { Restaurant } from "@/lib/restaurants"

/**
 * Guide images are **yours**: add files under `realtasteofafrica/public/collections/` and keep
 * paths in sync. Supported: `.jpg`, `.jpeg`, `.png`, `.webp`.
 * Use `headerExtraSlides` for more hero slides (2nd, 3rd, …). Each distinct file on disk becomes
 * a slide; the hero is a carousel when there is more than one slide.
 */
/** Hero / carousel slide; optional `objectFit` overrides the guide default (Jollof is contain unless set). */
export type CollectionHeroImage = {
  src: string
  alt: string
  objectFit?: "contain" | "cover"
  /**
   * Jollof guide only: use the taller hero shell on this slide (with `objectFit: "contain"`,
   * shows the full photo without cropping—e.g. hands/plate edges).
   */
  tallHero?: boolean
}

export type EditorialCollection = {
  slug: string
  /** Unique SEO & browser title */
  title: string
  metaDescription: string
  /** Short line under the hero */
  dek: string
  /**
   * Hero image: add your file at `public/collections/` — default names below, or change `src`.
   * Landscape ~21:9 or 1600×900 works well.
   */
  headerImage: CollectionHeroImage
  /**
   * Extra hero slides after `headerImage` (same folder). When two or more image files exist,
   * the hero becomes a swipeable carousel.
   */
  headerExtraSlides?: CollectionHeroImage[]
  /**
   * Optional extra photos. Only paths that exist on disk are shown.
   */
  guideImages?: { src: string; alt: string; caption?: string }[]
  /** Intro paragraphs for humans + long-tail keywords */
  introduction: string[]
  /** Restaurant slugs in display order */
  restaurantSlugs: string[]
}

export const EDITORIAL_COLLECTIONS: EditorialCollection[] = [
  {
    slug: "best-jollof-houston",
    title: "Best Jollof Rice in Houston — African Spots We Love",
    metaDescription:
      "A curated shortlist of Houston African kitchens for smoky jollof, party rice, and West African comfort food — from Bellaire to Alief.",
    dek: "Smoky plates, weekend lines, and Houston heat — edited for flavor seekers.",
    headerImage: {
      src: "/collections/best-jollof-houston.jpeg",
      alt: "Jollof rice and West African dishes — Houston African spots we love",
    },
    headerExtraSlides: [
      {
        src: "/collections/best-jollof-houston-2.jpeg",
        alt: "West African plates and rice — Houston African dining",
      },
      {
        src: "/collections/best-jollof-houston-3.jpeg",
        alt: "More Houston spots for smoky jollof and West African comfort food",
        objectFit: "contain",
        tallHero: true,
      },
    ],
    introduction: [
      "Jollof opinions run deep. This guide is not a championship bracket — it is a living shortlist of Houston spots where West African and Nigerian menus lean into well-seasoned rice, grilled proteins, and repeat visits from the community.",
      "Hours and menus change. Call ahead or check the listing for the latest — especially for catering-sized orders and weekend service.",
    ],
    guideImages: [
      {
        src: "/collections/best-jollof-houston-guide-1.jpg",
        alt: "West African rice dish spread with sides",
        caption: "The kind of spread that keeps regulars coming back.",
      },
    ],
    restaurantSlugs: [
      "chopnblok-montrose-houston-tx",
      "chopnblok-post-houston-tx",
      "aria-suya-kitchen-houston-tx",
      "taste-of-nigeria-houston-tx",
      "sarabell-calabar-restaurant-and-buffet-houston-tx",
      "glozi-calabar-restaurant-and-african-cuisine-houston-tx",
      "amala-zone-houston-tx",
    ],
  },
  {
    slug: "african-markets-texas",
    title: "African Markets & Grocers Across Texas",
    metaDescription:
      "Where to stock up on pantry staples, halal cuts, frozen provisions, and weekend market runs — from Houston’s Bissonnet corridor to DFW and Austin.",
    dek: "Markets, co-ops, and neighborhood grocers — not just dining rooms.",
    headerImage: {
      src: "/collections/african-markets-texas.jpeg",
      alt: "African market shelves — pantry staples and groceries across Texas",
    },
    introduction: [
      "Some of the best flavors in Texas sit on market shelves — dried fish, pepper blends, frozen greens, and weekend produce. We round up listings tagged as markets and hybrid market-kitchens so you can plan a pantry run and maybe grab a plate on the way out.",
      "Inventory turns over quickly; call for specialty items or holiday hours.",
    ],
    guideImages: [
      {
        src: "/collections/african-markets-texas-guide-1.jpg",
        alt: "Spices and goods on market shelves",
        caption: "Pantry staples, spices, and weekend produce — worth the trip.",
      },
    ],
    restaurantSlugs: [
      "makola-marketplace-houston-tx",
      "african-farms-houston",
      "sunrise-african-supermarket-houston",
      "motherland-african-food-market-houston",
      "g-and-j-african-market-houston",
      "royalminds-african-market-katy",
      "blessliz-african-market-mckinney-tx",
      "megenagna-mart-and-cafe-austin",
      "blessing-african-food-store-san-antonio",
    ],
  },
  {
    slug: "ethiopian-dfw",
    title: "Ethiopian & Eritrean Restaurants in DFW",
    metaDescription:
      "Injera, wot, and coffee ceremonies across Dallas, Richardson, and Addison — our shortlist of DFW’s best Ethiopian and Eritrean kitchens.",
    dek: "From Richardson staples to Addison institutions — DFW’s injera map.",
    headerImage: {
      src: "/collections/ethiopian-dfw.jpeg",
      alt: "Ethiopian injera and shared platters — DFW restaurants we recommend",
    },
    introduction: [
      "Dallas–Fort Worth has one of the strongest Ethiopian dining scenes in Texas — longtime neighborhood spots, vegan-friendly menus, and weekend coffee rituals. This guide highlights listings we return to for injera, lentil wot, and tibs.",
      "Many kitchens share a plate culture; ask about spice level and fasting-day options when you call ahead.",
    ],
    restaurantSlugs: [
      "queen-of-sheba-restaurant-addison-tx",
      "desta-ethiopian-restaurant-dallas-tx",
      "lalibela-ethiopian-restaurant-dallas-tx",
      "addis-abeba-ethiopian-restaurant-richardson-tx",
      "yenat-guada-ethiopian-cuisine-dallas-tx",
      "shebas-ethiopian-kitchen-dallas-tx",
    ],
  },
  {
    slug: "african-food-austin",
    title: "African Food in Austin — Trucks, Kitchens & Markets",
    metaDescription:
      "Nigerian suya, Ethiopian injera, and market runs across Austin — from food trucks on Lamar to sit-down kitchens and hybrid grocers.",
    dek: "Keep Austin eating — West African, East African, and market stops we bookmark.",
    headerImage: {
      src: "/collections/african-food-austin.jpeg",
      alt: "African food in Austin — restaurants, food trucks, and markets",
    },
    introduction: [
      "Austin’s African food scene mixes food trucks, ghost kitchens, and full-service restaurants — often with a strong weekend crowd. This guide pulls together spots for suya runs, injera plates, and pantry stops without pretending one list can cover every pop-up schedule.",
      "Trucks and pop-ups move. Check hours on the listing or call before you drive.",
    ],
    restaurantSlugs: [
      "red-sea-kitchen-ethiopian-food-truck-austin-tx",
      "habesha-restaurant-austin-tx",
      "asters-ethiopian-kitchen-austin-tx",
      "taste-of-ethiopia-ii-austin",
      "palatable-nigerian-cuisine-austin-tx",
      "kitchen234-nigerian-restaurant-austin",
      "distant-relatives-austin",
      "suya-grillhouse-austin",
    ],
  },
]

export function getCollectionSlugs(): string[] {
  return EDITORIAL_COLLECTIONS.map((c) => c.slug)
}

export function getCollectionBySlug(slug: string): EditorialCollection | undefined {
  return EDITORIAL_COLLECTIONS.find((c) => c.slug === slug)
}

export function resolveCollectionRestaurants(
  collection: EditorialCollection,
  all: Restaurant[]
): Restaurant[] {
  const bySlug = new Map(all.map((r) => [r.slug, r] as const))
  const out: Restaurant[] = []
  for (const s of collection.restaurantSlugs) {
    const r = bySlug.get(s)
    if (r) out.push(r)
  }
  return out
}
