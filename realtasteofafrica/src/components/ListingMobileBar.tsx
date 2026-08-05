"use client"

import { ShareButton } from "@/components/ShareButton"
import { formatPhoneDisplay, toTelHref } from "@/lib/formatPhone"
import type { Restaurant } from "@/lib/restaurants"

function googleMapsUrl(addressLine: string, city: string, state: string) {
  const query = encodeURIComponent(`${addressLine}, ${city}, ${state}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export function ListingMobileBar({ restaurant }: { restaurant: Restaurant }) {
  const r = restaurant
  const mapsHref = googleMapsUrl(r.addressLine, r.city, r.state)

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
      role="toolbar"
      aria-label="Quick actions"
    >
      <div className="mx-auto flex max-w-6xl gap-2">
        {r.phone ? (
          <a
            href={`tel:${toTelHref(r.phone)}`}
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <span aria-hidden>📞</span>
            Call
            <span className="sr-only">{formatPhoneDisplay(r.phone)}</span>
          </a>
        ) : null}
        <a
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <span aria-hidden>📍</span>
          Directions
        </a>
        <div className="flex min-h-11 flex-1 [&>button]:h-full [&>button]:w-full [&>button]:justify-center [&>button]:rounded-xl [&>button]:border-2 [&>button]:border-slate-200 [&>button]:bg-white [&>button]:text-sm [&>button]:font-semibold">
          <ShareButton title={r.name} url={`/restaurants/${r.slug}`} shareName={r.name} />
        </div>
      </div>
    </div>
  )
}
