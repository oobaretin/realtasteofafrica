import type { Restaurant } from "@/lib/restaurants"

export type EditorialCollection = {
  slug: string
  /** Unique SEO & browser title */
  title: string
  metaDescription: string
  /** Short line under the hero */
  dek: string
  /** Hero image (remote URL or /public path) */
  headerImage: { src: string; alt: string }
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
      src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80",
      alt: "Jollof-style rice with herbs and vegetables",
    },
    introduction: [
      "Jollof opinions run deep. This guide is not a championship bracket — it is a living shortlist of Houston spots where West African and Nigerian menus lean into well-seasoned rice, grilled proteins, and repeat visits from the community.",
      "Hours and menus change. Call ahead or check the listing for the latest — especially for catering-sized orders and weekend service.",
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
      src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
      alt: "Aisle of spices and packaged goods at a grocery market",
    },
    introduction: [
      "Some of the best flavors in Texas sit on market shelves — dried fish, pepper blends, frozen greens, and weekend produce. We round up listings tagged as markets and hybrid market-kitchens so you can plan a pantry run and maybe grab a plate on the way out.",
      "Inventory turns over quickly; call for specialty items or holiday hours.",
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
