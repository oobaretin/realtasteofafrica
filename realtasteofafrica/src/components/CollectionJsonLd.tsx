import { SITE_URL } from "@/lib/site"
import type { EditorialCollection } from "@/data/collections"
import type { Restaurant } from "@/lib/restaurants"

export function CollectionJsonLd({
  collection,
  restaurants,
}: {
  collection: EditorialCollection
  restaurants: Restaurant[]
}) {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.metaDescription,
    url: `${SITE_URL}/collections/${collection.slug}`,
    numberOfItems: restaurants.length,
    itemListElement: restaurants.map((r, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: r.name,
      url: `${SITE_URL}/restaurants/${r.slug}`,
    })),
  }

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: collection.title,
    description: collection.metaDescription,
    url: `${SITE_URL}/collections/${collection.slug}`,
    author: {
      "@type": "Organization",
      name: "Real Taste of Africa",
    },
    publisher: {
      "@type": "Organization",
      name: "Real Taste of Africa",
      url: SITE_URL,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
    </>
  )
}
