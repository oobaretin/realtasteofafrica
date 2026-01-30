import Link from "next/link"

import { RestaurantCard } from "@/components/RestaurantCard"
import type { Restaurant } from "@/lib/restaurants"

export function SimilarSpots({
  restaurants,
  title,
}: {
  restaurants: Restaurant[]
  title: string
}) {
  if (restaurants.length === 0) return null
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="similar-spots-heading">
      <h2 id="similar-spots-heading" className="text-lg font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <ul className="mt-4 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
        {restaurants.map((r) => (
          <li key={r.slug} className="min-w-[280px] shrink-0 sm:min-w-0">
            <RestaurantCard restaurant={r} />
          </li>
        ))}
      </ul>
    </section>
  )
}
