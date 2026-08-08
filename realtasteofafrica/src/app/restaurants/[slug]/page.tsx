import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/Badge"
import { BusinessStatusClient } from "@/components/BusinessStatusClient"
import { ClaimListingBanner } from "@/components/ClaimListingBanner"
import { CopyAddressButtonClient } from "@/components/CopyAddressButton"
import { ListingActionStack } from "@/components/ListingActionStack"
import { ListingHero } from "@/components/ListingHero"
import { ListingMobileBar } from "@/components/ListingMobileBar"
import { SimilarSpots } from "@/components/SimilarSpots"
import { VerifiedBadge } from "@/components/VerifiedBadge"
import {
  formatDirectoryVerifiedLabel,
  showDirectoryVerifiedBadge,
} from "@/lib/formatAudit"
import { getRestaurantMapsUrl } from "@/lib/mapsUrl"
import {
  cityToSlug,
  getListingNumber,
  getRestaurantBySlug,
  getSimilarRestaurants,
  RESTAURANTS,
  type Restaurant,
} from "@/lib/restaurants"
import { getRestaurantWriteUp } from "@/lib/restaurantWriteUp"

function isFoodTruckListing(highlights: string[]) {
  return highlights.some((h) => /\b(food\s*truck|pop-?up)\b/i.test(h))
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
  const description = `Discover and visit ${r.name} in ${r.city}. One of ${RESTAURANTS.length}+ manually verified African culinary spots in Texas.`
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

  const sidebar = (
    <aside className="grid gap-6">
      <div className="hidden lg:block">
        <h2 className="sr-only">Quick actions</h2>
        <ListingActionStack
          restaurant={r}
          listingNumber={listingNumber}
          totalListings={RESTAURANTS.length}
          layout="stack"
        />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
        <h3 className="text-sm font-semibold text-slate-900">Hours</h3>
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
        <h3 className="text-sm font-semibold text-slate-900">Location</h3>
        <p className="mt-2 break-words text-slate-800">
          {r.addressLine}
          <br />
          {r.city}, {r.state}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <CopyAddressButtonClient text={`${r.addressLine}, ${r.city}, ${r.state}`} />
          <a
            href={getRestaurantMapsUrl(r)}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </aside>
  )

  return (
    <article className="min-w-0 grid gap-0 pb-20 lg:pb-0">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-amber-700">
              Texas
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/cities/${cityToSlug(r.city)}`} className="hover:text-amber-700">
              {r.city}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-slate-700">{cuisineLabel}</li>
        </ol>
      </nav>

      <ListingHero restaurant={r} />

      <header className="mt-4 grid gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          {r.name}
        </h1>
        <p className="text-base text-slate-600">
          {r.addressLine} · {r.city}, {r.state}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <BusinessStatusClient hours={r.hours} variant="badge" />
          {r.isVerified ? <VerifiedBadge linkToTrust /> : null}
          {showDirectoryVerifiedBadge(r) ? (
            <Link
              href="/trust#directory"
              className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
            >
              {formatDirectoryVerifiedLabel(r.lastAuditDate)}
            </Link>
          ) : null}
        </div>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="min-w-0 grid gap-6">
          <div className="lg:hidden">
            <h2 className="sr-only">Quick actions</h2>
            <ListingActionStack
              restaurant={r}
              listingNumber={listingNumber}
              totalListings={RESTAURANTS.length}
              layout="inline"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Cuisine & options</h2>
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
              {r.priceLevel ? <Badge>{"$".repeat(r.priceLevel)}</Badge> : null}
              {isFoodTruck ? (
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
                  Food truck / pop-up
                </span>
              ) : null}
            </div>
          </div>

          {isFoodTruck ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900/90">
              Food truck / pop-up — hours and locations can change. Call or check their site
              before heading out.
            </div>
          ) : null}

          {writeUp.length > 0 ? (
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">About this restaurant</h2>
              <div className="mt-3 grid min-w-0 gap-3 text-slate-700">
                {writeUp.map((p) => (
                  <p key={p} className="break-words">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-24">{sidebar}</div>
      </div>

      <div className="mt-10 min-w-0">
        <SimilarSpots restaurants={similarRestaurants} title={similarSpotsTitle(r)} />
      </div>

      {!r.isVerified ? (
        <div className="mt-10">
          <ClaimListingBanner restaurantName={r.name} slug={r.slug} />
        </div>
      ) : null}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link
          href={reportHref}
          className="underline hover:text-amber-700 focus:text-amber-700"
        >
          Is this information incorrect? Report a closure or update here.
        </Link>
      </p>

      <ListingMobileBar restaurant={r} />
    </article>
  )
}
