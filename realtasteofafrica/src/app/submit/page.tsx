import Link from "next/link"

import { Badge } from "@/components/Badge"
import { WpPageShell } from "@/components/WpPageShell"

export const metadata = {
  title: "Submit a restaurant",
}

export default function SubmitPage() {
  return (
    <WpPageShell
      title="Submit a restaurant"
      description="Know a great African restaurant in Houston or nearby cities? Send it in and we’ll add it to the directory."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/submit", label: "Submit" },
      ]}
    >
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Directory</Badge>
          <Badge>Community-powered</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              What to include
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              The more complete the info, the faster we can publish.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Restaurant name</li>
              <li>City/area (Houston, Katy, Sugar Land, etc.)</li>
              <li>Full address</li>
              <li>Cuisine/style (Nigerian, Ethiopian, Ghanaian, etc.)</li>
              <li>Phone and website (if available)</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Submit
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              For now, submissions are handled by email.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                className="rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
                href="mailto:hello@realtasteofafrica.com?subject=Restaurant%20Submission"
              >
                Email a submission
              </a>
              <Link
                className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                href="/restaurants"
              >
                Browse listings
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Tip: include a website or map link so we can verify quickly.
            </p>
          </section>
        </div>
      </div>
    </WpPageShell>
  )
}

