import Image from "next/image"
import Link from "next/link"

import { EDITORIAL_COLLECTIONS } from "@/data/collections"
import { CONTACT_EMAIL, SITE_TAGLINE } from "@/lib/site"

const TEXAS_COVERAGE = [
  { label: "Houston", areaSlug: "houston" },
  { label: "Dallas", areaSlug: "dfw" },
  { label: "Austin", areaSlug: "austin" },
  { label: "San Antonio", areaSlug: "san-antonio" },
  { label: "West Texas", areaSlug: "west-texas" },
  { label: "RGV", areaSlug: "south-texas" },
] as const

const FOOTER_LINK = "text-slate-600 hover:text-slate-900 hover:underline"

function footerGuideLabel(title: string): string {
  return title.split(" — ")[0]?.trim() || title
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="grid gap-3 sm:col-span-2 lg:col-span-4">
            <Link className="inline-flex items-center gap-3" href="/">
              <Image
                src="/realtasteofafrica.png"
                alt="Real Taste of Africa"
                width={64}
                height={64}
                className="h-10 w-10 rounded-md object-contain"
              />
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Real Taste of Africa
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">{SITE_TAGLINE}</p>
            <Link className={`w-fit text-sm ${FOOTER_LINK}`} href="/trust">
              How we verify listings →
            </Link>
          </div>

          {/* Directory */}
          <div className="grid gap-2 text-sm lg:col-span-2">
            <h2 className="font-semibold text-slate-900">Directory</h2>
            <ul className="grid gap-1.5">
              <li>
                <Link className={FOOTER_LINK} href="/restaurants">
                  Browse all listings
                </Link>
              </li>
              <li>
                <Link className={FOOTER_LINK} href="/restaurants?view=map">
                  View statewide map
                </Link>
              </li>
              <li>
                <Link className={FOOTER_LINK} href="/saved">
                  Your picks
                </Link>
              </li>
            </ul>
          </div>

          {/* Texas regions */}
          <div className="grid gap-2 text-sm lg:col-span-2">
            <h2 className="font-semibold text-slate-900">Texas</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-1">
              {TEXAS_COVERAGE.map(({ label, areaSlug }) => (
                <li key={areaSlug}>
                  <Link className={FOOTER_LINK} href={`/restaurants?area=${areaSlug}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides */}
          <div className="grid gap-2 text-sm lg:col-span-2">
            <h2 className="font-semibold text-slate-900">Guides</h2>
            <ul className="grid gap-1.5">
              <li>
                <Link className={FOOTER_LINK} href="/collections">
                  All guides
                </Link>
              </li>
              {EDITORIAL_COLLECTIONS.map((guide) => (
                <li key={guide.slug}>
                  <Link className={FOOTER_LINK} href={`/collections/${guide.slug}`}>
                    {footerGuideLabel(guide.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Listings + contact */}
          <div className="grid gap-2 text-sm sm:col-span-2 lg:col-span-2">
            <h2 className="font-semibold text-slate-900">Listings &amp; contact</h2>
            <ul className="grid gap-1.5">
              <li>
                <Link className={FOOTER_LINK} href="/submit">
                  Submit a restaurant
                </Link>
              </li>
              <li>
                <Link className={FOOTER_LINK} href="/claim">
                  Claim your listing
                </Link>
              </li>
              <li>
                <Link className={FOOTER_LINK} href="/contact">
                  Contact us
                </Link>
              </li>
            </ul>
            <a
              className="mt-1 break-all font-medium text-amber-700 hover:text-amber-800 hover:underline"
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
