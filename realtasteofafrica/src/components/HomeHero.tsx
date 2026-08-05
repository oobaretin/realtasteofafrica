import Link from "next/link"

import { HomeQuickFind } from "@/components/HomeQuickFind"
import { formatLatestAuditMonth } from "@/lib/formatAudit"
import type { Restaurant } from "@/lib/restaurants"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site"

const QUICK_AREAS = [
  { slug: "houston", label: "Houston" },
  { slug: "dfw", label: "DFW" },
  { slug: "austin", label: "Austin" },
] as const

const QUICK_CUISINES = ["Nigerian", "Ethiopian", "West African"] as const

type HomeHeroProps = {
  listingCount: number
  restaurants: Restaurant[]
}

export function HomeHero({ listingCount, restaurants }: HomeHeroProps) {
  const auditMonth = formatLatestAuditMonth(restaurants)
  const cityCount = new Set(restaurants.map((r) => `${r.city}-${r.state}`)).size

  return (
    <section className="hero-grain relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 px-4 py-6 text-white shadow-sm sm:rounded-3xl sm:p-6 md:p-8">
      <div className="absolute inset-0 opacity-40 hero-warm-glow" aria-hidden />
      <div className="relative min-w-0">
        <p className="font-display text-sm font-medium tracking-wide text-amber-300/95 sm:text-base">
          {SITE_NAME}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          Find African food in Texas
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base md:text-lg">
          {SITE_TAGLINE} Browse {listingCount}+ spots in {cityCount}+ cities.
        </p>

        <div className="mt-6">
          <HomeQuickFind listingCount={listingCount} variant="hero" />
        </div>

        <div className="mt-5 flex min-w-0 flex-wrap gap-2">
          {QUICK_AREAS.map(({ slug, label }) => (
            <Link
              key={slug}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:border-amber-300/50 hover:bg-white/15"
              href={`/restaurants?area=${slug}`}
            >
              {label}
            </Link>
          ))}
          {QUICK_CUISINES.map((tag) => (
            <Link
              key={tag}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:border-amber-300/50 hover:bg-white/15"
              href={`/restaurants?cuisine=${encodeURIComponent(tag)}`}
            >
              {tag}
            </Link>
          ))}
          <Link
            className="rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/30"
            href="/restaurants"
          >
            Browse all →
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          {listingCount}+ listings · {cityCount}+ cities · audited {auditMonth}
          {" · "}
          <Link href="/trust" className="text-amber-300/90 underline hover:text-amber-200">
            How we verify
          </Link>
        </p>
      </div>
    </section>
  )
}
