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
    </aside>
  )
}

