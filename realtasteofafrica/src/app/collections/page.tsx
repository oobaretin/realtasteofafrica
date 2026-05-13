import Link from "next/link"

import { WpPageShell } from "@/components/WpPageShell"
import { EDITORIAL_COLLECTIONS } from "@/data/collections"

export const metadata = {
  title: "Guides & editor’s picks",
  description:
    "Curated lists of African restaurants and markets across Texas — jollof-worthy kitchens, pantry runs, and neighborhood gems.",
}

export default function CollectionsIndexPage() {
  return (
    <WpPageShell
      title="Guides & editor’s picks"
      description="Short, opinionated lists for specific cravings and errands — not an exhaustive database dump."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/collections", label: "Collections" },
      ]}
    >
      <ul className="grid gap-4">
        {EDITORIAL_COLLECTIONS.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/collections/${c.slug}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-200 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{c.dek}</p>
            </Link>
          </li>
        ))}
      </ul>
    </WpPageShell>
  )
}
