import Link from "next/link"

import { WpPageShell } from "@/components/WpPageShell"
import { ContactFormUnified } from "@/components/ContactFormUnified"

export const metadata = {
  title: "Contact",
  description:
    "Help us maintain the standard. Report closures, corrections, or claim your business. Keep the Texas directory accurate.",
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ restaurant?: string }>
}) {
  const params = await searchParams
  const initialRestaurantName = params?.restaurant ?? ""

  return (
    <WpPageShell
      title="Help Us Maintain the Standard."
      description="Report closures, corrections, or claim your listing. Your input keeps the Texas African food scene accurate."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/contact", label: "Contact" },
      ]}
    >
      <div className="grid gap-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/submit"
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>➕</span>
            <h2 className="mt-2 text-base font-semibold tracking-tight text-slate-900">
              Add a Restaurant
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Suggest a new African restaurant or food spot in Texas.
            </p>
            <span className="mt-3 text-sm font-medium text-amber-700">Submit a listing →</span>
          </Link>

          <Link
            href="/claim"
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>✓</span>
            <h2 className="mt-2 text-base font-semibold tracking-tight text-slate-900">
              Claim your listing
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Verify ownership for a badge and control of your page.
            </p>
            <span className="mt-3 text-sm font-medium text-amber-700">Go to claim flow →</span>
          </Link>

          <a
            href="#report"
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>⚠</span>
            <h2 className="mt-2 text-base font-semibold tracking-tight text-slate-900">
              Report an Issue
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Closure, correction, or wrong info. We audit within 24 hours.
            </p>
            <span className="mt-3 text-sm font-medium text-amber-700">Report below →</span>
          </a>
        </div>

        <ContactFormUnified initialRestaurantName={initialRestaurantName} />
      </div>
    </WpPageShell>
  )
}
