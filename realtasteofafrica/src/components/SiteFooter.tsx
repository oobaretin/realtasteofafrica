import Image from "next/image"
import Link from "next/link"

import { CLAIM_VERIFY_PRICE_USD, CONTACT_EMAIL } from "@/lib/site"

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
              African restaurant directory — starting in Houston-area and
              expanding nationwide.
            </p>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">Explore</div>
            <Link className="text-slate-600 hover:text-slate-900" href="/restaurants">
              Browse restaurants
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/areas/houston">
              Houston area
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/contact">
              Contact
            </Link>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">For restaurants</div>
            <Link className="text-slate-600 hover:text-slate-900" href="/submit">
              Submit a restaurant
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/claim">
              Claim &amp; verify listing (${CLAIM_VERIFY_PRICE_USD})
            </Link>
            <p className="pt-1 text-xs text-slate-500">
              Claiming is a one-time verification to keep your details accurate.
            </p>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">Email</div>
            <a
              className="text-slate-600 hover:text-slate-900"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            <p className="pt-1 text-xs text-slate-500">
              Send corrections, new listings, or claim requests.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} Real Taste of Africa. All rights reserved.
          </div>
          <div className="text-slate-500">
            Directory • Houston-first • Expanding nationwide
          </div>
        </div>
      </div>
    </footer>
  )
}

