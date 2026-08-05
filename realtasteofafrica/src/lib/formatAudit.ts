/** Whether to show the directory audit badge on a listing. */
export function showDirectoryVerifiedBadge(r: {
  lastAuditDate?: string
  internalVerified?: boolean
}): boolean {
  return Boolean(r.lastAuditDate?.trim()) || r.internalVerified === true
}

/** e.g. "Directory verified · Jul 2026" */
export function formatDirectoryVerifiedLabel(lastAuditDate?: string): string {
  if (!lastAuditDate?.trim()) return "Directory verified"
  const d = new Date(`${lastAuditDate.trim()}T12:00:00`)
  if (Number.isNaN(d.getTime())) return "Directory verified"
  const month = d.toLocaleString("en-US", { month: "short" })
  const year = d.getFullYear()
  return `Directory verified · ${month} ${year}`
}

/** Human-readable audit line for listing detail. */
export function formatDirectoryVerifiedDetail(lastAuditDate?: string): string {
  if (!lastAuditDate?.trim()) {
    return "We checked hours and contact details for this listing."
  }
  const d = new Date(`${lastAuditDate.trim()}T12:00:00`)
  if (Number.isNaN(d.getTime())) {
    return "We checked hours and contact details for this listing."
  }
  const month = d.toLocaleString("en-US", { month: "long" })
  const year = d.getFullYear()
  return `We checked hours and phone in ${month} ${year}.`
}

/** Latest audit month across listings, e.g. "July 2026". */
export function formatLatestAuditMonth(
  restaurants: { lastAuditDate?: string }[]
): string {
  const dates = restaurants
    .map((r) => r.lastAuditDate?.trim())
    .filter((d): d is string => Boolean(d))
    .sort()
  const latest = dates.at(-1)
  if (!latest) return "Recently"
  const d = new Date(`${latest}T12:00:00`)
  if (Number.isNaN(d.getTime())) return "Recently"
  return d.toLocaleString("en-US", { month: "long", year: "numeric" })
}

export function countAuditedListings(
  restaurants: { lastAuditDate?: string; internalVerified?: boolean }[]
): number {
  return restaurants.filter((r) => showDirectoryVerifiedBadge(r)).length
}
