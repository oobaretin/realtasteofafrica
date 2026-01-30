import Link from "next/link"

import { WpPageShell } from "@/components/WpPageShell"
import { ContactForm } from "@/components/ContactForm"
import { ReportForm } from "@/components/ReportForm"

export const metadata = {
  title: "Contact",
  description:
    "Data Integrity Hub: add a restaurant, claim your listing, or report an issue. Keep the Texas directory accurate.",
}

export default function ContactPage() {
  return (
    <WpPageShell
      title="Data Integrity Hub"
      description="Keep the Texas directory accurate. Add spots, claim your business, or report closures and errors below."
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
              Claim / Verify
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Verify your listing ($49 one-time) for a verified badge and control.
            </p>
            <span className="mt-3 text-sm font-medium text-amber-700">Go to verification →</span>
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
              Closed business, duplicate, wrong address, or broken contact info.
            </p>
            <span className="mt-3 text-sm font-medium text-amber-700">Report below →</span>
          </a>
        </div>

        <ReportForm />

        <ContactForm />
      </div>
    </WpPageShell>
  )
}
