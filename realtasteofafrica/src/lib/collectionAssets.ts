import fs from "node:fs"
import path from "node:path"

import type { CollectionHeroImage, EditorialCollection } from "@/data/collections"

/** Shown when no custom hero files exist */
export const COLLECTION_HERO_FALLBACK = "/realtasteofafrica.png"

/** True if `public{urlPath}` exists (urlPath like `/collections/foo.jpg`). */
export function publicFileExists(urlPath: string): boolean {
  if (!urlPath.startsWith("/")) return false
  const relative = urlPath.slice(1)
  const full = path.join(process.cwd(), "public", relative)
  try {
    return fs.existsSync(full) && fs.statSync(full).isFile()
  } catch {
    return false
  }
}

/** Hero slide list: primary `headerImage` plus optional `headerExtraSlides`; only paths that exist. */
export function resolveHeroSlides(c: EditorialCollection): CollectionHeroImage[] {
  const slides: CollectionHeroImage[] = []
  const seen = new Set<string>()
  const tryPush = (slide: CollectionHeroImage) => {
    if (!publicFileExists(slide.src) || seen.has(slide.src)) return
    seen.add(slide.src)
    slides.push(slide)
  }
  tryPush(c.headerImage)
  for (const s of c.headerExtraSlides ?? []) tryPush(s)
  if (slides.length === 0) {
    return [{ src: COLLECTION_HERO_FALLBACK, alt: c.headerImage.alt }]
  }
  return slides
}
