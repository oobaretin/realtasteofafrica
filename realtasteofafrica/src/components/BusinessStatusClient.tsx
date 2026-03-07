"use client"

import { useEffect, useState } from "react"
import {
  getBusinessStatus,
  type BusinessStatus,
  type HoursMap,
} from "@/lib/businessHours"

/** Recomputes status on mount so it reflects the user's current time (fixes static pages). */
export function useBusinessStatus(hours: HoursMap | undefined | null): BusinessStatus {
  const [status, setStatus] = useState<BusinessStatus>(() => getBusinessStatus(hours))
  useEffect(() => {
    setStatus(getBusinessStatus(hours))
  }, [hours])
  return status
}

/**
 * Client-side business status display. Recomputes on mount so status reflects
 * the user's current time, not build/request time (fixes static pages showing
 * stale Open/Closed state).
 */
export function BusinessStatusClient({
  hours,
  variant = "badge",
}: {
  hours: HoursMap | undefined | null
  variant?: "badge" | "label"
}) {
  const [status, setStatus] = useState<BusinessStatus | null>(() =>
    getBusinessStatus(hours)
  )

  useEffect(() => {
    setStatus(getBusinessStatus(hours))
  }, [hours])

  if (!status) return null

  if (status.status === "Unverified") {
    if (variant === "label")
      return (
        <p className={`mt-2 text-sm font-medium ${status.color}`}>{status.label}</p>
      )
    return null
  }

  if (variant === "badge") {
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${status.status === "Open Now" ? "animate-pulse-subtle bg-green-100 text-green-800" : status.status === "Closing Soon" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}
        aria-live="polite"
      >
        {status.status === "Open Now" ? "● " : null}
        {status.status}
      </span>
    )
  }

  return (
    <p className={`mt-2 text-sm font-medium ${status.color}`}>{status.label}</p>
  )
}
