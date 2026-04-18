"use client"

import { useState } from "react"

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
}: {
  restaurants: Restaurant[]
  areas: Area[]
  cuisineTags: string[]
  initialCuisine: string
  initialArea: string
  initialCategory?: string
}) {
  const [isOpenNowOnly, setIsOpenNowOnly] = useState(false)

  const sidebar = <WpSidebar />

  return (
    <WpPageShell
      title="Browse restaurants & markets"
      description="Filter by region, cuisine, and type—where to eat (restaurants, trucks, ghost kitchens) or markets and groceries. Texas-wide coverage."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/restaurants", label: "Restaurants" },
      ]}
      sidebar={sidebar}
    >
      <RestaurantsBrowser
        restaurants={restaurants}
        areas={areas}
        cuisineTags={cuisineTags}
        initialCuisine={initialCuisine}
        initialArea={initialArea}
        initialCategory={initialCategory}
        isOpenNowOnly={isOpenNowOnly}
        onOpenNowOnlyChange={setIsOpenNowOnly}
      />
    </WpPageShell>
  )
}
