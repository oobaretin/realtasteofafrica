import { type ReactNode } from "react"

export function Widget({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <div className="mt-3 text-sm text-slate-700">{children}</div>
    </section>
  )
}

