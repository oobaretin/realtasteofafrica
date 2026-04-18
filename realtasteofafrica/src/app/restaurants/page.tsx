import { BrowseContent } from "@/components/BrowseContent"
import { AREAS } from "@/lib/areas"
import { ALL_FILTER_TYPE_VALUES } from "@/lib/establishmentType"
import { getAllCuisineTags, RESTAURANTS } from "@/lib/restaurants"

export const metadata = {
  title: "Browse restaurants & markets",
}

type RestaurantsPageProps = {
  searchParams: Promise<{ cuisine?: string; area?: string; type?: string }>
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const cuisines = getAllCuisineTags()
  const params = await searchParams
  const initialCuisine = params.cuisine?.trim() ?? ""
  const initialArea = params.area?.trim() ?? ""
  const typeParam = params.type?.trim() ?? "All"
  const validTypes = new Set(ALL_FILTER_TYPE_VALUES)
  const initialCategory = validTypes.has(typeParam) ? typeParam : "All"

  return (
    <BrowseContent
      restaurants={RESTAURANTS}
      areas={AREAS}
      cuisineTags={cuisines}
      initialCuisine={initialCuisine}
      initialArea={initialArea}
      initialCategory={initialCategory}
    />
  )
}
