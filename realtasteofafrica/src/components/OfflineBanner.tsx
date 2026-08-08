"use client"

import { useEffect, useState } from "react"

export function OfflineBanner() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine)
    sync()
    window.addEventListener("online", sync)
    window.addEventListener("offline", sync)
    return () => {
      window.removeEventListener("online", sync)
      window.removeEventListener("offline", sync)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950"
      role="status"
    >
      You&apos;re offline — saved picks may still work; listings and maps need a connection.
    </div>
  )
}
