"use client"

import type { Area } from "@/lib/areas"
import { FILTER_TYPE_OPTIONS } from "@/lib/establishmentType"

export type FilterBarValues = {
  category: string
  region: string
  cuisine: string
}

type FilterBarProps = {
  areas: Area[]
  cuisineTags: string[]
  values: FilterBarValues
  onFilterChange: (key: keyof FilterBarValues, value: string) => void
}

export function FilterBar({ areas, cuisineTags, values, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 p-6 bg-white shadow-sm rounded-xl border border-slate-200">
      <div className="flex min-w-0 flex-1 flex-col sm:min-w-[140px]">
        <label className="text-sm font-bold mb-1 text-slate-900" htmlFor="filter-type">
          Type
        </label>
        <select
          id="filter-type"
          value={values.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          aria-label="Filter by establishment type"
        >
          {FILTER_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-0 flex-1 flex-col sm:min-w-[140px]">
        <label className="text-sm font-bold mb-1 text-slate-900" htmlFor="filter-region">
          Region
        </label>
        <select
          id="filter-region"
          value={values.region}
          onChange={(e) => onFilterChange("region", e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          aria-label="Filter by Texas region"
        >
          <option value="">All</option>
          {areas.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-0 flex-1 flex-col sm:min-w-[140px]">
        <label className="text-sm font-bold mb-1 text-slate-900" htmlFor="filter-cuisine">
          Cuisine
        </label>
        <select
          id="filter-cuisine"
          value={values.cuisine}
          onChange={(e) => onFilterChange("cuisine", e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
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
    </div>
  )
}
