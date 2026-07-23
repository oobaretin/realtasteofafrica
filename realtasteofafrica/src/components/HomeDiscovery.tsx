import Link from "next/link"

import { HomeQuickFind } from "@/components/HomeQuickFind"
import { AREAS } from "@/lib/areas"
import { CUISINE_TAGS } from "@/lib/cuisines"

export function HomeDiscovery({ listingCount }: { listingCount: number }) {
  return (
    <section
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      aria-labelledby="home-discovery-heading"
    >
      <header className="grid gap-1">
        <h2 id="home-discovery-heading" className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          Find a spot
        </h2>
        <p className="text-sm text-slate-600">
          Search the directory or jump in by Texas region and cuisine.
        </p>
      </header>

      <div className="mt-5">
        <HomeQuickFind listingCount={listingCount} />
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Browse by area
        </h3>
        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-amber-200 hover:bg-amber-50"
              href={`/areas/${a.slug}`}
            >
              {a.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Explore by cuisine
        </h3>
        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
          {CUISINE_TAGS.map(({ tag }) => (
            <Link
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-amber-200 hover:bg-amber-50"
              href={`/restaurants?cuisine=${encodeURIComponent(tag)}`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
