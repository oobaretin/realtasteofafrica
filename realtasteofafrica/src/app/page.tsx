import Link from "next/link"

import { Badge } from "@/components/Badge"
import { FeaturedCarousel } from "@/components/FeaturedCarousel"
import { HomeDiscovery } from "@/components/HomeDiscovery"
import { StatewideDiscovery } from "@/components/StatewideDiscovery"
import { getFeaturedRestaurants, RESTAURANTS } from "@/lib/restaurants"

const FEATURED_ORDER = [
  "chopnblok-montrose-houston-tx",
  "red-sea-kitchen-ethiopian-food-truck-austin-tx",
  "wazobia-african-market-and-kitchen-houston-tx",
  "aria-suya-kitchen-houston-tx",
]

/** Slugs missing from FEATURED_ORDER sort last (avoid indexOf=-1 bubbling to front). */
function featuredCarouselRank(slug: string): number {
  const i = FEATURED_ORDER.indexOf(slug)
  return i === -1 ? FEATURED_ORDER.length : i
}

export default function HomePage() {
  const featured = getFeaturedRestaurants().sort(
    (a, b) => featuredCarouselRank(a.slug) - featuredCarouselRank(b.slug)
  )

  return (
    <div className="min-w-0 grid gap-6 sm:gap-8 lg:gap-10">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 px-4 py-6 text-white shadow-sm sm:rounded-3xl sm:p-6 md:p-8">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.25),transparent_40%),radial-gradient(circle_at_70%_30%,rgba(249,115,22,0.18),transparent_45%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Directory</Badge>
            <Badge>{RESTAURANTS.length}+ listings</Badge>
            <Badge>Texas-wide</Badge>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:mt-5 sm:text-3xl md:text-5xl">
            Real Taste of Africa
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:mt-4 sm:text-base md:text-lg break-words">
            The Definitive Guide to {RESTAURANTS.length}+ African Restaurants, Food Trucks, and
            Markets Across Texas.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
            Statewide coverage from El Paso to Beaumont — find African food
            across the state.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
            <Link
              className="rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
              href="/restaurants"
            >
              Browse directory
            </Link>
          </div>
        </div>
      </section>

      <HomeDiscovery listingCount={RESTAURANTS.length} />

      <section className="min-w-0 grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
              Editor&apos;s favorites
            </h2>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              From the {RESTAURANTS.length}+ spots we track, here are our current favorites for
              authentic flavor, community vibe, and incredible spice.
            </p>
          </div>
          <Link
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
            href="/restaurants"
          >
            See all →
          </Link>
        </div>

        <FeaturedCarousel restaurants={featured} />
      </section>

      <StatewideDiscovery restaurants={RESTAURANTS} />
    </div>
  )
}
