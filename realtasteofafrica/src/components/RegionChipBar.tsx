import Link from "next/link"

import type { Area } from "@/lib/areas"

/** Horizontal region shortcuts for mobile browse — desktop uses WpSidebar. */
export function RegionChipBar({
  areas,
  activeSlug = "",
}: {
  areas: Area[]
  activeSlug?: string
}) {
  return (
    <div className="lg:hidden">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Texas regions
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 touch-pan-x">
        <Link
          href="/restaurants"
          className={[
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
            !activeSlug
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
          ].join(" ")}
        >
          All Texas
        </Link>
        {areas.map((a) => (
          <Link
            key={a.slug}
            href={`/restaurants?area=${a.slug}`}
            className={[
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
              activeSlug === a.slug
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {a.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
