import type { Area } from "@/lib/areas"
import { FILTER_TYPE_OPTION_GROUPS } from "@/lib/establishmentType"
import type { FilterBarValues } from "@/components/FilterBar"

type SortOption = { value: string; label: string }

const selectClasses =
  "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"

export function BrowseFilterFields({
  areas,
  cuisineTags,
  values,
  sortBy,
  sortOptions,
  onFilterChange,
  onSortChange,
  idPrefix = "",
}: {
  areas: Area[]
  cuisineTags: string[]
  values: FilterBarValues
  sortBy: string
  sortOptions: readonly SortOption[]
  onFilterChange: (key: keyof FilterBarValues, value: string) => void
  onSortChange: (value: string) => void
  idPrefix?: string
}) {
  const p = idPrefix

  return (
    <div className="grid gap-4">
      <div className="min-w-0">
        <label
          className="mb-1 block text-sm font-semibold text-slate-900"
          htmlFor={`${p}filter-region`}
        >
          Region
        </label>
        <select
          id={`${p}filter-region`}
          value={values.region}
          onChange={(e) => onFilterChange("region", e.target.value)}
          className={selectClasses}
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
        <label
          className="mb-1 block text-sm font-semibold text-slate-900"
          htmlFor={`${p}filter-cuisine`}
        >
          Cuisine
        </label>
        <select
          id={`${p}filter-cuisine`}
          value={values.cuisine}
          onChange={(e) => onFilterChange("cuisine", e.target.value)}
          className={selectClasses}
        >
          <option value="">All cuisines</option>
          {cuisineTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-0">
        <label
          className="mb-1 block text-sm font-semibold text-slate-900"
          htmlFor={`${p}filter-type`}
        >
          Type
        </label>
        <select
          id={`${p}filter-type`}
          value={values.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className={selectClasses}
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
        <label
          className="mb-1 block text-sm font-semibold text-slate-900"
          htmlFor={`${p}filter-sort`}
        >
          Sort by
        </label>
        <select
          id={`${p}filter-sort`}
          value={sortOptions.some((o) => o.value === sortBy) ? sortBy : "status"}
          onChange={(e) => onSortChange(e.target.value)}
          className={selectClasses}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
