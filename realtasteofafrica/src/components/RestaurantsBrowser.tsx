"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { Badge } from "@/components/Badge"
import type { Area } from "@/lib/areas"
import type { Restaurant } from "@/lib/restaurants"

function normalize(s: string) {
  return s.toLowerCase().trim()
}

function includesAny(haystack: string, needles: string[]) {
  const h = normalize(haystack)
  return needles.some((n) => h.includes(normalize(n)))
}

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits.startsWith("+") ? digits : `+${digits}`
}

export function RestaurantsBrowser({
  restaurants,
  areas,
  cuisineTags,
}: {
  restaurants: Restaurant[]
  areas: Area[]
  cuisineTags: string[]
}) {
  const [query, setQuery] = useState("")
  const [areaSlug, setAreaSlug] = useState<string>("")
  const [cuisine, setCuisine] = useState<string>("")

  const areaBySlug = useMemo(() => {
    const map = new Map<string, Area>()
    for (const a of areas) map.set(a.slug, a)
    return map
  }, [areas])

  const filtered = useMemo(() => {
    const q = normalize(query)
    return restaurants.filter((r) => {
      if (areaSlug && r.areaSlug !== areaSlug) return false
      if (cuisine && !r.cuisines.some((c) => normalize(c) === normalize(cuisine)))
        return false
      if (!q) return true
      return (
        includesAny(r.name, [q]) ||
        includesAny(r.city, [q]) ||
        includesAny(r.addressLine, [q]) ||
        r.cuisines.some((c) => includesAny(c, [q]))
      )
    })
  }, [areaSlug, cuisine, query, restaurants])

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Search</span>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Name, cuisine, city, address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Area</span>
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={areaSlug}
              onChange={(e) => setAreaSlug(e.target.value)}
            >
              <option value="">All areas</option>
              {areas.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Cuisine</span>
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option value="">All cuisines</option>
              {cuisineTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{filtered.length} results</Badge>
            {areaSlug ? (
              <Badge>{areaBySlug.get(areaSlug)?.name ?? areaSlug}</Badge>
            ) : null}
            {cuisine ? <Badge>{cuisine}</Badge> : null}
          </div>
          <button
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            type="button"
            onClick={() => {
              setQuery("")
              setAreaSlug("")
              setCuisine("")
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-200">
          {filtered.map((r) => (
            <li key={r.slug} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold tracking-tight text-slate-900">
                    <Link className="hover:text-amber-800" href={`/restaurants/${r.slug}`}>
                      {r.name}
                    </Link>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {r.city}, {r.state} • {r.cuisines.join(" • ")}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{r.addressLine}</div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    href={`/areas/${r.areaSlug}`}
                  >
                    {areaBySlug.get(r.areaSlug)?.name ?? r.areaSlug}
                  </Link>
                  {r.priceLevel ? <Badge>{"$".repeat(r.priceLevel)}</Badge> : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {r.highlights.slice(0, 3).map((h) => (
                  <Badge key={h}>{h}</Badge>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="inline-flex rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                  href={`/restaurants/${r.slug}`}
                >
                  View details →
                </Link>
                {r.mapsUrl ? (
                  <a
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    href={r.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Map
                  </a>
                ) : null}
                {r.websiteUrl ? (
                  <a
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    href={r.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Website
                  </a>
                ) : null}
                {r.phone ? (
                  <a
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    href={`tel:${toTelHref(r.phone)}`}
                  >
                    Call
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

