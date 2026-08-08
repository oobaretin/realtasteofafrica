"use client"

import { BrowseFilterFields } from "@/components/BrowseFilterFields"
import type { Area } from "@/lib/areas"

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

/** Desktop inline filters (mobile uses FilterSheet). */
export function FilterBar({
  areas,
  cuisineTags,
  values,
  onFilterChange,
  sortBy,
  sortOptions,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:block sm:p-5">
      <BrowseFilterFields
        idPrefix="desktop-"
        areas={areas}
        cuisineTags={cuisineTags}
        values={values}
        sortBy={sortBy}
        sortOptions={sortOptions}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
      />
    </div>
  )
}
