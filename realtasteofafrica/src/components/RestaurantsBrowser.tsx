"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/Badge"
import { FilterBar } from "@/components/FilterBar"
import { RestaurantCard } from "@/components/RestaurantCard"
import type { Area } from "@/lib/areas"
import { getEstablishmentCategory } from "@/lib/establishmentType"
import type { Restaurant } from "@/lib/restaurants"

function normalize(s: string) {
  return s.toLowerCase().trim()
}

function includesAny(haystack: string, needles: string[]) {
  const h = normalize(haystack)
  return needles.some((n) => h.includes(normalize(n)))
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
  const [category, setCategory] = useState<string>("All")

  const filterBarValues = useMemo(
    () => ({ category, region: areaSlug }),
    [category, areaSlug]
  )

  const handleFilterChange = (key: "category" | "region", value: string) => {
    if (key === "category") setCategory(value)
    else setAreaSlug(value)
  }

  const areaBySlug = useMemo(() => {
    const map = new Map<string, Area>()
    for (const a of areas) map.set(a.slug, a)
    return map
  }, [areas])

  const filtered = useMemo(() => {
    const q = normalize(query)
    return restaurants.filter((r) => {
      if (areaSlug && r.areaSlug !== areaSlug) return false
      if (category && category !== "All") {
        if (getEstablishmentCategory(r) !== category) return false
      }
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
  }, [areaSlug, category, cuisine, query, restaurants])

  return (
    <div className="grid gap-4">
      <FilterBar
        areas={areas}
        values={filterBarValues}
        onFilterChange={handleFilterChange}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
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
            {category && category !== "All" ? (
              <Badge>{category}</Badge>
            ) : null}
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
              setCategory("All")
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <ul
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
        aria-label="Restaurant listings"
      >
        {filtered.map((r) => (
          <li key={r.slug}>
            <RestaurantCard restaurant={r} />
          </li>
        ))}
      </ul>
    </div>
  )
}

