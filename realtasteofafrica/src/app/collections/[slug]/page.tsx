import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { RestaurantCard } from "@/components/RestaurantCard"
import { WpPageShell } from "@/components/WpPageShell"
import {
  EDITORIAL_COLLECTIONS,
  getCollectionBySlug,
  resolveCollectionRestaurants,
} from "@/data/collections"
import { publicFileExists } from "@/lib/collectionAssets"
import { RESTAURANTS } from "@/lib/restaurants"

/** Shown when no custom hero is in `public/collections/` yet. */
const COLLECTION_HERO_FALLBACK = "/realtasteofafrica.png"

export async function generateStaticParams() {
  return EDITORIAL_COLLECTIONS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const c = getCollectionBySlug(slug)
  if (!c) return { title: "Collection" }
  const ogImageSrc = publicFileExists(c.headerImage.src) ? c.headerImage.src : COLLECTION_HERO_FALLBACK
  return {
    title: c.title,
    description: c.metaDescription,
    openGraph: {
      title: c.title,
      description: c.metaDescription,
      images: [{ url: ogImageSrc, alt: c.headerImage.alt }],
    },
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)
  if (!collection) notFound()

  const restaurants = resolveCollectionRestaurants(collection, RESTAURANTS)

  const heroSrc = publicFileExists(collection.headerImage.src)
    ? collection.headerImage.src
    : COLLECTION_HERO_FALLBACK
  const guideImagesResolved =
    collection.guideImages?.filter((img) => publicFileExists(img.src)) ?? []

  /** Jollof guide: show the full photo (minimal crop) in a tall hero. */
  const jollofFullHero = collection.slug === "best-jollof-houston"

  return (
    <div className="grid gap-8">
      <div
        className={
          jollofFullHero
            ? "relative -mx-4 h-[min(85vh,900px)] min-h-[320px] w-full overflow-hidden rounded-none bg-slate-950 sm:mx-0 sm:rounded-2xl"
            : "relative -mx-4 aspect-[21/9] min-h-[180px] overflow-hidden rounded-none bg-slate-900 sm:mx-0 sm:rounded-2xl sm:aspect-[2.4/1]"
        }
      >
        <Link
          href="/collections"
          className="absolute left-3 top-3 z-20 inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full bg-black/40 px-3 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent sm:left-4 sm:top-4"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          <span className="pr-0.5">All guides</span>
        </Link>
        <Image
          src={heroSrc}
          alt={collection.headerImage.alt}
          fill
          className={jollofFullHero ? "object-contain object-center" : "object-cover"}
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
        <div
          className={
            jollofFullHero
              ? "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/10"
              : "absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"
          }
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95">
            Editor’s pick
          </p>
          <h1 className="mt-2 max-w-4xl font-serif text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {collection.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">{collection.dek}</p>
        </div>
      </div>

      <WpPageShell
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/collections", label: "Collections" },
          { href: `/collections/${collection.slug}`, label: collection.title },
        ]}
      >
        <div className="prose prose-slate max-w-3xl prose-p:text-slate-700 prose-p:leading-relaxed">
          {collection.introduction.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {guideImagesResolved.length > 0 ? (
          <section
            className="mt-10 grid max-w-4xl gap-6 sm:grid-cols-2"
            aria-label="Guide photos"
          >
            {guideImagesResolved.map((img) => (
              <figure
                key={img.src}
                className="m-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                {img.caption ? (
                  <figcaption className="border-t border-slate-100 px-3 py-2.5 text-sm text-slate-600">
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </section>
        ) : null}

        <section aria-label="Featured listings" className="mt-10 grid gap-4">
          <h2 className="font-serif text-xl font-semibold text-slate-900">On the list</h2>
          <p className="text-sm text-slate-600">
            {restaurants.length} spot{restaurants.length !== 1 ? "s" : ""} — order reflects our pick
            sequence, not a ranking score.
          </p>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {restaurants.map((r) => (
              <li key={r.slug}>
                <RestaurantCard restaurant={r} />
              </li>
            ))}
          </ul>
        </section>
      </WpPageShell>
    </div>
  )
}
