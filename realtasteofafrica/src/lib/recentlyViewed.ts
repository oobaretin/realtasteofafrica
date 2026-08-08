const STORAGE_KEY = "rtofa-recent-slugs"
const CHANGE_EVENT = "rtofa-recently-viewed-changed"
const EMPTY_SNAPSHOT: string[] = []
const MAX_RECENT = 6

let cachedSnapshot: string[] = EMPTY_SNAPSHOT
let cachedSnapshotKey = "[]"

function readSlugs(): string[] {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_SNAPSHOT
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string")
      : EMPTY_SNAPSHOT
  } catch {
    return EMPTY_SNAPSHOT
  }
}

function invalidateSnapshotCache() {
  cachedSnapshotKey = ""
}

function writeSlugs(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  invalidateSnapshotCache()
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Move slug to front; cap list at MAX_RECENT. */
export function recordRecentlyViewed(slug: string): void {
  if (typeof window === "undefined" || !slug.trim()) return
  const trimmed = slug.trim()
  const next = [trimmed, ...readSlugs().filter((s) => s !== trimmed)].slice(0, MAX_RECENT)
  writeSlugs(next)
}

export function subscribeRecentlyViewed(onChange: () => void): () => void {
  const handler = () => onChange()
  window.addEventListener(CHANGE_EVENT, handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler)
    window.removeEventListener("storage", handler)
  }
}

export function getRecentlyViewedSnapshot(): string[] {
  const slugs = readSlugs()
  const key = JSON.stringify(slugs)
  if (key === cachedSnapshotKey) return cachedSnapshot
  cachedSnapshotKey = key
  cachedSnapshot = slugs.length === 0 ? EMPTY_SNAPSHOT : slugs
  return cachedSnapshot
}

export function getRecentlyViewedServerSnapshot(): string[] {
  return EMPTY_SNAPSHOT
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return
  writeSlugs([])
}
