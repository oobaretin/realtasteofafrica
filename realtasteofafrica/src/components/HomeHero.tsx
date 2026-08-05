import Link from "next/link"

import { HomeQuickFind } from "@/components/HomeQuickFind"
import { formatLatestAuditMonth } from "@/lib/formatAudit"
import type { Restaurant } from "@/lib/restaurants"

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
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 px-4 py-6 text-white shadow-sm sm:rounded-3xl sm:p-6 md:p-8">
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.25),transparent_40%),radial-gradient(circle_at_70%_30%,rgba(249,115,22,0.18),transparent_45%)]" />
      <div className="relative min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          Find African food in Texas
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base md:text-lg">
          Texas&apos;s African food map — verified hours, phones, and directions across{" "}
          {listingCount}+ spots in {cityCount}+ cities.
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
        </p>
      </div>
    </section>
  )
}
