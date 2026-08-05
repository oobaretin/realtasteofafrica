import Link from "next/link"

/** Compact verification legend for browse and filter contexts. */
export function TrustLegendStrip() {
  return (
    <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 sm:text-sm">
      <span className="font-medium text-slate-800">Directory verified</span> = we checked hours
      and phone.{" "}
      <span className="font-medium text-slate-800">Real Taste Verified</span> = owner claimed
      the listing.{" "}
      <Link href="/trust" className="font-medium text-amber-700 underline hover:text-amber-800">
        Learn more
      </Link>
    </p>
  )
}
