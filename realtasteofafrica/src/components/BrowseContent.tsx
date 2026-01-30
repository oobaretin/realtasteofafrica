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
}: {
  restaurants: Restaurant[]
  areas: Area[]
  cuisineTags: string[]
  initialCuisine: string
  initialArea: string
}) {
  const [isOpenNowOnly, setIsOpenNowOnly] = useState(false)

  const sidebar = <WpSidebar />

  return (
    <WpPageShell
      title="Browse African restaurants"
      description="Start with Greater Houston and neighboring cities. As we grow, we'll add more regions nationwide."
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
        isOpenNowOnly={isOpenNowOnly}
        onOpenNowOnlyChange={setIsOpenNowOnly}
      />
    </WpPageShell>
  )
}
