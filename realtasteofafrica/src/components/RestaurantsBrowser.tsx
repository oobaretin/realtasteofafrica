"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/Badge"
import { FilterBar } from "@/components/FilterBar"
import { OpenNowToggle } from "@/components/OpenNowToggle"
import { RestaurantCard } from "@/components/RestaurantCard"
import type { Area } from "@/lib/areas"
import { getBusinessStatus } from "@/lib/businessHours"
import { getEstablishmentCategory } from "@/lib/establishmentType"
import type { Restaurant } from "@/lib/restaurants"

const SORT_OPTIONS = [
  { value: "status", label: "Status" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "newest", label: "Newest First" },
] as const

type SortBy = (typeof SORT_OPTIONS)[number]["value"]

function statusOrder(status: string): number {
  switch (status) {
    case "Open Now":
      return 0
    case "Closing Soon":
      return 1
    case "Unverified":
      return 2
    case "Closed":
      return 3
    default:
      return 4
  }
}

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
  initialCuisine = "",
  initialArea = "",
  isOpenNowOnly = false,
  onOpenNowOnlyChange,
}: {
  restaurants: Restaurant[]
  areas: Area[]
  cuisineTags: string[]
  initialCuisine?: string
  initialArea?: string
  isOpenNowOnly?: boolean
  onOpenNowOnlyChange?: (value: boolean) => void
}) {
  const [query, setQuery] = useState("")
  const [areaSlug, setAreaSlug] = useState<string>(initialArea)
  const [cuisine, setCuisine] = useState<string>(initialCuisine)
  const [category, setCategory] = useState<string>("All")
  const [sortBy, setSortBy] = useState<SortBy>("status")

  useEffect(() => {
    setAreaSlug(initialArea)
    setCuisine(initialCuisine)
  }, [initialArea, initialCuisine])

  const filterBarValues = useMemo(
    () => ({ category, region: areaSlug, cuisine }),
    [category, areaSlug, cuisine]
  )

  const handleFilterChange = (key: "category" | "region" | "cuisine", value: string) => {
    if (key === "category") setCategory(value)
    else if (key === "region") setAreaSlug(value)
    else setCuisine(value)
  }

  const areaBySlug = useMemo(() => {
    const map = new Map<string, Area>()
    for (const a of areas) map.set(a.slug, a)
    return map
  }, [areas])

  const filtered = useMemo(() => {
    const q = normalize(query)
    return restaurants.filter((r) => {
      if (isOpenNowOnly) {
        const status = getBusinessStatus(r.hours).status
        if (status !== "Open Now" && status !== "Closing Soon") return false
      }
      if (areaSlug && r.areaSlug !== areaSlug) return false
      if (category && category !== "All") {
        if (getEstablishmentCategory(r) !== category) return false
      }
      if (cuisine) {
        const matchesCuisine =
          r.cuisines.some((c) => normalize(c) === normalize(cuisine)) ||
          (r.cuisine != null && normalize(r.cuisine) === normalize(cuisine))
        if (!matchesCuisine) return false
      }
      if (!q) return true
      return (
        includesAny(r.name, [q]) ||
        includesAny(r.city, [q]) ||
        includesAny(r.addressLine, [q]) ||
        r.cuisines.some((c) => includesAny(c, [q]))
      )
    })
  }, [areaSlug, category, cuisine, isOpenNowOnly, query, restaurants])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sortBy === "status") {
      list.sort((a, b) => {
        const sa = getBusinessStatus(a.hours).status
        const sb = getBusinessStatus(b.hours).status
        return statusOrder(sa) - statusOrder(sb)
      })
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))
    } else if (sortBy === "newest") {
      list.sort((a, b) => {
        const da = a.lastAuditDate ?? ""
        const db = b.lastAuditDate ?? ""
        return db.localeCompare(da)
      })
    }
    return list
  }, [filtered, sortBy])

  const handleRefine = () => {
    setQuery("")
    setAreaSlug("")
    setCuisine("")
    setCategory("All")
    onOpenNowOnlyChange?.(false)
  }

  return (
    <div className="grid gap-4">
      {/* Quick-Action Bar: sticky, backdrop-blur */}
      <div
        className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md sm:mx-0"
        role="toolbar"
        aria-label="Browse options"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
          <OpenNowToggle
            checked={isOpenNowOnly}
            onChange={(v) => onOpenNowOnlyChange?.(v)}
            variant="inline"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm font-medium text-slate-600">
              Sort by
            </label>
            <span className="relative inline-block">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="min-w-[8rem] appearance-none rounded-md border-0 bg-transparent py-1.5 pr-6 pl-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
                aria-label="Sort listings"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </span>
          </div>
          <span className="text-sm text-slate-500">
            Showing {sorted.length} verified spot{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={handleRefine}
          className="rounded-lg border-0 bg-transparent py-1.5 px-2 text-sm font-medium text-amber-700 hover:bg-amber-50 focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
        >
          Refine
        </button>
      </div>

      <FilterBar
        areas={areas}
        cuisineTags={cuisineTags}
        values={filterBarValues}
        onFilterChange={handleFilterChange}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-1">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Search</span>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Name, cuisine, city, address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{sorted.length} results</Badge>
            {category && category !== "All" ? (
              <Badge>{category}</Badge>
            ) : null}
            {areaSlug ? (
              <Badge>{areaBySlug.get(areaSlug)?.name ?? areaSlug}</Badge>
            ) : null}
            {cuisine ? <Badge>{cuisine}</Badge> : null}
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {isOpenNowOnly ? (
            <p className="text-slate-600">
              Most spots are closed right now, but you can still browse the full directory.
            </p>
          ) : (
            <p className="text-slate-600">
              No results match your filters. Try adjusting or reset to see all listings.
            </p>
          )}
          <button
            type="button"
            onClick={handleRefine}
            className="mt-6 inline-flex rounded-xl bg-amber-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-amber-700 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            See All {restaurants.length} Listings
          </button>
        </div>
      ) : (
        <ul
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          aria-label="Restaurant listings"
        >
          {sorted.map((r) => (
            <li key={r.slug}>
              <RestaurantCard restaurant={r} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

