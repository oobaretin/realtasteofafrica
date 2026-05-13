import Image from "next/image"
import { notFound } from "next/navigation"

import { CollectionHero } from "@/components/CollectionHero"
import { RestaurantCard } from "@/components/RestaurantCard"
import { WpPageShell } from "@/components/WpPageShell"
import {
  EDITORIAL_COLLECTIONS,
  getCollectionBySlug,
  resolveCollectionRestaurants,
} from "@/data/collections"
import { publicFileExists, resolveHeroSlides } from "@/lib/collectionAssets"
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
  const heroSlides = resolveHeroSlides(c)
  const ogImageSrc = heroSlides[0]?.src ?? "/realtasteofafrica.png"
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

  const heroSlides = resolveHeroSlides(collection)
  const guideImagesResolved =
    collection.guideImages?.filter((img) => publicFileExists(img.src)) ?? []

  const jollofFullHero = collection.slug === "best-jollof-houston"

  return (
    <div className="grid gap-8">
      <CollectionHero
        slides={heroSlides}
        jollofFullHero={jollofFullHero}
        title={collection.title}
        dek={collection.dek}
      />

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
