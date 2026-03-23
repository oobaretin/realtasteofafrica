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

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

/** Find next open day and its opening time. Returns null if none. */
function getNextOpenDay(hours: HoursMap, currentDay: string): { day: string; time: string } | null {
  const idx = DAY_ORDER.indexOf(currentDay)
  if (idx < 0) return null
  for (let i = 1; i <= 7; i++) {
    const nextIdx = (idx + i) % 7
    const day = DAY_ORDER[nextIdx]
    const h = hours[day]
    if (h && String(h).toLowerCase().trim() !== "closed" && parseTimeRange(h)) {
      const parts = h.replace(/\s*\([^)]*\)\s*/g, "").trim().split(/\s*[-–—]\s*/).map((s) => s.trim())
      return { day, time: parts[0] ?? "" }
    }
  }
  return null
}

/** Parse "11:00 AM - 10:00 PM" into open/close HHMM. Handles en-dash, em-dash, and strips parenthetical notes. */
function parseTimeRange(range: string): { open: number; close: number } | null {
  // Strip parenthetical notes like "(Saturday 12:00 PM start)" that break parsing
  const cleaned = range.replace(/\s*\([^)]*\)\s*/g, "").trim()
  // Split on hyphen, en-dash (–), or em-dash (—)
  const parts = cleaned.split(/\s*[-–—]\s*/).map((s) => s.trim())
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
    const nextOpen = getNextOpenDay(hours, currentDay)
    const label = nextOpen
      ? `Closed (Opens ${nextOpen.day} ${nextOpen.time})`
      : "Closed Today"
    return {
      status: "Closed",
      color: "text-red-500",
      label,
    }
  }

  // "Open 24 hours" or "24 hours"
  if (/open\s*24|24\s*hours?/i.test(todayHours)) {
    return {
      status: "Open Now",
      color: "text-green-500",
      label: "Open 24 hours",
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
  // Use same cleaning as parseTimeRange for display strings
  const cleanedHours = todayHours.replace(/\s*\([^)]*\)\s*/g, "").trim()
  const displayParts = cleanedHours.split(/\s*[-–—]\s*/).map((s) => s.trim())
  const openStr = displayParts[0] ?? ""
  const closeStr = displayParts[1] ?? ""

  // 12:00 AM (midnight) parses as 0; treat as 2400 for "open until midnight" comparison
  const closeForCheck = closeTime === 0 ? 2400 : closeTime

  // Late-night close (e.g. 11 AM - 2 AM): close < open means close is next day
  // Open if: (current >= open && current < midnight) OR (current < close, i.e. in the after-midnight window)
  const closesAfterMidnight = closeTime > 0 && closeTime < openTime
  const isOpen =
    (currentTime >= openTime && currentTime < (closesAfterMidnight ? 2400 : closeForCheck)) ||
    (closesAfterMidnight && currentTime < closeTime)

  if (isOpen) {
    const toMinutes = (hhmm: number) =>
      Math.floor(hhmm / 100) * 60 + (hhmm % 100)
    let minutesUntilClose: number
    if (closesAfterMidnight) {
      if (currentTime < closeTime) {
        minutesUntilClose = toMinutes(closeTime) - toMinutes(currentTime)
      } else {
        minutesUntilClose = toMinutes(2400) - toMinutes(currentTime) + toMinutes(closeTime)
      }
    } else {
      minutesUntilClose = toMinutes(closeForCheck) - toMinutes(currentTime)
    }
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

  // Closed: either before opening today, or after closing (use next open day)
  const isAfterClosing = !closesAfterMidnight && currentTime >= closeForCheck
  const nextOpen = isAfterClosing ? getNextOpenDay(hours, currentDay) : null
  const label = nextOpen
    ? `Closed (Opens ${nextOpen.day} ${nextOpen.time})`
    : `Closed (Opens ${openStr})`

  return {
    status: "Closed",
    color: "text-red-500",
    label,
  }
}
