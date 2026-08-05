import { RestaurantCard } from "@/components/RestaurantCard"
import type { Restaurant } from "@/lib/restaurants"

type FeaturedGridProps = {
  restaurants: Restaurant[]
  limit?: number
}

export function FeaturedGrid({ restaurants, limit = 3 }: FeaturedGridProps) {
  const picks = restaurants.slice(0, limit)

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
      {picks.map((r) => (
        <RestaurantCard key={r.slug} restaurant={r} variant="featured" />
      ))}
    </div>
  )
}
