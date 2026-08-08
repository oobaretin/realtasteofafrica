"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Locate, Loader2, SlidersHorizontal } from "lucide-react"

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

const PAGE_SIZE = 24

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
  initialQuery = "",
  initialOpenNow = false,
}: {
  restaurants: Restaurant[]
  areas: Area[]
  cuisineTags: string[]
  initialCuisine?: string
  initialArea?: string
  initialCategory?: string
  initialQuery?: string
  initialOpenNow?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery)
  const [areaSlug, setAreaSlug] = useState<string>(initialArea)
  const [cuisine, setCuisine] = useState<string>(initialCuisine)
  const [category, setCategory] = useState<string>(initialCategory)
  const [sortBy, setSortBy] = useState<SortBy>("status")
  const [isOpenNowOnly, setIsOpenNowOnly] = useState(initialOpenNow)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [nearMeActive, setNearMeActive] = useState(false)
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL-driven browse state
    setAreaSlug(initialArea)
    setCuisine(initialCuisine)
    setCategory(initialCategory)
    setQuery(initialQuery)
    setIsOpenNowOnly(initialOpenNow)
    setVisibleCount(PAGE_SIZE)
  }, [initialArea, initialCuisine, initialCategory, initialQuery, initialOpenNow])

  const filterBarValues = useMemo(
    () => ({ category, region: areaSlug, cuisine }),
    [category, areaSlug, cuisine]
  )

  const activeFilterCount =
    (areaSlug ? 1 : 0) +
    (cuisine ? 1 : 0) +
    (category !== "All" ? 1 : 0) +
    (sortBy !== "status" ? 1 : 0)

  const updateUrl = useCallback(
    (updates: {
      area?: string
      cuisine?: string
      type?: string
      q?: string
      openNow?: boolean
    }) => {
      const params = new URLSearchParams()
      const nextArea = updates.area ?? areaSlug
      const nextCuisine = updates.cuisine ?? cuisine
      const nextType = updates.type ?? category
      const nextQ = updates.q !== undefined ? updates.q : query
      const nextOpenNow = updates.openNow ?? isOpenNowOnly
      if (nextArea) params.set("area", nextArea)
      if (nextCuisine) params.set("cuisine", nextCuisine)
      if (nextType && nextType !== "All") params.set("type", nextType)
      if (nextQ.trim()) params.set("q", nextQ.trim())
      if (nextOpenNow) params.set("openNow", "1")
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [areaSlug, category, cuisine, isOpenNowOnly, pathname, query, router]
  )

  const handleFilterChange = (key: "category" | "region" | "cuisine", value: string) => {
    setVisibleCount(PAGE_SIZE)
    if (key === "category") {
      setCategory(value)
      updateUrl({ type: value })
    } else if (key === "region") {
      setAreaSlug(value)
      updateUrl({ area: value })
    } else {
      setCuisine(value)
      updateUrl({ cuisine: value })
    }
  }

  const handleOpenNowChange = (value: boolean) => {
    setIsOpenNowOnly(value)
    setVisibleCount(PAGE_SIZE)
    updateUrl({ openNow: value })
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
  }, [areaSlug, category, cuisine, isOpenNowOnly, query, restaurants])

  const distanceKm = useCallback(
    (r: Restaurant) => {
      if (!userPosition || r.latitude == null || r.longitude == null) {
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

  const visible = sorted.slice(0, visibleCount)
  const hasMore = visibleCount < sorted.length

  const sortOptions = useMemo(() => {
    if (userPosition) {
      return [...BASE_SORT_OPTIONS, { value: "distance" as const, label: "Nearest" }]
    }
    return [...BASE_SORT_OPTIONS]
  }, [userPosition])

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (query !== initialQuery) {
        updateUrl({ q: query })
      }
    }, 300)
    return () => window.clearTimeout(t)
  }, [query, initialQuery, updateUrl])

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
        setVisibleCount(PAGE_SIZE)
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
    setIsOpenNowOnly(false)
    setVisibleCount(PAGE_SIZE)
    clearNearMe()
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="grid gap-3">
      <div
        className="sticky top-[4.5rem] z-20 -mx-4 space-y-3 rounded-none border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md sm:top-20 sm:mx-0 sm:rounded-xl sm:border sm:shadow-sm md:top-24"
        role="search"
        aria-label="Search and filter listings"
      >
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="browse-search">
            Search listings
          </label>
          <input
            id="browse-search"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400"
            placeholder="Search name, city, cuisine…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
          />
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <OpenNowToggle
            checked={isOpenNowOnly}
            onChange={handleOpenNowChange}
            variant="inline"
          />
          {nearMeActive && userPosition ? (
            <button
              type="button"
              onClick={clearNearMe}
              className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
            >
              Clear location
            </button>
          ) : (
            <button
              type="button"
              onClick={requestNearMe}
              disabled={locating}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-70 sm:text-sm"
            >
              {locating ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Locate className="h-4 w-4" aria-hidden />
              )}
              Near me
            </button>
          )}
          <span className="text-xs text-slate-500 sm:text-sm">
            {sorted.length} spot{sorted.length !== 1 ? "s" : ""}
          </span>
          {(category !== "All" || areaSlug || cuisine || query.trim() || isOpenNowOnly) && (
            <button
              type="button"
              onClick={handleRefine}
              className="ml-auto text-xs font-medium text-amber-700 hover:text-amber-800 sm:text-sm"
            >
              Reset
            </button>
          )}
        </div>

        {geoError ? (
          <p className="text-xs text-red-600" role="status">
            {geoError}
          </p>
        ) : null}

        <p className="text-xs text-slate-500">
          <Link href="/trust" className="text-amber-700 underline hover:text-amber-800">
            How we verify listings
          </Link>
        </p>
      </div>

      {filtersOpen ? (
        <FilterBar
          areas={areas}
          cuisineTags={cuisineTags}
          values={filterBarValues}
          onFilterChange={handleFilterChange}
          sortBy={sortOptions.some((o) => o.value === sortBy) ? sortBy : "status"}
          sortOptions={sortOptions}
          onSortChange={(value) => {
            setSortBy(value as SortBy)
            setVisibleCount(PAGE_SIZE)
          }}
        />
      ) : null}

      {(category !== "All" || areaSlug || cuisine || query.trim()) && (
        <div className="flex flex-wrap items-center gap-2">
          {category && category !== "All" ? (
            <Badge>{typeFilterBadgeLabel(category)}</Badge>
          ) : null}
          {areaSlug ? <Badge>{areaBySlug.get(areaSlug)?.name ?? areaSlug}</Badge> : null}
          {cuisine ? <Badge>{cuisine}</Badge> : null}
          {query.trim() ? <Badge>“{query.trim()}”</Badge> : null}
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {isOpenNowOnly ? (
            <p className="text-slate-600">
              No matches are open right now. Turn off <strong>Open now</strong> or reset filters.
            </p>
          ) : (
            <p className="text-slate-600">
              Nothing matches your filters. Reset to browse all {restaurants.length} listings.
            </p>
          )}
          <button
            type="button"
            onClick={handleRefine}
            className="mt-6 inline-flex rounded-xl bg-amber-600 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-700"
          >
            See all {restaurants.length} listings
          </button>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-2 sm:gap-3" aria-label="Restaurant listings">
            {visible.map((r) => (
              <li key={r.slug}>
                <RestaurantCard
                  restaurant={r}
                  variant="row"
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
          {hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Show {Math.min(PAGE_SIZE, sorted.length - visibleCount)} more (
                {sorted.length - visibleCount} left)
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
