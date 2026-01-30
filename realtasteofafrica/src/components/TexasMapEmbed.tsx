"use client"

import Link from "next/link"

const QUICK_NAV = [
  { label: "Houston", areaSlug: "houston" },
  { label: "DFW", areaSlug: "dfw" },
  { label: "Austin", areaSlug: "austin" },
  { label: "San Antonio", areaSlug: "san-antonio" },
  { label: "West Texas", areaSlug: "west-texas" },
] as const

type TexasMapEmbedProps = {
  /** Google My Maps embed URL (iframe src). Set via NEXT_PUBLIC_GOOGLE_MY_MAPS_EMBED_URL or pass here. */
  mapEmbedUrl?: string | null
}

const DEFAULT_MAP_EMBED_URL =
  "https://www.google.com/maps/d/u/0/embed?mid=1JrMru4xATnFRQBcjHT_8_WFKf7RuRhw&ehbc=2E312F"

export function TexasMapEmbed({ mapEmbedUrl }: TexasMapEmbedProps) {
  const envUrl = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GOOGLE_MY_MAPS_EMBED_URL : ""
  const src = (mapEmbedUrl ?? envUrl ?? DEFAULT_MAP_EMBED_URL).trim()

  return (
    <div className="mx-auto max-w-7xl rounded-2xl bg-white p-4 shadow-sm md:p-6">
      <header className="mb-4 md:mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          The Real Taste of Africa: Texas Coverage
        </h2>
        <p className="mt-1 text-sm text-slate-600 md:text-base">
          Explore 175+ verified restaurants, trucks, and markets across the Lone Star State.
        </p>
      </header>

      <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-2xl">
        {src ? (
          <iframe
            src={src}
            title="Real Taste of Africa — Texas coverage map"
            className="h-[400px] w-full md:h-[500px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center bg-slate-100 md:h-[500px]">
            <p className="text-center text-sm text-slate-500">
              Add your Google My Maps embed URL in{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">.env.local</code>
              {" "}as <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_GOOGLE_MY_MAPS_EMBED_URL</code>
            </p>
          </div>
        )}
        <span
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
          aria-hidden
        >
          ✅ Manually Verified 2026
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-xs text-slate-500">Quick navigation:</span>
        {QUICK_NAV.map(({ label, areaSlug }) => (
          <Link
            key={areaSlug}
            href={`/restaurants?area=${areaSlug}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-amber-50 hover:border-amber-200 hover:text-amber-800"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
