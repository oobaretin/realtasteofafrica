import Link from "next/link"

import { Badge } from "@/components/Badge"
import { WpPageShell } from "@/components/WpPageShell"
import { CONTACT_EMAIL } from "@/lib/site"

export const metadata = {
  title: "Contact",
}

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits.startsWith("+") ? digits : `+${digits}`
}

export default function ContactPage() {
  const directoryPhone = "+1 (713) 555-0123"

  return (
    <WpPageShell
      title="Contact"
      description="Questions, corrections, or restaurant submissions—reach out and we’ll get it handled."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/contact", label: "Contact" },
      ]}
    >
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Support</Badge>
          <Badge>Houston-first</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Directory support
              </h2>
              <Badge>Greater Houston, TX</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Houston-first (for now), expanding nationwide.
            </p>

            <div className="mt-4 grid gap-2 text-sm text-slate-700">
              <div>
                <span className="text-slate-500">Phone:</span>{" "}
                <a
                  className="font-medium text-amber-700 hover:text-amber-800"
                  href={`tel:${toTelHref(directoryPhone)}`}
                >
                  {directoryPhone}
                </a>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{" "}
                <a
                  className="font-medium text-amber-700 hover:text-amber-800"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                className="rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
                href="/submit"
              >
                Submit a restaurant
              </Link>
              <Link
                className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                href="/restaurants"
              >
                Browse listings
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Message
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Email us and we’ll reply as soon as we can.
            </p>
            <p className="mt-3 text-sm text-slate-700">
              <span className="text-slate-500">Email:</span>{" "}
              <a
                className="font-medium text-amber-700 hover:text-amber-800"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL}
              </a>
            </p>

            <div className="mt-5">
              <a
                className="inline-flex rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
                href={`mailto:${CONTACT_EMAIL}?subject=Directory%20Question`}
              >
                Email us →
              </a>
            </div>
          </section>
        </div>
      </div>
    </WpPageShell>
  )
}

