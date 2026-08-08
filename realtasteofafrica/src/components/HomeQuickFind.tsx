"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

import { SearchAutocomplete } from "@/components/SearchAutocomplete"
import { AREAS } from "@/lib/areas"
import { getAllCuisineTags, RESTAURANTS } from "@/lib/restaurants"

export function HomeQuickFind({
  listingCount,
  variant = "default",
}: {
  listingCount: number
  variant?: "default" | "hero"
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const isHero = variant === "hero"
  const cuisineTags = getAllCuisineTags()

  const submit = (q: string) => {
    const trimmed = q.trim()
    router.push(trimmed ? `/restaurants?q=${encodeURIComponent(trimmed)}` : "/restaurants")
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit(query)
  }

  const inputClass = isHero
    ? "min-h-12 w-full rounded-xl border border-white/20 bg-white/95 px-4 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm"
    : "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <SearchAutocomplete
        id="home-quick-find"
        value={query}
        onChange={setQuery}
        onSubmit={submit}
        placeholder="Name, city, cuisine…"
        inputClassName={inputClass}
        restaurants={RESTAURANTS}
        cuisineTags={cuisineTags}
        areas={AREAS}
        navigateOnSelect
      />
      <button
        type="submit"
        className="min-h-12 shrink-0 rounded-xl bg-amber-500 px-6 text-sm font-semibold text-white hover:bg-amber-600"
      >
        Search
      </button>
      <span className="sr-only">Search {listingCount}+ restaurant listings</span>
    </form>
  )
}
