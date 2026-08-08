import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

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

const DIRECTORY_LINKS = [
  { href: "/restaurants", label: "Browse all listings" },
  { href: "/restaurants?view=map", label: "View statewide map" },
  { href: "/saved", label: "Your picks" },
] as const

const LISTING_LINKS = [
  { href: "/submit", label: "Submit a restaurant" },
  { href: "/claim", label: "Claim your listing" },
  { href: "/contact", label: "Contact us" },
] as const

const FOOTER_LINK =
  "text-sm text-slate-600 transition hover:text-slate-900 hover:underline"

function footerGuideLabel(title: string): string {
  return title.split(" — ")[0]?.trim() || title
}

function FooterSection({
  title,
  ariaLabel,
  children,
}: {
  title: string
  ariaLabel: string
  children: ReactNode
}) {
  return (
    <nav aria-label={ariaLabel} className="grid gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </nav>
  )
}

function FooterLinkList({ links }: { links: readonly { href: string; label: string }[] }) {
  return (
    <ul className="grid gap-2">
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link className={FOOTER_LINK} href={href}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function SiteFooter() {
  const guideLinks = [
    { href: "/collections", label: "All guides" },
    ...EDITORIAL_COLLECTIONS.map((guide) => ({
      href: `/collections/${guide.slug}`,
      label: footerGuideLabel(guide.title),
    })),
  ]

  const texasLinks = TEXAS_COVERAGE.map(({ label, areaSlug }) => ({
    href: `/restaurants?area=${areaSlug}`,
    label,
  }))

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="grid gap-4 border-b border-slate-200 pb-10 lg:col-span-4 lg:border-b-0 lg:pb-0 lg:pr-4">
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
            <Link className={`w-fit ${FOOTER_LINK}`} href="/trust">
              How we verify listings →
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4 lg:gap-10">
            <FooterSection title="Directory" ariaLabel="Directory">
              <FooterLinkList links={DIRECTORY_LINKS} />
            </FooterSection>

            <FooterSection title="Texas" ariaLabel="Texas regions">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1">
                {texasLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link className={FOOTER_LINK} href={href}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection title="Guides" ariaLabel="Guides">
              <FooterLinkList links={guideLinks} />
            </FooterSection>

            <FooterSection title="Listings & contact" ariaLabel="Listings and contact">
              <FooterLinkList links={LISTING_LINKS} />
            </FooterSection>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Real Taste of Africa. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link className="text-slate-600 hover:text-slate-900 hover:underline" href="/trust">
              How we verify listings
            </Link>
            <a
              className="font-medium text-amber-700 hover:text-amber-800 hover:underline"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
