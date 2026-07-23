"use client"

import Link from "next/link"
import { useState } from "react"

export function ClaimListingBanner({
  restaurantName,
  slug,
}: {
  restaurantName: string
  slug: string
}) {
  const [expanded, setExpanded] = useState(false)
  const claimHref = `/claim?slug=${encodeURIComponent(slug)}#claim-search`

  return (
    <aside className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-amber-900">
          Own {restaurantName}?
        </p>
        <button
          type="button"
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 md:hidden"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Less" : "More"}
        </button>
      </div>
      <div className={expanded ? "mt-2 block" : "mt-2 hidden md:block"}>
        <p className="text-sm text-amber-900/80">
          Claim your listing for a verified badge, priority placement, and editable details.
        </p>
        <Link
          href={claimHref}
          className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white hover:bg-amber-700"
        >
          Claim this listing →
        </Link>
      </div>
      {!expanded ? (
        <Link
          href={claimHref}
          className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-amber-800 hover:text-amber-900 md:hidden"
        >
          Claim this listing →
        </Link>
      ) : null}
    </aside>
  )
}
