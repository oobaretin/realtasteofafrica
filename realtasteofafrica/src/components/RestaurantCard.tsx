"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/Badge"
import {
  CATEGORY_BADGE_CLASSES,
  CATEGORY_STRIP_CLASSES,
  getEstablishmentCategory,
} from "@/lib/establishmentType"
import type { Restaurant } from "@/lib/restaurants"
import { useBusinessStatus } from "@/components/BusinessStatusClient"
import { VerifiedBadge } from "@/components/VerifiedBadge"

const viewButtonClasses =
  "inline-flex min-h-12 w-full select-none items-center justify-center gap-2 rounded-xl border border-amber-700 bg-amber-600 text-sm font-semibold text-white transition-transform hover:bg-amber-700 active:scale-95 touch-manipulation"

export function RestaurantCard({
  restaurant,
  variant = "default",
  distanceLabel,
}: {
  restaurant: Restaurant
  variant?: "default" | "featured"
  /** Shown when browsing by proximity (e.g. "2.4 mi away") */
  distanceLabel?: string
}) {
  const r = restaurant
  const establishmentCategory = getEstablishmentCategory(r)
  const badgeClasses = CATEGORY_BADGE_CLASSES[establishmentCategory]
  const stripClasses = CATEGORY_STRIP_CLASSES[establishmentCategory]
  const isFeatured = variant === "featured"
  const businessStatus = useBusinessStatus(r.hours)
  const isClosed = businessStatus.status === "Closed"

  return (
    <article
      className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md ${
        isFeatured ? "border-amber-200 shadow-md hover:shadow-lg" : ""
      } ${isClosed ? "opacity-75" : ""}`}
    >
      {r.imageUrl ? (
        <div className="relative h-36 shrink-0 bg-slate-100">
          <Image
            src={r.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        </div>
      ) : null}
      <div
        className={`relative shrink-0 ${stripClasses} ${isFeatured ? "h-12 sm:h-14" : "h-12"}`}
        aria-hidden
      >
        {businessStatus.status !== "Unverified" ? (
          <span
            className={`absolute left-2 top-2 h-2.5 w-2.5 rounded-full ring-2 ring-white/80 ${
              businessStatus.status === "Open Now"
                ? "bg-green-500 animate-pulse-subtle"
                : businessStatus.status === "Closing Soon"
                  ? "bg-orange-500"
                  : "bg-red-500"
            }`}
            title={businessStatus.status}
          />
        ) : null}
        <span
          className={`absolute right-2 top-2 inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide shadow-sm ${badgeClasses}`}
        >
          {establishmentCategory}
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${isFeatured ? "p-4 sm:p-6" : "p-4 sm:p-5"}`}>
        {r.isVerified ? (
          <div className="mb-3">
            <VerifiedBadge variant="prominent" />
          </div>
        ) : null}

        <div className="mb-2 flex flex-wrap items-center gap-2">
          {businessStatus.status !== "Unverified" ? (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                businessStatus.status === "Open Now"
                  ? "bg-green-100 text-green-800"
                  : businessStatus.status === "Closing Soon"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
              } ${businessStatus.status === "Open Now" ? "animate-pulse-subtle" : ""}`}
            >
              {businessStatus.status}
            </span>
          ) : null}
          {r.priceLevel ? (
            <Badge>{"$".repeat(r.priceLevel)}</Badge>
          ) : null}
        </div>

        <h2
          className={`min-w-0 font-semibold tracking-tight text-slate-900 break-words ${isFeatured ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}
        >
          <Link
            className="hover:text-amber-700 focus:text-amber-700"
            href={`/restaurants/${r.slug}`}
          >
            {r.name}
          </Link>
        </h2>
        <p
          className={`mt-1 font-medium text-slate-600 ${isFeatured ? "text-base" : "text-sm"}`}
        >
          {r.city}, {r.state}
          {r.cuisines.length > 0 ? ` · ${r.cuisines.join(" · ")}` : ""}
        </p>
        {distanceLabel ? (
          <p className="mt-1 text-sm font-medium text-amber-800">{distanceLabel}</p>
        ) : null}

        <div className={`mt-auto ${isFeatured ? "pt-4 sm:pt-5" : "pt-3 sm:pt-4"}`}>
          <Link className={viewButtonClasses} href={`/restaurants/${r.slug}`}>
            <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
            <span>View listing</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
