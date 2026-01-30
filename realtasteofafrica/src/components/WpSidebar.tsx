import Link from "next/link"

import { Widget } from "@/components/Widget"
import { getAreaBySlug } from "@/lib/areas"

type RegionItem = { slug: string; displayName?: string }

const REGION_GROUPS: { title: string; items: RegionItem[] }[] = [
  { title: "Greater Houston Area", items: [{ slug: "houston" }, { slug: "katy" }, { slug: "sugar-land" }] },
  {
    title: "DFW Metroplex",
    items: [{ slug: "dfw", displayName: "Dallas, Fort Worth, Arlington" }],
  },
  {
    title: "Central Texas",
    items: [{ slug: "austin" }, { slug: "central-texas", displayName: "Round Rock, Pflugerville" }],
  },
  {
    title: "Other Regions",
    items: [
      { slug: "san-antonio" },
      { slug: "el-paso" },
      { slug: "west-texas", displayName: "West Texas (Amarillo)" },
      { slug: "south-texas" },
    ],
  },
]

export function WpSidebar() {
  return (
    <aside className="grid gap-4">
      <Widget title="Texas Regions">
        <ul className="grid gap-4">
          {REGION_GROUPS.map((group) => (
            <li key={group.title}>
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                {group.title}
              </span>
              <ul className="mt-1.5 grid gap-1.5 pl-4">
                {group.items.map((item) => {
                  const area = getAreaBySlug(item.slug)
                  if (!area) return null
                  const label = item.displayName ?? area.name
                  return (
                    <li key={area.slug}>
                      <Link
                        className="text-xs font-medium text-amber-700 hover:text-amber-800 sm:text-sm"
                        href={`/areas/${area.slug}`}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </Widget>
    </aside>
  )
}
