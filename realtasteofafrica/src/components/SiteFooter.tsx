import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold tracking-tight">
            Real Taste of Africa
          </div>
          <p className="mt-2 text-sm text-slate-600">
            African restaurant directory — starting in Houston-area and expanding
            nationwide.
          </p>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="font-semibold text-slate-900">Explore</div>
          <Link
            className="text-slate-600 hover:text-slate-900"
            href="/restaurants"
          >
            Browse restaurants
          </Link>
          <Link
            className="text-slate-600 hover:text-slate-900"
            href="/areas/houston"
          >
            Houston area
          </Link>
          <Link className="text-slate-600 hover:text-slate-900" href="/submit">
            Submit a restaurant
          </Link>
          <Link className="text-slate-600 hover:text-slate-900" href="/contact">
            Contact
          </Link>
        </div>

        <div className="text-sm">
          <div className="font-semibold text-slate-900">About</div>
          <p className="mt-2 text-slate-600">
            Directory • Houston-first • Expanding nationwide
          </p>
          <p className="mt-2 text-xs text-slate-500">
            © {new Date().getFullYear()} Real Taste of Africa. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

