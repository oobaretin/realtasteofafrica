"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"

import { RestaurantCard } from "@/components/RestaurantCard"
import { getRestaurantBySlug } from "@/lib/restaurants"
import { getSavedSpotsSnapshot, subscribeSavedSpots } from "@/lib/savedSpots"

export function SavedSpotsList() {
  const slugs = useSyncExternalStore(subscribeSavedSpots, getSavedSpotsSnapshot, () => [])
  const restaurants = slugs
    .map((slug) => getRestaurantBySlug(slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  if (slugs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">No saved spots yet.</p>
        <Link
          href="/restaurants"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-amber-600 px-6 text-sm font-semibold text-white hover:bg-amber-700"
        >
          Browse restaurants
        </Link>
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Saved listings could not be loaded. Try browsing again and re-save your favorites.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:gap-3">
      {restaurants.map((r) => (
        <li key={r.slug}>
          <RestaurantCard restaurant={r} variant="row" />
        </li>
      ))}
    </ul>
  )
}
