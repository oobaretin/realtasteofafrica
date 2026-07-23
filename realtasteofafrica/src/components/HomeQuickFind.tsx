"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

const QUICK_LINKS = [
  { label: "Nigerian", href: "/restaurants?cuisine=Nigerian" },
  { label: "Ethiopian", href: "/restaurants?cuisine=Ethiopian" },
  { label: "Houston", href: "/restaurants?area=houston" },
] as const

export function HomeQuickFind({ listingCount }: { listingCount: number }) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/restaurants?q=${encodeURIComponent(q)}` : "/restaurants")
  }

  return (
    <section
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      aria-labelledby="quick-find-heading"
    >
      <h2 id="quick-find-heading" className="text-lg font-semibold tracking-tight text-slate-900">
        Quick find
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Search {listingCount}+ listings by name, city, or cuisine.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="home-quick-find">
          Search restaurants
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
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">Popular:</span>
        {QUICK_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:border-amber-200 hover:bg-amber-50"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  )
}
