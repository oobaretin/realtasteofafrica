import Link from "next/link"

import type { CollectionBrowseLinks } from "@/lib/collectionBrowseLinks"

export function CollectionBrowseMore({ links }: { links: CollectionBrowseLinks }) {
  const items: { href: string; label: string }[] = []

  if (links.city && links.citySlug) {
    items.push({
      href: `/cities/${links.citySlug}`,
      label: `More in ${links.city}`,
    })
  }
  if (links.cuisine) {
    items.push({
      href: `/restaurants?cuisine=${encodeURIComponent(links.cuisine)}`,
      label: `More ${links.cuisine} in Texas`,
    })
  }
  if (links.areaSlug) {
    items.push({
      href: `/restaurants?area=${links.areaSlug}`,
      label: "Browse this region",
    })
  }

  if (items.length === 0) return null

  return (
    <section
      className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 sm:p-6"
      aria-label="Keep exploring"
    >
      <h2 className="font-display text-lg font-semibold text-slate-900">Keep exploring</h2>
      <p className="mt-1 text-sm text-slate-600">
        Jump from this guide into the full directory.
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex min-h-10 items-center rounded-full border border-amber-300/60 bg-white px-4 text-sm font-semibold text-amber-900 hover:border-amber-400 hover:bg-amber-50"
            >
              {label} →
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/restaurants"
            className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Full directory →
          </Link>
        </li>
      </ul>
    </section>
  )
}
