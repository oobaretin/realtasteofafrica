import Link from "next/link"

import { Badge } from "@/components/Badge"
import { ClaimListingForm } from "@/components/ClaimListingForm"
import { WpPageShell } from "@/components/WpPageShell"
import { CLAIM_VERIFY_PRICE_USD, CONTACT_EMAIL } from "@/lib/site"

export const metadata = {
  title: "Claim & verify listing",
}

export default function ClaimPage() {
  return (
    <WpPageShell
      title={`Claim & verify your listing ($${CLAIM_VERIFY_PRICE_USD} one-time)`}
      description="Own this restaurant? Claim your listing so customers see accurate info."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/claim", label: "Claim" },
      ]}
    >
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>For restaurants</Badge>
          <Badge>One-time</Badge>
          <Badge>No subscription</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              What you get
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Verified badge</li>
              <li>We update name, address, phone, and website</li>
              <li>Add menu link + delivery links (if available)</li>
              <li>Add up to 3 highlights (Delivery, Takeout, Dine-in, etc.)</li>
              <li>Priority edits for 30 days</li>
            </ul>

            <h2 className="mt-6 text-base font-semibold tracking-tight text-slate-900">
              How it works
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
              <li>Request a PayPal invoice below</li>
              <li>Pay the invoice ($${CLAIM_VERIFY_PRICE_USD} one-time)</li>
              <li>
                Email proof you’re the owner/manager (business email, official
                website/social, storefront/menu photo, etc.)
              </li>
              <li>We verify and update your listing (typically 24–72 hours)</li>
            </ol>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Contact</div>
              <div className="mt-2 text-sm text-slate-700">
                <span className="text-slate-500">Email:</span>{" "}
                <a
                  className="font-medium text-amber-700 hover:text-amber-800"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="mt-3">
                <Link
                  className="text-sm font-semibold text-amber-700 hover:text-amber-800"
                  href="/restaurants"
                >
                  Browse listings →
                </Link>
              </div>
            </div>
          </section>

          <div className="grid gap-4">
            <ClaimListingForm />
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">
                Not on the list yet?
              </div>
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
        </div>
      </div>
    </WpPageShell>
  )
}

