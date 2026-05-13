"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"

export type HeroSlide = { src: string; alt: string }

export function CollectionHero({
  slides,
  jollofFullHero,
  title,
  dek,
}: {
  slides: HeroSlide[]
  jollofFullHero: boolean
  title: string
  dek: string
}) {
  const loop = slides.length > 1
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: "start",
    duration: 22,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const shellClass = jollofFullHero
    ? "relative -mx-4 h-[min(85vh,900px)] min-h-[320px] w-full overflow-hidden rounded-none bg-slate-950 sm:mx-0 sm:rounded-2xl"
    : "relative -mx-4 aspect-[21/9] min-h-[180px] overflow-hidden rounded-none bg-slate-900 sm:mx-0 sm:rounded-2xl sm:aspect-[2.4/1]"

  const imageClass = jollofFullHero ? "object-contain object-center" : "object-cover"

  const gradientClass = jollofFullHero
    ? "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/10"
    : "absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"

  return (
    <div className={shellClass}>
      <Link
        href="/collections"
        className="absolute left-3 top-3 z-30 inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full bg-black/40 px-3 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent sm:left-4 sm:top-4"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        <span className="pr-0.5">All guides</span>
      </Link>

      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div
              key={`${slide.src}-${i}`}
              className="relative h-full min-h-0 flex-[0_0_100%]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className={imageClass}
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {loop ? (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/45 p-2.5 text-white ring-1 ring-white/30 backdrop-blur-sm transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:left-4"
            aria-label="Previous hero image"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/45 p-2.5 text-white ring-1 ring-white/30 backdrop-blur-sm transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:right-4"
            aria-label="Next hero image"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        </>
      ) : null}

      <div className={gradientClass} aria-hidden />

      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95">Editor’s pick</p>
        <h1 className="mt-2 max-w-4xl font-serif text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">{dek}</p>
      </div>
    </div>
  )
}
