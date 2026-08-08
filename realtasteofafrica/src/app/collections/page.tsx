import { GuideCard } from "@/components/GuideCard"
import { WpPageShell } from "@/components/WpPageShell"
import { EDITORIAL_COLLECTIONS } from "@/data/collections"
import { SITE_URL } from "@/lib/site"

export const metadata = {
  title: "Guides & editor’s picks",
  description:
    "Curated Texas guides — best jollof in Houston, African markets, Ethiopian in DFW, Austin food trucks, and more neighborhood shortlists.",
  openGraph: {
    title: "Guides & editor’s picks | Real Taste of Africa",
    description:
      "Curated Texas guides — jollof, markets, Ethiopian DFW, Austin African food, and neighborhood gems.",
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
        {EDITORIAL_COLLECTIONS.map((c) => (
          <li key={c.slug}>
            <GuideCard collection={c} />
          </li>
        ))}
      </ul>
    </WpPageShell>
  )
}
