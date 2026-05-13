"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Locate, Loader2 } from "lucide-react"

import { Badge } from "@/components/Badge"
import { FilterBar } from "@/components/FilterBar"
import { OpenNowToggle } from "@/components/OpenNowToggle"
import { RestaurantCard } from "@/components/RestaurantCard"
import type { Area } from "@/lib/areas"
import { getBusinessStatus } from "@/lib/businessHours"
import {
  listingMatchesTypeFilter,
  typeFilterBadgeLabel,
} from "@/lib/establishmentType"
import { formatDistanceMiles, haversineKm } from "@/lib/geo"
import type { Restaurant } from "@/lib/restaurants"

const BASE_SORT_OPTIONS = [
  { value: "status", label: "Status" },
  { value: "alphabetical", label: "Name (A–Z)" },
  { value: "city", label: "City (A–Z)" },
  { value: "newest", label: "Recently verified" },
] as const

type BaseSortBy = (typeof BASE_SORT_OPTIONS)[number]["value"]
type SortBy = BaseSortBy | "distance"

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

function sortListByBusinessStatus(list: Restaurant[]) {
  list.sort((a, b) => {
    const sa = getBusinessStatus(a.hours).status
    const sb = getBusinessStatus(b.hours).status
    return statusOrder(sa) - statusOrder(sb)
  })
}

/** Stable nearest-first sort; rows without coordinates sort last (by name). */
function compareByDistanceThenName(
  a: Restaurant,
  b: Restaurant,
  distanceKm: (r: Restaurant) => number
) {
  const da = distanceKm(a)
  const db = distanceKm(b)
  if (da !== db) return da - db
  return a.name.localeCompare(b.name, "en", { sensitivity: "base" })
}

function normalize(s: string) {
  return s.toLowerCase().trim()
}

function searchMatches(restaurant: Restaurant, words: string[]): boolean {
  if (words.length === 0) return true
  const searchable = [
    restaurant.name,
    restaurant.city,
    restaurant.state,
    restaurant.addressLine,
    ...restaurant.cuisines,
    ...restaurant.highlights,
  ].join(" ")
  const searchableNorm = normalize(searchable)
  return words.every((w) => searchableNorm.includes(normalize(w)))
}

export function RestaurantsBrowser({
  restaurants,
  areas,
  cuisineTags,
  initialCuisine = "",
  initialArea = "",
  initialCategory = "All",
  isOpenNowOnly = false,
  onOpenNowOnlyChange,
}: {
  restaurants: Restaurant[]
  areas: Area[]
  cuisineTags: string[]
  initialCuisine?: string
  initialArea?: string
  initialCategory?: string
  isOpenNowOnly?: boolean
  onOpenNowOnlyChange?: (value: boolean) => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState("")
  const [areaSlug, setAreaSlug] = useState<string>(initialArea)
  const [cuisine, setCuisine] = useState<string>(initialCuisine)
  const [category, setCategory] = useState<string>(initialCategory)
  const [sortBy, setSortBy] = useState<SortBy>("status")
  const [nearMeActive, setNearMeActive] = useState(false)
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  useEffect(() => {
    // Sync filters when `searchParams` change from the server (e.g. back/forward, shared URL).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional prop→state sync for URL-driven browse state
    setAreaSlug(initialArea)
    setCuisine(initialCuisine)
    setCategory(initialCategory)
  }, [initialArea, initialCuisine, initialCategory])

  const filterBarValues = useMemo(
    () => ({ category, region: areaSlug, cuisine }),
    [category, areaSlug, cuisine]
  )

  const updateUrl = useCallback(
    (updates: { area?: string; cuisine?: string; type?: string }) => {
      const params = new URLSearchParams()
      if (updates.area) params.set("area", updates.area)
      if (updates.cuisine) params.set("cuisine", updates.cuisine)
      if (updates.type && updates.type !== "All") params.set("type", updates.type)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router]
  )

  const handleFilterChange = (key: "category" | "region" | "cuisine", value: string) => {
    if (key === "category") {
      setCategory(value)
      updateUrl({ area: areaSlug, cuisine, type: value })
    } else if (key === "region") {
      setAreaSlug(value)
      updateUrl({ area: value, cuisine, type: category })
    } else {
      setCuisine(value)
      updateUrl({ area: areaSlug, cuisine: value, type: category })
    }
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
        if (!listingMatchesTypeFilter(r, category)) return false
      }
      if (cuisine) {
        const matchesCuisine =
          r.cuisines.some((c) => normalize(c) === normalize(cuisine)) ||
          (r.cuisine != null && normalize(r.cuisine) === normalize(cuisine))
        if (!matchesCuisine) return false
      }
      if (!q) return true
      const words = q.split(/\s+/).filter(Boolean)
      return searchMatches(r, words)
    })
  }, [
    areaSlug,
    category,
    cuisine,
    isOpenNowOnly,
    query,
    restaurants,
  ])

  const distanceKm = useCallback(
    (r: Restaurant) => {
      if (
        !userPosition ||
        r.latitude == null ||
        r.longitude == null
      ) {
        return Number.POSITIVE_INFINITY
      }
      return haversineKm(userPosition.lat, userPosition.lng, r.latitude, r.longitude)
    },
    [userPosition]
  )

  const sorted = useMemo(() => {
    const list = [...filtered]
    const effectiveSort: SortBy =
      sortBy === "distance" && !userPosition ? "status" : sortBy

    if (effectiveSort === "distance") {
      list.sort((a, b) => compareByDistanceThenName(a, b, distanceKm))
    } else if (effectiveSort === "status") {
      sortListByBusinessStatus(list)
    } else if (effectiveSort === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))
    } else if (effectiveSort === "city") {
      list.sort((a, b) => {
        const byCity = a.city.localeCompare(b.city, "en", { sensitivity: "base" })
        if (byCity !== 0) return byCity
        return a.name.localeCompare(b.name, "en", { sensitivity: "base" })
      })
    } else if (effectiveSort === "newest") {
      list.sort((a, b) => {
        const da = a.lastAuditDate ?? ""
        const db = b.lastAuditDate ?? ""
        return db.localeCompare(da)
      })
    }
    return list
  }, [distanceKm, filtered, sortBy, userPosition])

  const sortOptions = useMemo(() => {
    if (userPosition) {
      return [
        ...BASE_SORT_OPTIONS,
        { value: "distance" as const, label: "Nearest" },
      ]
    }
    return [...BASE_SORT_OPTIONS]
  }, [userPosition])

  const requestNearMe = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Location is not available in this browser.")
      return
    }
    setLocating(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setNearMeActive(true)
        setSortBy("distance")
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        setGeoError(err.message || "Could not read your location.")
      },
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 60_000 }
    )
  }

  const clearNearMe = () => {
    setNearMeActive(false)
    setUserPosition(null)
    setGeoError(null)
    setSortBy((prev) => (prev === "distance" ? "status" : prev))
  }

  const handleRefine = () => {
    setQuery("")
    setAreaSlug("")
    setCuisine("")
    setCategory("All")
    onOpenNowOnlyChange?.(false)
    clearNearMe()
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="grid gap-4">
      {/* Quick-Action Bar: sticky, backdrop-blur */}
      <div
        className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md sm:mx-0"
        role="toolbar"
        aria-label="Browse options"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
          <OpenNowToggle
            checked={isOpenNowOnly}
            onChange={(v) => onOpenNowOnlyChange?.(v)}
            variant="inline"
          />
          <div className="flex flex-wrap items-center gap-2">
            {nearMeActive && userPosition ? (
              <button
                type="button"
                onClick={clearNearMe}
                className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-transform active:scale-95 touch-manipulation hover:bg-slate-50"
              >
                Clear location
              </button>
            ) : (
              <button
                type="button"
                onClick={requestNearMe}
                disabled={locating}
                className="inline-flex min-h-12 min-w-[48px] items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-amber-700 active:scale-95 touch-manipulation disabled:cursor-not-allowed disabled:opacity-70"
              >
                {locating ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
                ) : (
                  <Locate className="h-5 w-5 shrink-0" aria-hidden />
                )}
                {locating ? "Locating…" : "Near me"}
              </button>
            )}
          </div>
          {geoError ? (
            <span className="max-w-[14rem] text-xs text-red-600" role="status">
              {geoError}
            </span>
          ) : null}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm font-medium text-slate-600">
              Sort by
            </label>
            <span className="relative inline-block">
              <select
                id="sort-by"
                value={sortOptions.some((o) => o.value === sortBy) ? sortBy : "status"}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="min-w-[8rem] appearance-none rounded-md border-0 bg-transparent py-1.5 pr-6 pl-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
                aria-label="Sort listings"
              >
                {sortOptions.map((opt) => (
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
            {nearMeActive && userPosition ? (
              <span className="text-slate-400">
                {" "}
                · nearest first; listings without coordinates appear last
              </span>
            ) : null}
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
              <Badge>{typeFilterBadgeLabel(category)}</Badge>
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
              No matches are open right now with your current filters. Turn off{" "}
              <strong>Open now</strong>, clear search, or use{" "}
              <strong className="text-slate-800">See all listings</strong> below to browse the full
              directory—hours are Texas time.
            </p>
          ) : (
            <p className="text-slate-600">
              Nothing matches region, cuisine, type, or search. Widen filters or reset to browse all{" "}
              {restaurants.length} listings.
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
              <RestaurantCard
                restaurant={r}
                distanceLabel={
                  nearMeActive &&
                  userPosition &&
                  r.latitude != null &&
                  r.longitude != null
                    ? `${formatDistanceMiles(
                        haversineKm(
                          userPosition.lat,
                          userPosition.lng,
                          r.latitude,
                          r.longitude
                        )
                      )} away`
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

