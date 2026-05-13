"use client"

import type { ReactElement } from "react"
import Link from "next/link"
import { ArrowRight, Globe, MapPin, Phone } from "lucide-react"

import { Badge } from "@/components/Badge"
import {
  CATEGORY_BADGE_CLASSES,
  CATEGORY_STRIP_CLASSES,
  getEstablishmentCategory,
} from "@/lib/establishmentType"
import { ListingExternalLink } from "@/components/ListingExternalLink"
import { formatPhoneDisplay, toTelHref } from "@/lib/formatPhone"
import type { Restaurant } from "@/lib/restaurants"
import { useBusinessStatus } from "@/components/BusinessStatusClient"
import { VerifiedBadge } from "@/components/VerifiedBadge"

const touchBase =
  "inline-flex min-h-12 w-full select-none items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-transform active:scale-95 touch-manipulation"

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

  const actionEls: ReactElement[] = [
    <Link
      key="details"
      className={`${touchBase} border-amber-700 bg-amber-600 text-white hover:bg-amber-700`}
      href={`/restaurants/${r.slug}`}
    >
      <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
      <span>Details</span>
    </Link>,
  ]

  if (r.websiteUrl) {
    actionEls.push(
      <ListingExternalLink
        key="web"
        href={r.websiteUrl}
        className={`${touchBase} border-slate-200 bg-white text-slate-800 hover:bg-slate-50`}
      >
        <Globe className="h-5 w-5 shrink-0 text-slate-600" aria-hidden />
        <span>Website</span>
        <span className="sr-only"> (opens in new tab)</span>
      </ListingExternalLink>
    )
  }

  if (r.phone) {
    actionEls.push(
      <a
        key="phone"
        className={`${touchBase} border-slate-200 bg-white text-slate-800 hover:bg-slate-50`}
        href={`tel:${toTelHref(r.phone)}`}
      >
        <Phone className="h-5 w-5 shrink-0 text-slate-600" aria-hidden />
        <span>Call</span>
        <span className="sr-only">{formatPhoneDisplay(r.phone)}</span>
      </a>
    )
  }

  if (r.mapsUrl) {
    actionEls.push(
      <a
        key="maps"
        className={`${touchBase} border-slate-200 bg-white text-slate-800 hover:bg-slate-50`}
        href={r.mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        <MapPin className="h-5 w-5 shrink-0 text-slate-600" aria-hidden />
        <span>Directions</span>
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    )
  }

  return (
    <article
      className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md ${
        isFeatured ? "border-amber-200 shadow-md hover:shadow-lg" : ""
      } ${isClosed ? "opacity-75" : ""}`}
    >
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

        <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
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

        <p
          className={`font-bold uppercase tracking-wide text-slate-700 ${isFeatured ? "text-base sm:text-lg" : "text-base"}`}
        >
          {r.city}, {r.state}
        </p>
        <h2
          className={`mt-1 min-w-0 font-semibold tracking-tight text-slate-900 break-words ${isFeatured ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}
        >
          <Link
            className="hover:text-amber-700 focus:text-amber-700"
            href={`/restaurants/${r.slug}`}
          >
            {r.name}
          </Link>
        </h2>
        <p
          className={`mt-1 min-w-0 break-words text-slate-600 ${isFeatured ? "text-base" : "text-sm"}`}
        >
          {r.cuisines.join(" · ")}
        </p>
        <p className={`mt-2 min-w-0 break-words text-slate-500 ${isFeatured ? "text-sm" : "text-xs"}`}>
          {r.addressLine}
        </p>
        {distanceLabel ? (
          <p className="mt-1 text-sm font-medium text-amber-800">{distanceLabel}</p>
        ) : null}

        <div className={`mt-auto grid grid-cols-2 gap-2 ${isFeatured ? "pt-4 sm:pt-5" : "pt-3 sm:pt-4"}`}>
          {actionEls.map((el, i) => {
            const oddLast = actionEls.length % 2 === 1 && i === actionEls.length - 1
            return (
              <div key={`action-${i}`} className={oddLast ? "col-span-2" : undefined}>
                {el}
              </div>
            )
          })}
        </div>
        {r.lastAuditDate && r.lastAuditDate.startsWith("2026") ? (
          <p className="mt-2 text-xs text-slate-400">Verified 2026</p>
        ) : null}
      </div>
    </article>
  )
}
