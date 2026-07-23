import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs"

export function PageHeader({
  title,
  description,
  breadcrumbs,
}: {
  title?: string
  description?: string
  breadcrumbs?: Crumb[]
}) {
  return (
    <>
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {title ? (
        <header className="grid gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm text-slate-600">{description}</p>
          ) : null}
        </header>
      ) : null}
    </>
  )
}
