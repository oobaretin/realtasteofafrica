import { WpPageShell } from "@/components/WpPageShell"
import { RestaurantsBrowser } from "@/components/RestaurantsBrowser"
import { AREAS } from "@/lib/areas"
import { getAllCuisineTags, RESTAURANTS } from "@/lib/restaurants"

export const metadata = {
  title: "Browse restaurants",
}

export default function RestaurantsPage() {
  const cuisines = getAllCuisineTags()

  return (
    <WpPageShell
      title="Browse African restaurants"
      description="Start with Greater Houston and neighboring cities. As we grow, we’ll add more regions nationwide."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/restaurants", label: "Restaurants" },
      ]}
    >
      <RestaurantsBrowser restaurants={RESTAURANTS} areas={AREAS} cuisineTags={cuisines} />
    </WpPageShell>
  )
}

