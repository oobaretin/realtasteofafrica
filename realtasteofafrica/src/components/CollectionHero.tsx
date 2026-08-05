"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState, type ReactNode } from "react"
import useEmblaCarousel from "embla-carousel-react"

import type { CollectionHeroImage } from "@/data/collections"

function slideImageClass(slide: CollectionHeroImage, jollofFullHero: boolean): string {
  const fit = slide.objectFit ?? (jollofFullHero ? "contain" : "cover")
  return fit === "cover"
    ? "object-cover object-center h-full w-full"
    : "object-contain object-center"
}

function HeroChrome({
  jollofFullHero,
  jollofFullViewport,
  title,
  dek,
  children,
}: {
  jollofFullHero: boolean
  /** Taller near-full viewport shell when the active slide is a full-bleed (`cover`) image */
  jollofFullViewport?: boolean
  title: string
  dek: string
  children: ReactNode
}) {
  const shellClass =
    jollofFullHero && jollofFullViewport
      ? "relative -mx-4 h-[min(100svh,920px)] min-h-[360px] w-full overflow-hidden rounded-none bg-slate-950 sm:mx-0 sm:rounded-2xl"
      : jollofFullHero
        ? "relative -mx-4 h-[min(85vh,900px)] min-h-[320px] w-full overflow-hidden rounded-none bg-slate-950 sm:mx-0 sm:rounded-2xl"
        : "relative -mx-4 aspect-[21/9] min-h-[180px] overflow-hidden rounded-none bg-slate-900 sm:mx-0 sm:rounded-2xl sm:aspect-[2.4/1]"

  const gradientClass =
    jollofFullHero && jollofFullViewport
      ? "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent"
      : jollofFullHero
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

      {children}

      <div className={gradientClass} aria-hidden />

      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/95">Editor’s pick</p>
        <h1 className="mt-2 max-w-4xl font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">{dek}</p>
      </div>
    </div>
  )
}

function HeroSingleImage({
  slide,
  jollofFullHero,
}: {
  slide: CollectionHeroImage
  jollofFullHero: boolean
}) {
  return (
    <div className="absolute inset-0">
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        className={slideImageClass(slide, jollofFullHero)}
        sizes="100vw"
        priority
      />
    </div>
  )
}

function HeroEmblaCarousel({
  slides,
  jollofFullHero,
  onSlideIndexChange,
}: {
  slides: CollectionHeroImage[]
  jollofFullHero: boolean
  onSlideIndexChange?: (index: number) => void
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    // Loop clones slides; with 1–2 slides that can look like a "double" image — enable loop for 3+ only.
    loop: slides.length > 2,
    align: "start",
    duration: 22,
  })

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      const i = emblaApi.selectedScrollSnap()
      onSlideIndexChange?.(i)
    }
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSlideIndexChange])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <>
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div
              key={`${slide.src}-${i}`}
              className="relative h-full min-h-0 min-w-0 flex-[0_0_100%]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className={slideImageClass(slide, jollofFullHero)}
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

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
  )
}

export function CollectionHero({
  slides,
  jollofFullHero,
  title,
  dek,
}: {
  slides: CollectionHeroImage[]
  jollofFullHero: boolean
  title: string
  dek: string
}) {
  const single = slides[0]

  if (!single) {
    return (
      <HeroChrome
        jollofFullHero={jollofFullHero}
        jollofFullViewport={false}
        title={title}
        dek={dek}
      >
        <div className="absolute inset-0 bg-slate-900" aria-hidden />
      </HeroChrome>
    )
  }

  if (slides.length === 1) {
    const fullViewport =
      jollofFullHero &&
      (single.objectFit === "cover" || single.tallHero === true)

    return (
      <HeroChrome
        jollofFullHero={jollofFullHero}
        jollofFullViewport={fullViewport}
        title={title}
        dek={dek}
      >
        <HeroSingleImage slide={single} jollofFullHero={jollofFullHero} />
      </HeroChrome>
    )
  }

  return <HeroMultiSlide chrome={{ jollofFullHero, title, dek }} slides={slides} />
}

function HeroMultiSlide({
  slides,
  chrome,
}: {
  slides: CollectionHeroImage[]
  chrome: { jollofFullHero: boolean; title: string; dek: string }
}) {
  const { jollofFullHero, title, dek } = chrome
  const [slideIndex, setSlideIndex] = useState(0)
  const active = slides[slideIndex]
  const jollofFullViewport = Boolean(
    jollofFullHero && (active?.objectFit === "cover" || active?.tallHero === true),
  )

  return (
    <HeroChrome
      jollofFullHero={jollofFullHero}
      jollofFullViewport={jollofFullViewport}
      title={title}
      dek={dek}
    >
      <HeroEmblaCarousel
        slides={slides}
        jollofFullHero={jollofFullHero}
        onSlideIndexChange={setSlideIndex}
      />
    </HeroChrome>
  )
}
