import { type ReactNode } from "react"

export function Card({
  title,
  description,
  right,
  children,
}: {
  title: string
  description?: string
  right?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  )
}

