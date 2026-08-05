import Link from "next/link"

import { WpPageShell } from "@/components/WpPageShell"
import { SITE_TAGLINE } from "@/lib/site"

export const metadata = {
  title: "How we verify listings",
  description:
    "What Directory verified and Real Taste Verified mean — and how we keep hours, phones, and directions accurate across Texas.",
}

const TRUST_ITEMS = [
  {
    id: "directory",
    title: "Directory verified",
    badge: "Directory verified · Jul 2026",
    badgeClass:
      "inline-flex rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900",
    body: [
      "Our team checks listings on a regular schedule — confirming the business is still open, phone numbers dial, hours look reasonable, and the address maps correctly.",
      "When you see this badge, the listing was last audited on the date shown. Details can still change; call ahead if you're unsure.",
    ],
  },
  {
    id: "owner",
    title: "Real Taste Verified",
    badge: "Real Taste Verified",
    badgeClass:
      "inline-flex items-center gap-1.5 rounded-full border-2 border-[rgba(212,175,55,0.55)] bg-[rgba(212,175,55,0.12)] px-2.5 py-1 text-xs font-semibold text-[#8B6914]",
    body: [
      "The business owner claimed this listing through our claim flow and confirmed they represent the restaurant, truck, or market.",
      "Owner-verified listings may show updated details and stand out in browse results. This is separate from our directory audit.",
    ],
    foot: (
      <Link href="/claim" className="text-sm font-medium text-amber-700 hover:text-amber-800">
        Claim your listing →
      </Link>
    ),
  },
  {
    id: "hours",
    title: "Open now / Closed",
    badge: "Open Now",
    badgeClass:
      "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800",
    body: [
      "When a listing includes structured hours, we compute open/closed status in Texas local time — including “Closing soon” when the kitchen is about to shut.",
      "Food trucks, pop-ups, and spots without published hours show no live status. When in doubt, call before you drive.",
    ],
  },
] as const

export default function TrustPage() {
  return (
    <WpPageShell
      title="How we verify listings"
      description={SITE_TAGLINE}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/trust", label: "How we verify" },
      ]}
    >
      <div className="grid gap-6">
        <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
          We use a few different signals on each listing. Here&apos;s what each one means — no
          marketing fluff.
        </p>

        {TRUST_ITEMS.map((item) => (
          <section
            key={item.id}
            id={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">
                {item.title}
              </h2>
              <span className={item.badgeClass}>{item.badge}</span>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:text-base">
              {item.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {"foot" in item && item.foot ? <div className="mt-4">{item.foot}</div> : null}
          </section>
        ))}

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">Spot something wrong?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Closures, wrong hours, or a missing spot — we want to know.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Contact us
            </Link>
            <Link
              href="/submit"
              className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Submit a restaurant
            </Link>
          </div>
        </section>
      </div>
    </WpPageShell>
  )
}
