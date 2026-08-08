const STORAGE_KEY = "rtofa-saved-slugs"
const CHANGE_EVENT = "rtofa-saved-spots-changed"

function readSlugs(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : []
  } catch {
    return []
  }
}

function writeSlugs(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function getSavedSlugs(): string[] {
  return readSlugs()
}

export function isSavedSlug(slug: string): boolean {
  return readSlugs().includes(slug)
}

/** Returns true when saved after toggle, false when removed. */
export function toggleSavedSlug(slug: string): boolean {
  const set = new Set(readSlugs())
  if (set.has(slug)) {
    set.delete(slug)
    writeSlugs([...set])
    return false
  }
  set.add(slug)
  writeSlugs([...set])
  return true
}

export function subscribeSavedSpots(onChange: () => void): () => void {
  const handler = () => onChange()
  window.addEventListener(CHANGE_EVENT, handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler)
    window.removeEventListener("storage", handler)
  }
}

export function getSavedSpotsSnapshot(): string[] {
  return readSlugs()
}
