import Image from "next/image"

import {
  CATEGORY_STRIP_CLASSES,
  getEstablishmentCategory,
} from "@/lib/establishmentType"
import type { Restaurant } from "@/lib/restaurants"

const HERO_GRADIENT: Record<
  ReturnType<typeof getEstablishmentCategory>,
  string
> = {
  Restaurant: "from-amber-500 to-amber-700",
  "Food Truck": "from-orange-400 to-orange-600",
  "Ghost Kitchen": "from-slate-500 to-slate-700",
  Market: "from-emerald-500 to-emerald-700",
  "Market + Kitchen": "from-green-500 to-green-700",
}

function mapsEmbedSrc(r: Restaurant): string | null {
  if (r.latitude != null && r.longitude != null) {
    return `https://maps.google.com/maps?q=${r.latitude},${r.longitude}&z=15&output=embed`
  }
  const q = encodeURIComponent(`${r.addressLine}, ${r.city}, ${r.state}`)
  return `https://maps.google.com/maps?q=${q}&z=15&output=embed`
}

export function ListingHero({ restaurant }: { restaurant: Restaurant }) {
  const category = getEstablishmentCategory(restaurant)
  const stripClass = CATEGORY_STRIP_CLASSES[category]
  const gradient = HERO_GRADIENT[category]
  const embedSrc = mapsEmbedSrc(restaurant)

  if (restaurant.imageUrl) {
    return (
      <div className="relative aspect-[21/9] min-h-[12rem] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <Image
          src={restaurant.imageUrl}
          alt={`${restaurant.name} — ${restaurant.city}, Texas`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 720px"
          priority
          unoptimized
        />
      </div>
    )
  }

  if (embedSrc) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <iframe
          title={`Map showing ${restaurant.name}`}
          src={embedSrc}
          className="aspect-[21/9] min-h-[12rem] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    )
  }

  return (
    <div
      className={`relative flex aspect-[21/9] min-h-[12rem] items-end overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-sm`}
      aria-hidden
    >
      <div className={`absolute inset-x-0 top-0 h-2 ${stripClass}`} />
      <p className="relative text-sm font-semibold text-white/90">{category}</p>
    </div>
  )
}
