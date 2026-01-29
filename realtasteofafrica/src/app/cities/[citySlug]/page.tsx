import { notFound } from "next/navigation"

import { RestaurantCard } from "@/components/RestaurantCard"
import { WpPageShell } from "@/components/WpPageShell"
import {
  getAllCitySlugs,
  getRestaurantsByCity,
} from "@/lib/restaurants"

const SEO_CITY_HEADER_CITIES = ["Amarillo", "McAllen"]

function getCityTitle(cityName: string): string {
  if (SEO_CITY_HEADER_CITIES.includes(cityName)) {
    return `The Best African Food in ${cityName}, Texas`
  }
  return `African Restaurants in ${cityName}, Texas`
}

function getCityDescription(cityName: string): string {
  return `Find African restaurants and markets in ${cityName}, Texas. Browse listings, cuisines, and contact info.`
}

export async function generateStaticParams() {
  return getAllCitySlugs().map((citySlug) => ({ citySlug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>
}) {
  const { citySlug } = await params
  const restaurants = getRestaurantsByCity(citySlug)
  if (restaurants.length === 0) return { title: "City" }
  const cityName = restaurants[0].city
  return {
    title: getCityTitle(cityName),
    description: getCityDescription(cityName),
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ citySlug: string }>
}) {
  const { citySlug } = await params
  const restaurants = getRestaurantsByCity(citySlug)
  if (restaurants.length === 0) notFound()

  const cityName = restaurants[0].city
  const title = getCityTitle(cityName)
  const description = getCityDescription(cityName)

  return (
    <WpPageShell
      title={title}
      description={description}
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/restaurants", label: "Restaurants" },
        { href: `/cities/${citySlug}`, label: `${cityName}, Texas` },
      ]}
    >
      <section className="grid gap-4">
        <p className="text-sm text-slate-600">
          {restaurants.length} listing{restaurants.length !== 1 ? "s" : ""} in{" "}
          {cityName}, Texas
        </p>

        <ul
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          aria-label={`Restaurant listings in ${cityName}`}
        >
          {restaurants.map((r) => (
            <li key={r.slug}>
              <RestaurantCard restaurant={r} />
            </li>
          ))}
        </ul>
      </section>
    </WpPageShell>
  )
}
