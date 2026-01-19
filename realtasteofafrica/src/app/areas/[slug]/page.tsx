import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/Badge"
import { WpPageShell } from "@/components/WpPageShell"
import { getAreaBySlug } from "@/lib/areas"
import { getRestaurantsByArea } from "@/lib/restaurants"

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits.startsWith("+") ? digits : `+${digits}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const area = getAreaBySlug(slug)
  if (!area) return { title: "Area" }
  return { title: `${area.name} area` }
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const area = getAreaBySlug(slug)
  if (!area) notFound()

  const restaurants = getRestaurantsByArea(area.slug)

  return (
    <WpPageShell
      title={`${area.name} area`}
      description={area.description}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/restaurants", label: "Restaurants" },
        { href: `/areas/${area.slug}`, label: area.name },
      ]}
    >
      <section className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Area</Badge>
            <Badge>{area.regionLabel}</Badge>
          </div>
          <Badge>{restaurants.length} listings</Badge>
        </div>

        {restaurants.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold tracking-tight">
              No listings yet
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Submit a restaurant and we’ll add it after review.
            </p>
            <Link
              className="mt-4 inline-flex rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              href="/submit"
            >
              Submit a restaurant →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-200">
              {restaurants.map((r) => (
                <li key={r.slug} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold tracking-tight text-slate-900">
                        <Link
                          className="hover:text-amber-800"
                          href={`/restaurants/${r.slug}`}
                        >
                          {r.name}
                        </Link>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {r.city}, {r.state} • {r.cuisines.join(" • ")}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {r.addressLine}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {r.priceLevel ? (
                        <Badge>{"$".repeat(r.priceLevel)}</Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {r.highlights.slice(0, 3).map((h) => (
                      <Badge key={h}>{h}</Badge>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      className="inline-flex rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                      href={`/restaurants/${r.slug}`}
                    >
                      View details →
                    </Link>
                    {r.websiteUrl ? (
                      <a
                        className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                        href={r.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Website
                      </a>
                    ) : null}
                    {r.phone ? (
                      <a
                        className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                        href={`tel:${toTelHref(r.phone)}`}
                      >
                        Call
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </WpPageShell>
  )
}

