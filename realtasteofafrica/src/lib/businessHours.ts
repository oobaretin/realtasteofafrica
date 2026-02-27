/**
 * Business hours utility: compares current Texas time to stored hours.
 * Use for "Open Now" / "Closed" / "Closing Soon" badges.
 */

const TEXAS_TZ = "America/Chicago"

export type HoursMap = { [key: string]: string }

export type BusinessStatus =
  | { status: "Open Now"; color: string; label: string }
  | { status: "Closing Soon"; color: string; label: string }
  | { status: "Closed"; color: string; label: string }
  | { status: "Unverified"; color: string; label: string }

/** Get current day name and time (HHMM) in Texas. */
function getTexasNow(): { day: string; timeHHMM: number } {
  const now = new Date()
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: TEXAS_TZ,
    weekday: "long",
  }).format(now)
  const hour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TEXAS_TZ,
      hour: "2-digit",
      hour12: false,
    }).format(now),
    10
  )
  const minute = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TEXAS_TZ,
      minute: "2-digit",
    }).format(now),
    10
  )
  return { day, timeHHMM: hour * 100 + minute }
}

/** Parse "11:00 AM - 10:00 PM" into open/close HHMM. */
function parseTimeRange(range: string): { open: number; close: number } | null {
  const parts = range.split("-").map((s) => s.trim())
  if (parts.length < 2) return null
  const open = parseTime(parts[0])
  const close = parseTime(parts[1])
  if (open == null || close == null) return null
  return { open, close }
}

/** Parse "11:00 AM" or "10:00 PM" to HHMM (e.g. 2300 for 11 PM). */
function parseTime(timeStr: string): number | null {
  const match = timeStr.match(/^\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*$/i)
  if (!match) return null
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2] ?? "0", 10)
  const modifier = (match[3] ?? "").toUpperCase()
  if (modifier === "PM" && hours < 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0
  return hours * 100 + minutes
}

/**
 * Compare current Texas time to the restaurant's stored hours.
 * If hours are missing or invalid, returns Unverified (no status badge shown).
 */
export function getBusinessStatus(hours: HoursMap | undefined | null): BusinessStatus {
  if (!hours || typeof hours !== "object" || Object.keys(hours).length === 0) {
    return {
      status: "Unverified",
      color: "text-slate-500",
      label: "Call for hours",
    }
  }

  const { day: currentDay, timeHHMM: currentTime } = getTexasNow()
  const todayHours = hours[currentDay]

  if (!todayHours || String(todayHours).toLowerCase().trim() === "closed") {
    return {
      status: "Closed",
      color: "text-red-500",
      label: "Closed Today",
    }
  }

  const parsed = parseTimeRange(todayHours)
  if (!parsed) {
    return {
      status: "Unverified",
      color: "text-slate-500",
      label: "Call for hours",
    }
  }

  const { open: openTime, close: closeTime } = parsed
  const openStr = todayHours.split("-").map((s) => s.trim())[0] ?? ""
  const closeStr = todayHours.split("-").map((s) => s.trim())[1] ?? ""

  // 12:00 AM (midnight) parses as 0; treat as 2400 for "open until midnight" comparison
  const closeForCheck = closeTime === 0 ? 2400 : closeTime

  if (currentTime >= openTime && currentTime < closeForCheck) {
    const toMinutes = (hhmm: number) =>
      Math.floor(hhmm / 100) * 60 + (hhmm % 100)
    const minutesUntilClose = toMinutes(closeForCheck) - toMinutes(currentTime)
    if (minutesUntilClose > 0 && minutesUntilClose < 60) {
      return {
        status: "Closing Soon",
        color: "text-orange-500",
        label: `Open until ${closeStr}`,
      }
    }
    return {
      status: "Open Now",
      color: "text-green-500",
      label: `Open until ${closeStr}`,
    }
  }

  return {
    status: "Closed",
    color: "text-red-500",
    label: `Closed (Opens ${openStr})`,
  }
}
