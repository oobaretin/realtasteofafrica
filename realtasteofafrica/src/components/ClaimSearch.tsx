"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { RESTAURANTS } from "@/lib/restaurants"
import type { Restaurant } from "@/lib/restaurants"

function normalizeQuery(q: string) {
  return q
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
}

function matchesRestaurant(r: Restaurant, query: string) {
  if (!query) return false
  const n = normalizeQuery(query)
  const name = normalizeQuery(r.name)
  const city = normalizeQuery(r.city)
  if (name.includes(n) || n.includes(name)) return true
  if (city.includes(n) || n.includes(city)) return true
  return false
}

export function ClaimSearch({
  onSelect,
  inputId,
}: {
  onSelect: (restaurant: Restaurant) => void
  inputId?: string
}) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = normalizeQuery(query)
    if (!q || q.length < 2) return []
    return RESTAURANTS.filter((r) => matchesRestaurant(r, query)).slice(0, 15)
  }, [query])

  return (
    <div className="grid gap-4">
      <label className="grid gap-1.5" htmlFor={inputId ?? "claim-search-input"}>
        <span className="text-sm font-medium text-slate-900">
          Search for your restaurant
        </span>
        <input
          id={inputId ?? "claim-search-input"}
          type="search"
          autoComplete="off"
          placeholder="Type restaurant name or city..."
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {query.trim().length >= 2 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {results.length === 0 ? (
            <div className="p-5 text-center text-sm text-slate-500">
              No matches.{" "}
              <Link className="font-medium text-amber-700 hover:text-amber-800" href="/submit">
                Submit your restaurant
              </Link>{" "}
              first, then come back to claim it.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {results.map((r) => (
                <li key={r.slug} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <span className="font-medium text-slate-900">{r.name}</span>
                    <span className="ml-2 text-sm text-slate-500">
                      {r.city}, {r.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      className="text-sm font-medium text-amber-700 hover:text-amber-800"
                      href={`/restaurants/${r.slug}`}
                    >
                      View listing
                    </Link>
                    <button
                      type="button"
                      className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                      onClick={() => onSelect(r)}
                    >
                      This is me
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
