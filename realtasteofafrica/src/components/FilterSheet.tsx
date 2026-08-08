"use client"

import { BrowseFilterFields } from "@/components/BrowseFilterFields"
import type { FilterBarValues } from "@/components/FilterBar"
import type { Area } from "@/lib/areas"

type SortOption = { value: string; label: string }

export function FilterSheet({
  open,
  onClose,
  areas,
  cuisineTags,
  values,
  sortBy,
  sortOptions,
  onFilterChange,
  onSortChange,
  onApply,
}: {
  open: boolean
  onClose: () => void
  areas: Area[]
  cuisineTags: string[]
  values: FilterBarValues
  sortBy: string
  sortOptions: readonly SortOption[]
  onFilterChange: (key: keyof FilterBarValues, value: string) => void
  onSortChange: (value: string) => void
  onApply: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-slate-200 bg-white px-4 pb-6 pt-4 shadow-xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" aria-hidden />
        <div className="flex items-center justify-between gap-3">
          <h2 id="filter-sheet-title" className="text-lg font-semibold text-slate-900">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="mt-4">
          <BrowseFilterFields
            idPrefix="sheet-"
            areas={areas}
            cuisineTags={cuisineTags}
            values={values}
            sortBy={sortBy}
            sortOptions={sortOptions}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            onApply()
            onClose()
          }}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-600 text-sm font-semibold text-white hover:bg-amber-700"
        >
          Show results
        </button>
      </div>
    </div>
  )
}
