import Link from "next/link"

import { GuideCard } from "@/components/GuideCard"
import { EDITORIAL_COLLECTIONS } from "@/data/collections"

export function HomeGuides() {
  const guides = EDITORIAL_COLLECTIONS

  return (
    <section className="min-w-0 grid gap-4" aria-labelledby="home-guides-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2
            id="home-guides-heading"
            className="font-display text-lg font-semibold tracking-tight sm:text-xl md:text-2xl"
          >
            Guides for specific cravings
          </h2>
          <p className="mt-1 text-sm text-slate-600 md:text-base">
            Opinionated shortlists — jollof runs, market days, and neighborhood gems.
          </p>
        </div>
        <Link
          className="text-sm font-medium text-amber-700 hover:text-amber-800"
          href="/collections"
        >
          All guides →
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 sm:gap-6">
        {guides.map((c) => (
          <li key={c.slug}>
            <GuideCard collection={c} />
          </li>
        ))}
      </ul>
    </section>
  )
}
