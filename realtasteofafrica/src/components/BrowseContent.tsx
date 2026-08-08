"use client"

import { RegionChipBar } from "@/components/RegionChipBar"
import { WpPageShell } from "@/components/WpPageShell"
import { WpSidebar } from "@/components/WpSidebar"
import { RestaurantsBrowser } from "@/components/RestaurantsBrowser"
import type { Area } from "@/lib/areas"
import type { Restaurant } from "@/lib/restaurants"

export function BrowseContent({
  restaurants,
  areas,
  cuisineTags,
  initialCuisine,
  initialArea,
  initialCategory = "All",
  initialQuery = "",
  initialOpenNow = false,
  initialView = "list",
}: {
  restaurants: Restaurant[]
  areas: Area[]
  cuisineTags: string[]
  initialCuisine: string
  initialArea: string
  initialCategory?: string
  initialQuery?: string
  initialOpenNow?: boolean
  initialView?: "list" | "map"
}) {
  const sidebar = (
    <div className="hidden lg:block">
      <WpSidebar />
    </div>
  )

  return (
    <WpPageShell
      title="Browse restaurants & markets"
      description="Search by name, filter by region or cuisine, or turn on Open now and Near me."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/restaurants", label: "Restaurants" },
      ]}
      beforeContent={<RegionChipBar areas={areas} activeSlug={initialArea} />}
      sidebar={sidebar}
    >
      <RestaurantsBrowser
        restaurants={restaurants}
        areas={areas}
        cuisineTags={cuisineTags}
        initialCuisine={initialCuisine}
        initialArea={initialArea}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
        initialOpenNow={initialOpenNow}
        initialView={initialView}
      />
    </WpPageShell>
  )
}
