"use client"

import { useEffect, useId, useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import type { Area } from "@/lib/areas"
import { FILTER_TYPE_OPTION_GROUPS } from "@/lib/establishmentType"

export type FilterBarValues = {
  category: string
  region: string
  cuisine: string
}

type SortOption = {
  value: string
  label: string
}

type FilterBarProps = {
  areas: Area[]
  cuisineTags: string[]
  values: FilterBarValues
  onFilterChange: (key: keyof FilterBarValues, value: string) => void
  sortBy: string
  sortOptions: readonly SortOption[]
  onSortChange: (value: string) => void
}

const selectClasses =
  "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"

export function FilterBar({
  areas,
  cuisineTags,
  values,
  onFilterChange,
  sortBy,
  sortOptions,
  onSortChange,
}: FilterBarProps) {
  const panelId = useId()
  const [moreOpen, setMoreOpen] = useState(false)

  const hasSecondaryFilters =
    (values.category && values.category !== "All") || sortBy !== "status"

  useEffect(() => {
    if (hasSecondaryFilters) setMoreOpen(true)
  }, [hasSecondaryFilters])

  const secondaryCount =
    (values.category && values.category !== "All" ? 1 : 0) +
    (sortBy !== "status" ? 1 : 0)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="min-w-0">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="filter-region">
            Region
          </label>
          <select
            id="filter-region"
            value={values.region}
            onChange={(e) => onFilterChange("region", e.target.value)}
            className={selectClasses}
            aria-label="Filter by Texas region"
          >
            <option value="">All Texas</option>
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="filter-cuisine">
            Cuisine
          </label>
          <select
            id="filter-cuisine"
            value={values.cuisine}
            onChange={(e) => onFilterChange("cuisine", e.target.value)}
            className={selectClasses}
            aria-label="Filter by cuisine"
          >
            <option value="">All cuisines</option>
            {cuisineTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          aria-expanded={moreOpen}
          aria-controls={panelId}
          onClick={() => setMoreOpen((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
          More filters
          {secondaryCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1.5 text-xs font-bold text-white">
              {secondaryCount}
            </span>
          ) : null}
        </button>
      </div>

      {moreOpen ? (
        <div
          id={panelId}
          className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2"
        >
          <div className="min-w-0">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="filter-type">
              Type
            </label>
            <select
              id="filter-type"
              value={values.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              className={selectClasses}
              aria-label="Filter by establishment type"
            >
              {FILTER_TYPE_OPTION_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="filter-sort">
              Sort by
            </label>
            <select
              id="filter-sort"
              value={sortOptions.some((o) => o.value === sortBy) ? sortBy : "status"}
              onChange={(e) => onSortChange(e.target.value)}
              className={selectClasses}
              aria-label="Sort listings"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  )
}
