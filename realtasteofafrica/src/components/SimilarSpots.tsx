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
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="similar-spots-heading">
      <h2 id="similar-spots-heading" className="text-lg font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <ul className="mt-4 grid min-w-0 grid-cols-1 gap-2 sm:gap-3">
        {restaurants.slice(0, 3).map((r) => (
          <li key={r.slug} className="min-w-0">
            <RestaurantCard restaurant={r} variant="row" />
          </li>
        ))}
      </ul>
    </section>
  )
}
