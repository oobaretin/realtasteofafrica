import Link from "next/link"

import { Card } from "@/components/Card"

export default function NotFound() {
  return (
    <div className="grid gap-6">
      <Card
        title="Page not found"
        description="That route doesn’t exist yet. We’re starting with Houston-area listings and expanding nationwide."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-amber-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-200"
            href="/"
          >
            Go home
          </Link>
          <Link
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-50 hover:bg-white/10"
            href="/restaurants"
          >
            Browse restaurants
          </Link>
        </div>
      </Card>
    </div>
  )
}

