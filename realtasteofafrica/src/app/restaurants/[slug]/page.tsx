import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/Badge"
import { VerifiedBadge } from "@/components/VerifiedBadge"
import { getAreaBySlug } from "@/lib/areas"
import {
  cityToSlug,
  getListingNumber,
  getRestaurantBySlug,
  getSimilarRestaurants,
  type Restaurant,
} from "@/lib/restaurants"
import { getRestaurantWriteUp } from "@/lib/restaurantWriteUp"
import { CopyAddressButtonClient } from "@/components/CopyAddressButton"
import { BusinessStatusClient } from "@/components/BusinessStatusClient"
import { ShareButton } from "@/components/ShareButton"
import { SimilarSpots } from "@/components/SimilarSpots"

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits.startsWith("+") ? digits : `+${digits}`
}

function googleMapsUrl(addressLine: string, city: string, state: string) {
  const query = encodeURIComponent(`${addressLine}, ${city}, ${state}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

function isFoodTruckListing(highlights: string[]) {
  return highlights.some((h) => /\b(food\s*truck|pop-?up)\b/i.test(h))
}

/** Show "Verified Active - Jan 2026" when listing was audited in 2026. */
function showVerifiedBadge(r: Restaurant) {
  return (
    (r.lastAuditDate && r.lastAuditDate.startsWith("2026")) ||
    r.internalVerified === true
  )
}

function similarSpotsTitle(r: Restaurant): string {
  const city = r.city
  const cuisine = r.cuisine || r.cuisines[0]
  if (city && cuisine)
    return `Similar spots in ${city} & more ${cuisine} in Texas`
  if (city) return `Similar spots in ${city}`
  if (cuisine) return `More ${cuisine} in Texas`
  return "More spots in Texas"
}

/** Logo used for og:image when restaurant has no featured image. Resolved via metadataBase. */
const DEFAULT_OG_IMAGE = "/realtasteofafrica.png"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const r = getRestaurantBySlug(slug)
  if (!r) return { title: "Restaurant" }

  const title = `${r.name} | ${r.city}, TX | The Real Taste of Africa`
  const description = `Discover and visit ${r.name} in ${r.city}. One of 175+ manually verified African culinary spots in Texas.`
  const ogImage = r.imageUrl ?? DEFAULT_OG_IMAGE

  return {
    title: `${r.name} | ${r.city}, TX`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: r.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
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
  const cuisineLabel = r.cuisine || r.cuisines[0] || "African"
  const similarRestaurants = getSimilarRestaurants(
    slug,
    r.city,
    r.cuisine || r.cuisines[0],
    4
  )
  const reportHref = `/contact?restaurant=${encodeURIComponent(r.name)}#report`
  const listingNumber = getListingNumber(slug)

  return (
    <article className="min-w-0 grid gap-0">
      {/* — Hero — */}
      <section className="relative -mx-4 h-56 overflow-hidden rounded-t-2xl bg-gradient-to-br from-amber-800 to-slate-800 sm:mx-0 sm:rounded-2xl md:h-72">
        {/* Placeholder: high-quality image could be r.imageUrl when added to data */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Verification badge: top right */}
        {showVerifiedBadge(r) ? (
          <div className="absolute right-4 top-4 rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-sm font-semibold text-slate-800 shadow-lg backdrop-blur-sm">
            ✅ Verified Active – Jan 2026
          </div>
        ) : null}
      </section>

      {/* — Title + Breadcrumb — */}
      <header className="mt-6 grid gap-2">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="hover:text-amber-700">
                Texas
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={`/cities/${cityToSlug(r.city)}`}
                className="hover:text-amber-700"
              >
                {r.city}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-slate-700">{cuisineLabel}</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {r.name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <BusinessStatusClient hours={r.hours} variant="badge" />
          {r.isVerified ? <VerifiedBadge /> : null}
        </div>
      </header>

      {/* — 2-column Action Grid — */}
      <section className="mt-8 grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Basics — Call, Directions, Website + Cuisine pills */}
        <div className="grid min-w-0 gap-6">
          <div className="min-w-0">
            <h2 className="sr-only">Quick actions</h2>
            <div className="flex min-w-0 flex-wrap gap-3">
              {r.phone ? (
                <a
                  href={`tel:${toTelHref(r.phone)}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <span aria-hidden>📞</span>
                  Call Now
                </a>
              ) : null}
              <a
                href={googleMapsUrl(r.addressLine, r.city, r.state)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <span aria-hidden>📍</span>
                Get Directions
              </a>
              <ShareButton
                title={r.name}
                url={`/restaurants/${r.slug}`}
                shareName={r.name}
              />
              {r.websiteUrl ? (
                <a
                  href={r.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-600 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-amber-700"
                >
                  <span aria-hidden>🔗</span>
                  Visit Website
                </a>
              ) : null}
            </div>
            {listingNumber > 0 ? (
              <p className="mt-3 text-xs text-slate-500">
                Verified Listing #{listingNumber} of 175. Help us grow the map by sharing this spot!
              </p>
            ) : null}
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Cuisine & options
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {r.cuisines.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900"
                >
                  {c}
                </span>
              ))}
              {r.highlights.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                >
                  {h}
                </span>
              ))}
              {r.priceLevel ? (
                <Badge>{"$".repeat(r.priceLevel)}</Badge>
              ) : null}
              {isFoodTruck ? (
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
                  Food truck / pop-up
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right: Hours + Location */}
        <div className="grid min-w-0 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Hours
            </h3>
            <BusinessStatusClient hours={r.hours} variant="label" />
            {r.hours && Object.keys(r.hours).length > 0 ? (
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600" aria-label="Hours by day">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => (
                    <li key={day} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                      <span className="font-medium sm:font-normal">{day}</span>
                      <span className="sm:text-right">{r.hours![day] ?? "—"}</span>
                    </li>
                  )
                )}
              </ul>
            ) : null}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Location
            </h3>
            <p className="mt-2 break-words text-slate-800">
              {r.addressLine}
              <br />
              {r.city}, {r.state}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <CopyAddressButtonClient
                text={`${r.addressLine}, ${r.city}, ${r.state}`}
              />
              <a
                href={googleMapsUrl(r.addressLine, r.city, r.state)}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* — Food truck notice — */}
      {isFoodTruck ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="text-sm font-semibold text-amber-900">
            Food truck / pop-up
          </div>
          <div className="mt-2 text-sm text-amber-900/90">
            This listing operates as a{" "}
            <span className="font-medium">food truck</span> and/or{" "}
            <span className="font-medium">pop-up</span>. Hours and locations can
            change—check their latest updates before heading out.
          </div>
        </div>
      ) : null}

      {/* — About — */}
      {writeUp.length > 0 ? (
        <section className="mt-10 min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            About this restaurant
          </h2>
          <div className="mt-3 grid min-w-0 gap-3 text-slate-700">
            {writeUp.map((p) => (
              <p key={p} className="break-words">{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {/* — Highlights — */}
      {r.highlights.length > 0 ? (
        <section className="mt-6 min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
          <ul className="mt-3 list-disc space-y-2 break-words pl-5 text-slate-700">
            {r.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* — Similar spots (Statewide Discovery) — */}
      <div className="mt-10 min-w-0">
        <SimilarSpots
          restaurants={similarRestaurants}
          title={similarSpotsTitle(r)}
        />
      </div>

      {/* — Report an issue — */}
      <p className="mt-10 text-center text-sm text-slate-500">
        <Link
          href={reportHref}
          className="underline hover:text-amber-700 focus:text-amber-700"
        >
          Is this information incorrect? Report a closure or update here.
        </Link>
      </p>
    </article>
  )
}

