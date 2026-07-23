"use client"

import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"

import { RestaurantCard } from "@/components/RestaurantCard"
import type { Restaurant } from "@/lib/restaurants"

type FeaturedCarouselProps = {
  restaurants: Restaurant[]
}

export function FeaturedCarousel({ restaurants }: FeaturedCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className="relative min-w-0">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-x gap-4 sm:gap-6">
          {restaurants.map((r) => (
            <div
              key={r.slug}
              className="min-w-0 flex-[0_0_100%]"
            >
              <RestaurantCard restaurant={r} variant="featured" />
            </div>
          ))}
        </div>
      </div>

      {restaurants.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={scrollPrev}
            className="flex h-11 w-11 min-w-[44px] min-h-[44px] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95"
            aria-label="Previous slide"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="flex h-11 w-11 min-w-[44px] min-h-[44px] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95"
            aria-label="Next slide"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  )
}
