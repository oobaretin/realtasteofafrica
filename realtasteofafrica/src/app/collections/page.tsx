import Image from "next/image"
import Link from "next/link"

import { WpPageShell } from "@/components/WpPageShell"
import { EDITORIAL_COLLECTIONS } from "@/data/collections"
import { resolveHeroSlides } from "@/lib/collectionAssets"
import { SITE_URL } from "@/lib/site"

export const metadata = {
  title: "Guides & editor’s picks",
  description:
    "Curated lists of African restaurants and markets across Texas — jollof-worthy kitchens, pantry runs, and neighborhood gems.",
  openGraph: {
    title: "Guides & editor’s picks | Real Taste of Africa",
    description:
      "Curated lists of African restaurants and markets across Texas — jollof-worthy kitchens, pantry runs, and neighborhood gems.",
    url: `${SITE_URL}/collections`,
  },
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
      <ul className="grid gap-4 sm:grid-cols-2">
        {EDITORIAL_COLLECTIONS.map((c) => {
          const cover = resolveHeroSlides(c)[0]
          return (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-amber-200 hover:shadow-md"
              >
                <div className="relative aspect-[21/9] bg-gradient-to-br from-amber-100 to-slate-200">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>
                  <p className="mt-1 flex-1 text-sm text-slate-600">{c.dek}</p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </WpPageShell>
  )
}
