"use client"

import Link from "next/link"

import { Badge } from "@/components/Badge"
import {
  CATEGORY_BADGE_CLASSES,
  getEstablishmentCategory,
} from "@/lib/establishmentType"
import type { Restaurant } from "@/lib/restaurants"

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits.startsWith("+") ? digits : `+${digits}`
}

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const r = restaurant
  const establishmentCategory = getEstablishmentCategory(r)
  const categoryBadgeClasses = CATEGORY_BADGE_CLASSES[establishmentCategory]

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryBadgeClasses}`}
        >
          {establishmentCategory}
        </span>
        {r.priceLevel ? (
          <Badge>{"$".repeat(r.priceLevel)}</Badge>
        ) : null}
      </div>

      <p className="text-base font-bold uppercase tracking-wide text-slate-600">
        {r.city}, {r.state}
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
        <Link
          className="hover:text-amber-700 focus:text-amber-700"
          href={`/restaurants/${r.slug}`}
        >
          {r.name}
        </Link>
      </h2>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
        {r.cuisines.join(" · ")}
      </p>
      <p className="mt-2 text-xs text-slate-500">{r.addressLine}</p>

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <Link
          className="inline-flex rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          href={`/restaurants/${r.slug}`}
        >
          Details →
        </Link>
        {r.websiteUrl ? (
          <a
            className="inline-flex rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href={r.websiteUrl}
            target="_blank"
            rel="noreferrer"
          >
            Website
          </a>
        ) : null}
        {r.phone ? (
          <a
            className="inline-flex rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href={`tel:${toTelHref(r.phone)}`}
          >
            Call
          </a>
        ) : null}
      </div>
    </article>
  )
}
