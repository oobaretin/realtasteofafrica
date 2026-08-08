import Image from "next/image"
import Link from "next/link"

import type { EditorialCollection } from "@/data/collections"
import { COLLECTION_HERO_FALLBACK, resolveHeroSlides } from "@/lib/collectionAssets"

const FALLBACK_GRADIENTS: Record<string, string> = {
  "best-jollof-houston": "from-amber-600 via-orange-700 to-slate-900",
  "african-markets-texas": "from-emerald-700 via-teal-800 to-slate-900",
  "ethiopian-dfw": "from-violet-700 via-purple-900 to-slate-950",
  "african-food-austin": "from-emerald-600 via-lime-800 to-slate-900",
}

type GuideCardProps = {
  collection: EditorialCollection
  /** Short label above title, e.g. "Guide" */
  eyebrow?: string
}

export function GuideCard({ collection, eyebrow = "Guide" }: GuideCardProps) {
  const cover = resolveHeroSlides(collection)[0]
  const isFallback = cover.src === COLLECTION_HERO_FALLBACK
  const gradient =
    FALLBACK_GRADIENTS[collection.slug] ?? "from-amber-700 via-slate-800 to-slate-950"

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-amber-200 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
        {isFallback ? (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
            aria-hidden
          />
        ) : (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200 ring-1 ring-white/20 backdrop-blur-sm">
          {eyebrow}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-slate-900 group-hover:text-amber-800">
          {collection.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-slate-600">{collection.dek}</p>
        <span className="mt-4 text-sm font-semibold text-amber-700 group-hover:text-amber-800">
          Read the guide →
        </span>
      </div>
    </Link>
  )
}
