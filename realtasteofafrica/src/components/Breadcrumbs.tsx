import Link from "next/link"

export type Crumb = { href: string; label: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${c.href}-${idx}`} className="flex items-center gap-x-2">
              {idx > 0 ? <span className="text-slate-600">/</span> : null}
              {isLast ? (
                <span className="text-slate-200">{c.label}</span>
              ) : (
                <Link className="hover:text-slate-200" href={c.href}>
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

