"use client"

import Link from "next/link"

export function ClaimListingBanner({
  restaurantName,
  slug,
}: {
  restaurantName: string
  slug: string
}) {
  const claimHref = `/claim?slug=${encodeURIComponent(slug)}#claim-search`

  return (
    <p className="text-center text-sm text-slate-500">
      Owner of {restaurantName}?{" "}
      <Link
        href={claimHref}
        className="font-medium text-amber-700 underline hover:text-amber-800"
      >
        Update this listing
      </Link>
    </p>
  )
}
