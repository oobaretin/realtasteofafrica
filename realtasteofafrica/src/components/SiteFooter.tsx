import Image from "next/image"
import Link from "next/link"

import { CONTACT_EMAIL } from "@/lib/site"

const TEXAS_COVERAGE = [
  { label: "Houston", areaSlug: "houston" },
  { label: "Dallas", areaSlug: "dfw" },
  { label: "Austin", areaSlug: "austin" },
  { label: "San Antonio", areaSlug: "san-antonio" },
  { label: "West Texas", areaSlug: "west-texas" },
  { label: "RGV", areaSlug: "south-texas" },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="grid gap-3">
            <Link className="inline-flex items-center gap-3" href="/">
              <Image
                src="/realtasteofafrica.png"
                alt="Real Taste of Africa"
                width={64}
                height={64}
                className="h-10 w-10 rounded-md object-contain"
              />
              <div className="text-sm font-semibold tracking-tight text-slate-900">
                Real Taste of Africa
              </div>
            </Link>
            <p className="text-sm text-slate-600">
              The largest verified directory of African cuisine in the Lone Star State.
            </p>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">Texas Coverage</div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600">
              {TEXAS_COVERAGE.map(({ label, areaSlug }, i) => (
                <span key={areaSlug} className="inline-flex items-center gap-x-3">
                  <Link
                    className="hover:text-slate-900 hover:underline"
                    href={`/restaurants?area=${areaSlug}`}
                    prefetch={true}
                  >
                    {label}
                  </Link>
                  {i < TEXAS_COVERAGE.length - 1 ? (
                    <span className="text-slate-300" aria-hidden>|</span>
                  ) : null}
                </span>
              ))}
            </div>
            <Link className="text-slate-600 hover:text-slate-900" href="/restaurants">
              Browse all
            </Link>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">For restaurants</div>
            <Link className="text-slate-600 hover:text-slate-900" href="/submit">
              Submit a restaurant
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/claim">
              Claim your listing
            </Link>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">Contact</div>
            <Link className="text-slate-600 hover:text-slate-900" href="/contact">
              Contact
            </Link>
            <a
              className="text-slate-600 hover:text-slate-900"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            <p className="pt-1 text-xs text-slate-500">
              Corrections, new listings, or claim requests.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} Real Taste of Africa. All rights reserved.
          </div>
          <div className="text-slate-500">
            The largest verified directory of African cuisine in the Lone Star State.
          </div>
        </div>
      </div>
    </footer>
  )
}
