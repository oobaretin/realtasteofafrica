"use client"

import type { Area } from "@/lib/areas"
import { ESTABLISHMENT_CATEGORIES } from "@/lib/establishmentType"

export type FilterBarValues = {
  category: string
  region: string
}

type FilterBarProps = {
  areas: Area[]
  values: FilterBarValues
  onFilterChange: (key: keyof FilterBarValues, value: string) => void
}

export function FilterBar({ areas, values, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 p-6 bg-white shadow-sm rounded-xl border border-slate-200">
      <div className="flex flex-col min-w-[180px]">
        <label className="text-sm font-bold mb-1 text-slate-900">
          Establishment Type
        </label>
        <select
          value={values.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
        >
          {ESTABLISHMENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col min-w-[180px]">
        <label className="text-sm font-bold mb-1 text-slate-900">
          Texas Region
        </label>
        <select
          value={values.region}
          onChange={(e) => onFilterChange("region", e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
        >
          <option value="">All</option>
          {areas.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
