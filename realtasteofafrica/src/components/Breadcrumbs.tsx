import Link from "next/link"

export type Crumb = { href: string; label: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${c.href}-${idx}`} className="flex items-center gap-x-2">
              {idx > 0 ? <span className="text-slate-300">/</span> : null}
              {isLast ? (
                <span className="font-medium text-slate-700">{c.label}</span>
              ) : (
                <Link className="hover:text-amber-700" href={c.href}>
                  {c.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
