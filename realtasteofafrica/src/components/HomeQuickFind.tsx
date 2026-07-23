"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export function HomeQuickFind({ listingCount }: { listingCount: number }) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/restaurants?q=${encodeURIComponent(q)}` : "/restaurants")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="home-quick-find">
        Search {listingCount}+ restaurant listings
      </label>
      <input
        id="home-quick-find"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Name, city, cuisine…"
        className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400"
      />
      <button
        type="submit"
        className="min-h-12 shrink-0 rounded-xl bg-amber-600 px-6 text-sm font-semibold text-white hover:bg-amber-700"
      >
        Search
      </button>
    </form>
  )
}
