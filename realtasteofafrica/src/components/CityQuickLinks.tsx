import Link from "next/link"

import type { Restaurant } from "@/lib/restaurants"

export function CityQuickLinks({
  cityName,
  areaSlug,
}: {
  cityName: string
  citySlug: string
  areaSlug: string
}) {
  const searchQ = encodeURIComponent(cityName)

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/restaurants?q=${searchQ}`}
        className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm hover:border-amber-300 hover:bg-amber-50"
      >
        Filter browse →
      </Link>
      <Link
        href={`/restaurants?view=map&q=${searchQ}`}
        className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm hover:border-amber-300 hover:bg-amber-50"
      >
        View on map →
      </Link>
      <Link
        href={`/restaurants?area=${areaSlug}`}
        className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm hover:border-amber-300 hover:bg-amber-50"
      >
        Browse region →
      </Link>
      <Link
        href="/collections"
        className="inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-semibold text-amber-700 hover:text-amber-800"
      >
        Guides →
      </Link>
    </div>
  )
}
