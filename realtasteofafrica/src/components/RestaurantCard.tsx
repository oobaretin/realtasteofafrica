"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"

import { Badge } from "@/components/Badge"
import { SaveSpotButton } from "@/components/SaveSpotButton"
import { ShareSpotButton } from "@/components/ShareSpotButton"
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

function StatusPill({ status }: { status: string }) {
  if (status === "Unverified") return null
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        status === "Open Now"
          ? "bg-green-100 text-green-800"
          : status === "Closing Soon"
            ? "bg-orange-100 text-orange-800"
            : "bg-red-100 text-red-800"
      } ${status === "Open Now" ? "animate-pulse-subtle" : ""}`}
    >
      {status}
    </span>
  )
}

export function RestaurantCard({
  restaurant,
  variant = "default",
  distanceLabel,
}: {
  restaurant: Restaurant
  variant?: "default" | "featured" | "row"
  distanceLabel?: string
}) {
  const r = restaurant
  const establishmentCategory = getEstablishmentCategory(r)
  const badgeClasses = CATEGORY_BADGE_CLASSES[establishmentCategory]
  const stripClasses = CATEGORY_STRIP_CLASSES[establishmentCategory]
  const isFeatured = variant === "featured"
  const isRow = variant === "row"
  const businessStatus = useBusinessStatus(r.hours)
  const isClosed = businessStatus.status === "Closed"
  const href = `/restaurants/${r.slug}`
  const cuisineLine =
    r.cuisines.length > 0 ? r.cuisines.slice(0, isRow ? 2 : r.cuisines.length).join(" · ") : ""

  if (isRow) {
    return (
      <article
        className={`flex items-stretch gap-1.5 sm:gap-2 ${isClosed ? "opacity-75" : ""}`}
      >
        <Link
          href={href}
          className="group flex min-h-[4.5rem] min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-md sm:gap-4 sm:px-4"
        >
          <div
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ${stripClasses} sm:h-16 sm:w-16`}
          >
            {r.imageUrl ? (
              <Image
                src={r.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            ) : (
              <span
                className={`flex h-full w-full items-center justify-center text-xs font-bold uppercase ${badgeClasses}`}
              >
                {establishmentCategory.slice(0, 3)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="min-w-0 truncate text-base font-semibold text-slate-900 group-hover:text-amber-800">
                {r.name}
              </h2>
              {r.isVerified ? <VerifiedBadge className="hidden sm:inline-flex" /> : null}
            </div>
            <p className="mt-0.5 truncate text-sm text-slate-600">
              {r.city}, {r.state}
              {cuisineLine ? ` · ${cuisineLine}` : ""}
            </p>
            {distanceLabel ? (
              <p className="mt-0.5 text-xs font-medium text-amber-800">{distanceLabel}</p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <StatusPill status={businessStatus.status} />
            {r.priceLevel ? <Badge>{"$".repeat(r.priceLevel)}</Badge> : null}
            <ChevronRight
              className="h-5 w-5 text-slate-400 group-hover:text-amber-700"
              aria-hidden
            />
          </div>
        </Link>
        <div className="flex shrink-0 flex-col gap-1.5">
          <ShareSpotButton
            title={r.name}
            url={href}
            shareName={r.name}
            variant="icon"
          />
          <SaveSpotButton slug={r.slug} name={r.name} variant="icon" />
        </div>
      </article>
    )
  }

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
      {!r.imageUrl ? (
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
      ) : null}

      <div className={`flex flex-1 flex-col ${isFeatured ? "p-4 sm:p-6" : "p-4 sm:p-5"}`}>
        {r.isVerified ? (
          <div className="mb-3">
            <VerifiedBadge variant="prominent" />
          </div>
        ) : null}

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusPill status={businessStatus.status} />
          {r.priceLevel ? <Badge>{"$".repeat(r.priceLevel)}</Badge> : null}
        </div>

        <h2
          className={`min-w-0 font-semibold tracking-tight text-slate-900 break-words ${isFeatured ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}
        >
          <Link className="hover:text-amber-700 focus:text-amber-700" href={href}>
            {r.name}
          </Link>
        </h2>
        <p
          className={`mt-1 font-medium text-slate-600 ${isFeatured ? "text-base" : "text-sm"}`}
        >
          {r.city}, {r.state}
          {cuisineLine ? ` · ${cuisineLine}` : ""}
        </p>
        {distanceLabel ? (
          <p className="mt-1 text-sm font-medium text-amber-800">{distanceLabel}</p>
        ) : null}

        <div className={`mt-auto ${isFeatured ? "pt-4 sm:pt-5" : "pt-3 sm:pt-4"}`}>
          <Link className={viewButtonClasses} href={href}>
            <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
            <span>View listing</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
