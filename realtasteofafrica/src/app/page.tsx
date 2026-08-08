import Link from "next/link"

import { FeaturedGrid } from "@/components/FeaturedGrid"
import { HomeGuides } from "@/components/HomeGuides"
import { HomeHero } from "@/components/HomeHero"
import { RecentlyViewedSection } from "@/components/RecentlyViewedSection"
import { StatewideDiscovery } from "@/components/StatewideDiscovery"
import { getFeaturedRestaurants, RESTAURANTS } from "@/lib/restaurants"

const FEATURED_ORDER = [
  "chopnblok-montrose-houston-tx",
  "red-sea-kitchen-ethiopian-food-truck-austin-tx",
  "wazobia-african-market-and-kitchen-houston-tx",
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
      <HomeHero listingCount={RESTAURANTS.length} restaurants={RESTAURANTS} />

      <RecentlyViewedSection />

      <section className="min-w-0 grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
              Editor&apos;s picks
            </h2>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              Three spots we love right now for authentic flavor and community vibe.
            </p>
          </div>
          <Link
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
            href="/collections"
          >
            More guides →
          </Link>
        </div>

        <FeaturedGrid restaurants={featured} limit={3} />
      </section>

      <HomeGuides />

      <StatewideDiscovery restaurants={RESTAURANTS} />
    </div>
  )
}
