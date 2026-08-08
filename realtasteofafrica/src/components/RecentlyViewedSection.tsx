"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"

import { RestaurantCard } from "@/components/RestaurantCard"
import { getRestaurantBySlug } from "@/lib/restaurants"
import {
  getRecentlyViewedServerSnapshot,
  getRecentlyViewedSnapshot,
  subscribeRecentlyViewed,
} from "@/lib/recentlyViewed"

export function RecentlyViewedSection() {
  const slugs = useSyncExternalStore(
    subscribeRecentlyViewed,
    getRecentlyViewedSnapshot,
    getRecentlyViewedServerSnapshot
  )
  const restaurants = slugs
    .map((slug) => getRestaurantBySlug(slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  if (restaurants.length === 0) return null

  return (
    <section className="min-w-0 grid gap-4" aria-labelledby="recently-viewed-heading">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="recently-viewed-heading"
            className="font-display text-lg font-semibold tracking-tight sm:text-xl"
          >
            Recently viewed
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Pick up where you left off on this device.
          </p>
        </div>
        <Link
          href="/saved"
          className="text-sm font-medium text-amber-700 hover:text-amber-800"
        >
          Saved spots →
        </Link>
      </div>
      <ul className="grid grid-cols-1 gap-2 sm:gap-3">
        {restaurants.map((r) => (
          <li key={r.slug}>
            <RestaurantCard restaurant={r} variant="row" />
          </li>
        ))}
      </ul>
    </section>
  )
}
