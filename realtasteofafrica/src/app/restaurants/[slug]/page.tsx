import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/Badge"
import { WpPageShell } from "@/components/WpPageShell"
import { getAreaBySlug } from "@/lib/areas"
import { getRestaurantBySlug } from "@/lib/restaurants"
import { getRestaurantWriteUp } from "@/lib/restaurantWriteUp"

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits.startsWith("+") ? digits : `+${digits}`
}

function isFoodTruckListing(highlights: string[]) {
  return highlights.some((h) => /\b(food\s*truck|pop-?up)\b/i.test(h))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const r = getRestaurantBySlug(slug)
  if (!r) return { title: "Restaurant" }
  return { title: r.name }
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const r = getRestaurantBySlug(slug)
  if (!r) notFound()

  const area = getAreaBySlug(r.areaSlug)
  const writeUp = getRestaurantWriteUp(r)
  const isFoodTruck = isFoodTruckListing(r.highlights)

  return (
    <WpPageShell
      title={r.name}
      description={r.cuisines.join(" • ")}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/restaurants", label: "Restaurants" },
        { href: `/restaurants/${r.slug}`, label: r.name },
      ]}
    >
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Restaurant</Badge>
          <Badge>
            {r.city}, {r.state}
          </Badge>
          {area ? <Badge>{area.regionLabel}</Badge> : <Badge>{r.areaSlug}</Badge>}
          {r.priceLevel ? <Badge>{"$".repeat(r.priceLevel)}</Badge> : null}
          {isFoodTruck ? <Badge>Food truck / pop-up</Badge> : null}
        </div>

        {isFoodTruck ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="text-sm font-semibold text-amber-900">
              Food truck / pop-up
            </div>
            <div className="mt-2 text-sm text-amber-900/90">
              This listing operates as a <span className="font-medium">food truck</span>{" "}
              and/or <span className="font-medium">pop-up</span>. Hours and locations
              can change—check their latest updates before heading out.
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {r.mapsUrl ? (
            <a
              className="inline-flex rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
              href={r.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open map
            </a>
          ) : null}
          {r.websiteUrl ? (
            <a
              className="inline-flex rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              href={r.websiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Website
            </a>
          ) : null}
          {r.phone ? (
            <a
              className="inline-flex rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              href={`tel:${toTelHref(r.phone)}`}
            >
              Call
            </a>
          ) : null}
          <Link
            className="inline-flex rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            href={`/areas/${r.areaSlug}`}
          >
            View area
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Address</div>
          <div className="mt-1 text-sm text-slate-600">
            {r.addressLine} • {r.city}, {r.state}
          </div>

          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            {r.phone ? (
              <div>
                <span className="text-slate-500">Phone:</span>{" "}
                <a
                  className="font-medium text-amber-700 hover:text-amber-800"
                  href={`tel:${toTelHref(r.phone)}`}
                >
                  {r.phone}
                </a>
              </div>
            ) : null}
            {r.websiteUrl ? (
              <div>
                <span className="text-slate-500">Website:</span>{" "}
                <a
                  className="font-medium text-amber-700 hover:text-amber-800"
                  href={r.websiteUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Visit site
                </a>
              </div>
            ) : null}
            {r.mapsUrl ? (
              <div>
                <span className="text-slate-500">Map:</span>{" "}
                <a
                  className="font-medium text-amber-700 hover:text-amber-800"
                  href={r.mapsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open map
                </a>
              </div>
            ) : null}
          </div>

          <div className="mt-5">
            <Link
              className="inline-flex rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              href="/restaurants"
            >
              ← Back to browse
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            About this restaurant
          </div>
          <div className="mt-3 grid gap-3 text-sm text-slate-700">
            {writeUp.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Highlights</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {r.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </WpPageShell>
  )
}

