import Image from "next/image"
import Link from "next/link"

import { CONTACT_EMAIL, SITE_TAGLINE } from "@/lib/site"

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
            <p className="text-sm text-slate-600">{SITE_TAGLINE}</p>
            <Link className="text-sm text-amber-700 hover:text-amber-800 hover:underline" href="/trust">
              How we verify listings →
            </Link>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">Explore</div>
            <ul className="grid gap-1.5 text-slate-600">
              {TEXAS_COVERAGE.map(({ label, areaSlug }) => (
                <li key={areaSlug}>
                  <Link
                    className="hover:text-slate-900 hover:underline"
                    href={`/restaurants?area=${areaSlug}`}
                    prefetch={true}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="text-slate-600 hover:text-slate-900" href="/restaurants">
              Browse all
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/saved">
              Your picks
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

          <div className="grid gap-3 text-sm">
            <div className="font-semibold text-slate-900">Get in touch</div>
            <a
              className="break-all font-medium text-amber-700 hover:text-amber-800 hover:underline"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Real Taste of Africa. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
