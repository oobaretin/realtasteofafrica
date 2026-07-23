import Link from "next/link"

import { PageHeader } from "@/components/PageHeader"
import { RESTAURANTS } from "@/lib/restaurants"
import { ClaimFlow } from "@/components/ClaimFlow"
import { CLAIM_VERIFY_PRICE_USD } from "@/lib/site"

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "text-slate-300"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export const metadata = {
  title: "Claim Your Listing",
  description:
    "Put your restaurant on the map of Texas. Get a Real Taste Verified badge, manage your menu, and appear above unverified listings.",
}

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>
}) {
  const { slug } = await searchParams
  const initialSlug = slug?.trim() || undefined

  return (
    <div className="grid gap-10">
      <PageHeader
        title="Put Your Restaurant on the Map of Texas"
        description={`Claim your listing, get verified, and stand out in our directory of ${RESTAURANTS.length}+ African restaurants, food trucks, and markets across the Lone Star State.`}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/claim", label: "Claim" },
        ]}
      />

      <section
        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 md:p-8"
        aria-labelledby="benefits-heading"
      >
        <h2 id="benefits-heading" className="sr-only">
          Why claim your listing
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="grid gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-semibold tracking-tight text-slate-900">
              Verified Badge
            </h3>
            <p className="text-sm text-slate-600">
              Build trust with a <strong>Real Taste Verified</strong> checkmark
              on your listing so customers know it’s official.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 className="font-semibold tracking-tight text-slate-900">
              Manage Your Menu
            </h3>
            <p className="text-sm text-slate-600">
              Keep your hours, photos, and links updated so diners always see
              accurate info.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="font-semibold tracking-tight text-slate-900">
              Priority Search
            </h3>
            <p className="text-sm text-slate-600">
              Verified listings appear above unverified ones in our {RESTAURANTS.length}+ directory.
            </p>
          </div>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        aria-labelledby="compare-heading"
      >
        <h2 id="compare-heading" className="sr-only">
          Community vs Verified listing
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th scope="col" className="px-4 py-3 font-semibold text-slate-900">
                  Feature
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-slate-900">
                  Community Listing <span className="font-normal text-slate-500">(Free)</span>
                </th>
                <th scope="col" className="bg-amber-50/80 px-4 py-3 font-semibold text-amber-900">
                  Verified Listing <span className="font-normal text-amber-800">(${CLAIM_VERIFY_PRICE_USD} One-Time)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-800">Basic Info</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <CheckIcon className="h-4 w-4 text-emerald-500" />
                    Name &amp; City
                  </span>
                </td>
                <td className="bg-amber-50/40 px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                    <CheckIcon className="h-4 w-4 text-amber-600" />
                    Name, City, &amp; Full Address
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-800">Links</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-400">
                    <XIcon className="h-4 w-4" />
                    None
                  </span>
                </td>
                <td className="bg-amber-50/40 px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-700">
                    <CheckIcon className="h-4 w-4 text-amber-600" />
                    Direct Website &amp; Order Links
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-800">Photos</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-400">
                    <XIcon className="h-4 w-4" />
                    Standard
                  </span>
                </td>
                <td className="bg-amber-50/40 px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-700">
                    <CheckIcon className="h-4 w-4 text-amber-600" />
                    Custom Gallery &amp; Menu
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-800">Trust Badge</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-400">
                    <XIcon className="h-4 w-4" />
                    No
                  </span>
                </td>
                <td className="bg-amber-50/40 px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-medium text-amber-800">
                    <CheckIcon className="h-4 w-4 text-amber-600" />
                    Verified Gold Checkmark
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-800">Search Rank</td>
                <td className="px-4 py-3 text-slate-600">Standard</td>
                <td className="bg-amber-50/40 px-4 py-3 font-medium text-slate-800">
                  Priority Placement
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-center text-xs text-slate-500">
          Community listings are free and include name &amp; city. Verified listings get the full address, links, custom photos, gold badge, and priority in search.
        </div>
      </section>

      <div className="flex flex-col gap-6">
        <a
          href="#claim-search"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-amber-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-amber-700 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          Find Your Listing & Claim Now
        </a>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-6 text-sm text-slate-600">
            One-time fee of ${CLAIM_VERIFY_PRICE_USD} — no subscription. After payment and
            verification, we add your badge and update your listing.
          </p>
          <ClaimFlow initialSlug={initialSlug} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Not on the list yet?</p>
        <p className="mt-1 text-sm text-slate-600">
          Submit the restaurant first, then come back to claim it.
        </p>
        <div className="mt-4">
          <Link
            className="inline-flex rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            href="/submit"
          >
            Submit a restaurant
          </Link>
        </div>
      </div>
    </div>
  )
}
