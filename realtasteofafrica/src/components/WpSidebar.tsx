import Link from "next/link"

import { Widget } from "@/components/Widget"
import { AREAS } from "@/lib/areas"

export function WpSidebar() {
  return (
    <aside className="grid gap-4">
      <Widget title="Areas (Houston-first)">
        <ul className="grid gap-2">
          {AREAS.map((a) => (
            <li key={a.slug}>
              <Link
                className="font-medium text-amber-700 hover:text-amber-800"
                href={`/areas/${a.slug}`}
              >
                {a.name}
              </Link>
              <div className="text-xs text-slate-500">{a.regionLabel}</div>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Submit a restaurant">
        <p className="text-sm text-slate-700">
          Know a great African restaurant we should list?
        </p>
        <Link
          className="mt-3 inline-flex rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          href="/submit"
        >
          Submit →
        </Link>
      </Widget>
    </aside>
  )
}

