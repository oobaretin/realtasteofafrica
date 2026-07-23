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
