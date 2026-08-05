import Link from "next/link"

import { countAuditedListings } from "@/lib/formatAudit"
import type { Restaurant } from "@/lib/restaurants"

const REGIONS: {
  title: string
  areaSlugs: string[]
  primarySlug: string
  gradient: string
}[] = [
  {
    title: "Greater Houston",
    areaSlugs: ["houston", "katy", "sugar-land"],
    primarySlug: "houston",
    gradient: "from-amber-600/90 to-amber-800/90",
  },
  {
    title: "DFW Metroplex",
    areaSlugs: ["dfw"],
    primarySlug: "dfw",
    gradient: "from-slate-700/90 to-slate-900/90",
  },
  {
    title: "Austin & Central TX",
    areaSlugs: ["austin", "central-texas"],
    primarySlug: "austin",
    gradient: "from-emerald-700/90 to-emerald-900/90",
  },
  {
    title: "San Antonio & West TX",
    areaSlugs: ["san-antonio", "west-texas", "el-paso", "south-texas"],
    primarySlug: "san-antonio",
    gradient: "from-amber-700/90 to-amber-900/90",
  },
]

function countByRegion(restaurants: Restaurant[], areaSlugs: string[]) {
  const set = new Set(areaSlugs)
  return restaurants.filter((r) => set.has(r.areaSlug)).length
}

function uniqueCityCount(restaurants: Restaurant[]) {
  return new Set(restaurants.map((r) => `${r.city}-${r.state}`)).size
}

type StatewideDiscoveryProps = {
  restaurants: Restaurant[]
}

export function StatewideDiscovery({ restaurants }: StatewideDiscoveryProps) {
  const total = restaurants.length
  const cities = uniqueCityCount(restaurants)
  const audited = countAuditedListings(restaurants)

  return (
    <section
      className="min-w-0 rounded-2xl bg-slate-100 p-4 sm:p-6 md:p-8"
      aria-labelledby="statewide-discovery-heading"
    >
      <header className="text-center">
        <h2
          id="statewide-discovery-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl"
        >
          Across Texas
        </h2>
        <p className="mt-2 text-slate-600 md:text-lg">
          Jump into a region or browse the full map of African restaurants statewide.
        </p>
      </header>

      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold tabular-nums text-amber-600 md:text-4xl">{total}+</p>
          <p className="mt-1 text-sm font-medium text-slate-700">Listings</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold tabular-nums text-amber-600 md:text-4xl">{cities}+</p>
          <p className="mt-1 text-sm font-medium text-slate-700">Cities</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-3xl font-bold tabular-nums text-amber-600 md:text-4xl">{audited}</p>
          <p className="mt-1 text-sm font-medium text-slate-700">Audited listings</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REGIONS.map((region) => {
          const count = countByRegion(restaurants, region.areaSlugs)
          return (
            <Link
              key={region.primarySlug}
              href={`/restaurants?area=${region.primarySlug}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg transition-shadow hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${region.gradient}`}
                aria-hidden
              />
              <div className="relative flex min-h-[140px] flex-col justify-between p-4 text-white sm:min-h-[160px] sm:p-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{region.title}</h3>
                  <p className="mt-1 text-2xl font-bold tabular-nums">
                    {count}+ <span className="text-sm font-normal opacity-90">spots</span>
                  </p>
                </div>
                <span className="mt-4 inline-flex w-fit rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors group-hover:bg-white/30">
                  Explore →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
