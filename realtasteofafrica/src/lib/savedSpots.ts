const STORAGE_KEY = "rtofa-saved-slugs"
const CHANGE_EVENT = "rtofa-saved-spots-changed"
const EMPTY_SNAPSHOT: string[] = []

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

export function clearSavedSpots(): void {
  if (typeof window === "undefined") return
  writeSlugs([])
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

/** Stable reference when contents unchanged — required by useSyncExternalStore. */
export function getSavedSpotsSnapshot(): string[] {
  const slugs = readSlugs()
  const key = JSON.stringify(slugs)
  if (key === cachedSnapshotKey) return cachedSnapshot
  cachedSnapshotKey = key
  cachedSnapshot = slugs.length === 0 ? EMPTY_SNAPSHOT : slugs
  return cachedSnapshot
}

export function getSavedSpotsServerSnapshot(): string[] {
  return EMPTY_SNAPSHOT
}
