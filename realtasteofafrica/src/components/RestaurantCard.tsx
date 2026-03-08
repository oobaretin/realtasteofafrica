"use client"

import Link from "next/link"

import { Badge } from "@/components/Badge"
import {
  CATEGORY_BADGE_CLASSES,
  CATEGORY_STRIP_CLASSES,
  getEstablishmentCategory,
} from "@/lib/establishmentType"
import type { Restaurant } from "@/lib/restaurants"
import { useBusinessStatus } from "@/components/BusinessStatusClient"
import { VerifiedBadge } from "@/components/VerifiedBadge"

function toTelHref(phone: string) {
  try {
    const digits = phone.replace(/[^\d+]/g, "");
    return digits.startsWith("+") ? digits : `+${digits}`;
  } catch (error) {
    console.error("Error formatting phone number:", error);
    return "";
  }
}

export function RestaurantCard({
  restaurant,
  variant = "default",
}: {
  restaurant: Restaurant
  variant?: "default" | "featured"
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
      {/* Category strip with status dot (top-left) and badge (top-right) */}
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
          {r.isVerified ? <VerifiedBadge /> : null}
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

        <div className={`mt-auto flex flex-wrap gap-2 ${isFeatured ? "pt-4 sm:pt-5" : "pt-3 sm:pt-4"}`}>
          <Link
            className={`inline-flex rounded-md bg-amber-600 font-semibold text-white hover:bg-amber-700 ${
              isFeatured ? "px-4 py-2.5 text-base" : "px-3 py-2 text-sm"
            }`}
            href={`/restaurants/${r.slug}`}
          >
            Details →
          </Link>
          {r.websiteUrl ? (
            <a
              className={`inline-flex rounded-md border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 ${
                isFeatured ? "px-4 py-2.5 text-base" : "px-3 py-2 text-sm"
              }`}
              href={r.websiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Website
            </a>
          ) : null}
          {r.phone ? (
            <a
              className={`inline-flex rounded-md border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 ${
                isFeatured ? "px-4 py-2.5 text-base" : "px-3 py-2 text-sm"
              }`}
              href={`tel:${toTelHref(r.phone)}`}
            >
              Call
            </a>
          ) : null}
        </div>
        {r.lastAuditDate && r.lastAuditDate.startsWith("2026") ? (
          <p className="mt-2 text-xs text-slate-400">Verified 2026</p>
        ) : null}
      </div>
    </article>
  )
}
