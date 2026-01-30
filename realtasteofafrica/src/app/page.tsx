import Link from "next/link"

import { Badge } from "@/components/Badge"
import { StatewideDiscovery } from "@/components/StatewideDiscovery"
import { RestaurantCard } from "@/components/RestaurantCard"
import { AREAS } from "@/lib/areas"
import { CUISINE_TAGS } from "@/lib/cuisines"
import { getFeaturedRestaurants, RESTAURANTS } from "@/lib/restaurants"

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

const FEATURED_ORDER = [
  "chopnblok-montrose-houston-tx",
  "red-sea-kitchen-ethiopian-food-truck-austin-tx",
  "wazobia-african-market-and-kitchen-houston-tx",
  "aria-suya-kitchen-houston-tx",
]

export default function HomePage() {
  const featured = getFeaturedRestaurants().sort(
    (a, b) => FEATURED_ORDER.indexOf(a.slug) - FEATURED_ORDER.indexOf(b.slug)
  )
  const featuredThree = featured.slice(0, 3)

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
            <Badge>175+ listings</Badge>
            <Badge>Texas-wide</Badge>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Real Taste of Africa
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
            The Definitive Guide to 175+ African Restaurants, Food Trucks, and
            Markets Across Texas.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
            Statewide coverage from El Paso to Beaumont — find African food
            across the state.
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
              href="/restaurants"
            >
              All regions
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              The Best of the Lone Star State
            </h2>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              From the 180+ spots we track, here are our current favorites for
              authentic flavor, community vibe, and incredible spice.
            </p>
          </div>
          <Link
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
            href="/restaurants"
          >
            See all →
          </Link>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredThree.map((r) => (
            <li key={r.slug}>
              <RestaurantCard restaurant={r} variant="featured" />
            </li>
          ))}
        </ul>
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
              Statewide coverage from El Paso to Beaumont.
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

      <section className="grid gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Explore by cuisine
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Nigerian, Ethiopian, Ghanaian, Senegalese, Somali, Eritrean, and more across Texas.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CUISINE_TAGS.map(({ tag, exampleNames }) => (
              <li key={tag}>
                <Link
                  className="block rounded-lg border border-slate-100 p-4 transition-colors hover:border-amber-200 hover:bg-amber-50/50"
                  href={`/restaurants?cuisine=${encodeURIComponent(tag)}`}
                >
                  <span className="font-semibold text-slate-900">{tag}</span>
                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-500">
                    e.g. {exampleNames.slice(0, 3).join(", ")}
                    {exampleNames.length > 3 ? "…" : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StatewideDiscovery restaurants={RESTAURANTS} />
    </div>
  )
}

