import { WpPageShell } from "@/components/WpPageShell"
import { RestaurantsBrowser } from "@/components/RestaurantsBrowser"
import { AREAS } from "@/lib/areas"
import { getAllCuisineTags, RESTAURANTS } from "@/lib/restaurants"

export const metadata = {
  title: "Browse restaurants",
}

type RestaurantsPageProps = {
  searchParams: Promise<{ cuisine?: string }>
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const cuisines = getAllCuisineTags()
  const params = await searchParams
  const initialCuisine = params.cuisine?.trim() ?? ""

  return (
    <WpPageShell
      title="Browse African restaurants"
      description="Start with Greater Houston and neighboring cities. As we grow, we’ll add more regions nationwide."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/restaurants", label: "Restaurants" },
      ]}
    >
      <RestaurantsBrowser
        restaurants={RESTAURANTS}
        areas={AREAS}
        cuisineTags={cuisines}
        initialCuisine={initialCuisine}
      />
    </WpPageShell>
  )
}

