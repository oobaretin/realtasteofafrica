import Link from "next/link"
import { MapPin } from "lucide-react"

export function EmptyListingsState({
  title = "No listings yet",
  description = "Submit a restaurant and we'll add it after review.",
  actionHref = "/submit",
  actionLabel = "Submit a restaurant →",
}: {
  title?: string
  description?: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <MapPin className="h-6 w-6" aria-hidden />
      </div>
      <div className="mt-4 text-base font-semibold tracking-tight text-slate-900">
        {title}
      </div>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p>
      <Link
        className="mt-5 inline-flex rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
        href={actionHref}
      >
        {actionLabel}
      </Link>
    </div>
  )
}
