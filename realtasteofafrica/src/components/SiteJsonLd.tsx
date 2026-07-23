import { CONTACT_EMAIL, SITE_URL } from "@/lib/site"

/** Site-wide JSON-LD for Organization + WebSite (incl. sitelinks search box). */
export function SiteJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Real Taste of Africa",
    url: SITE_URL,
    email: CONTACT_EMAIL,
    description:
      "Directory of African restaurants, food trucks, and markets across Texas.",
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Real Taste of Africa",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/restaurants?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
