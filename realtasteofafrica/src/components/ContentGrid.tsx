import type { ReactNode } from "react"

export function ContentGrid({
  children,
  sidebar,
  sidebarStickyTop = "top-24",
}: {
  children: ReactNode
  sidebar?: ReactNode
  /** Tailwind top offset for sticky sidebar (default clears header). */
  sidebarStickyTop?: string
}) {
  if (!sidebar) {
    return <div className="min-w-0">{children}</div>
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <div className="min-w-0">{children}</div>
      <div className={`lg:sticky ${sidebarStickyTop}`}>{sidebar}</div>
    </div>
  )
}
