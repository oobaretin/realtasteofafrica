import { BrowseContent } from "@/components/BrowseContent"
import { AREAS } from "@/lib/areas"
import { getAllCuisineTags, RESTAURANTS } from "@/lib/restaurants"

export const metadata = {
  title: "Browse restaurants",
}

type RestaurantsPageProps = {
  searchParams: Promise<{ cuisine?: string; area?: string }>
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const cuisines = getAllCuisineTags()
  const params = await searchParams
  const initialCuisine = params.cuisine?.trim() ?? ""
  const initialArea = params.area?.trim() ?? ""

  return (
    <BrowseContent
      restaurants={RESTAURANTS}
      areas={AREAS}
      cuisineTags={cuisines}
      initialCuisine={initialCuisine}
      initialArea={initialArea}
    />
  )
}
