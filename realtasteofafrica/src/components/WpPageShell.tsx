import { type ReactNode } from "react"

import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs"
import { WpSidebar } from "@/components/WpSidebar"

export function WpPageShell({
  title,
  description,
  breadcrumbs,
  children,
}: {
  title?: string
  description?: string
  breadcrumbs?: Crumb[]
  children: ReactNode
}) {
  return (
    <div className="grid gap-6">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}

      {title ? (
        <header className="grid gap-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm text-slate-400">{description}</p>
          ) : null}
        </header>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="min-w-0">{children}</div>
        <div className="lg:sticky lg:top-24">
          <WpSidebar />
        </div>
      </div>
    </div>
  )
}

