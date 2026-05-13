import Image from "next/image"
import { notFound } from "next/navigation"

import { RestaurantCard } from "@/components/RestaurantCard"
import { WpPageShell } from "@/components/WpPageShell"
import {
  EDITORIAL_COLLECTIONS,
  getCollectionBySlug,
  resolveCollectionRestaurants,
} from "@/data/collections"
import { RESTAURANTS } from "@/lib/restaurants"

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
  return {
    title: c.title,
    description: c.metaDescription,
    openGraph: {
      title: c.title,
      description: c.metaDescription,
      images: [{ url: c.headerImage.src, alt: c.headerImage.alt }],
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

  return (
    <div className="grid gap-8">
      <div className="relative -mx-4 aspect-[21/9] min-h-[180px] overflow-hidden rounded-none bg-slate-900 sm:mx-0 sm:rounded-2xl sm:aspect-[2.4/1]">
        <Image
          src={collection.headerImage.src}
          alt={collection.headerImage.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"
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
