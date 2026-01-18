import Link from "next/link"

import { Badge } from "@/components/Badge"
import { AREAS } from "@/lib/areas"
import { RESTAURANTS } from "@/lib/restaurants"

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits.startsWith("+") ? digits : `+${digits}`
}

function scoreRestaurant(r: (typeof RESTAURANTS)[number]) {
  // Prefer listings with more actionable info (for homepage "popular picks")
  let score = 0
  if (r.mapsUrl) score += 2
  if (r.websiteUrl) score += 2
  if (r.phone) score += 1
  if (r.addressLine) score += 1
  if (r.highlights?.length) score += 1
  return score
}

export default function HomePage() {
  const top = [...RESTAURANTS]
    .sort((a, b) => scoreRestaurant(b) - scoreRestaurant(a))
    .slice(0, 3)

  return (
    <div className="grid gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8 text-white shadow-sm">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.25),transparent_40%),radial-gradient(circle_at_70%_30%,rgba(249,115,22,0.18),transparent_45%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Directory</Badge>
            <Badge>Houston + neighboring cities</Badge>
            <Badge>Nationwide roadmap</Badge>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Real Taste of Africa
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
            Find African restaurants near you. We’re starting with Greater
            Houston and nearby cities, then expanding nationwide.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
              href="/restaurants"
            >
              Browse restaurants
            </Link>
            <Link
              className="rounded-md border border-white/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              href="/areas/houston"
            >
              Houston area
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Popular picks
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Curated listings with the most complete details (phone, website, map).
            </p>
          </div>
          <Link
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
            href="/restaurants"
          >
            See all →
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-200">
            {top.map((r) => (
              <li key={r.slug} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold tracking-tight">
                      {r.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {r.city}, {r.state} • {r.cuisines.slice(0, 3).join(" • ")}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {r.addressLine}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{r.areaSlug}</Badge>
                    {r.priceLevel ? <Badge>{"$".repeat(r.priceLevel)}</Badge> : null}
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
                  {r.mapsUrl ? (
                    <a
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      href={r.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Map
                    </a>
                  ) : null}
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
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Browse by area
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Start with Houston and nearby cities — then expand across Texas.
            </p>
          </div>
          <Link
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
            href="/restaurants"
          >
            Browse all →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <Link
                key={a.slug}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                href={`/areas/${a.slug}`}
              >
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

