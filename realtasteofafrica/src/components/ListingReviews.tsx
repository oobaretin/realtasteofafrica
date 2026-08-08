import Link from "next/link"
import { Star } from "lucide-react"

import { getRestaurantMapsUrl } from "@/lib/mapsUrl"
import type { Restaurant } from "@/lib/restaurants"

function reviewContactHref(restaurantName: string): string {
  const params = new URLSearchParams({
    restaurant: restaurantName,
    topic: "review",
  })
  return `/contact?${params.toString()}#report`
}

export function ListingReviews({ restaurant }: { restaurant: Restaurant }) {
  const mapsUrl = getRestaurantMapsUrl(restaurant)

  return (
    <section
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="listing-reviews-heading"
    >
      <h2 id="listing-reviews-heading" className="text-lg font-semibold text-slate-900">
        Reviews &amp; experiences
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        We don&apos;t host star ratings on this directory yet — Google Maps and verified diners
        are the best sources. Read what others say, or share a short note to help the community.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Star className="h-4 w-4 shrink-0" aria-hidden />
          Read reviews on Google Maps
        </a>
        <Link
          href={reviewContactHref(restaurant.name)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 hover:border-amber-300 hover:bg-amber-50"
        >
          Share your experience
        </Link>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Community notes are reviewed before we add them to a listing.{" "}
        <Link href="/trust" className="text-amber-700 underline hover:text-amber-800">
          How we verify listings
        </Link>
      </p>
    </section>
  )
}
