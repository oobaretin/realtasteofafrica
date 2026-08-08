"use client"

import { Heart } from "lucide-react"
import { useSyncExternalStore } from "react"

import {
  getSavedSpotsSnapshot,
  isSavedSlug,
  subscribeSavedSpots,
  toggleSavedSlug,
} from "@/lib/savedSpots"

export function SaveSpotButton({
  slug,
  name,
  variant = "default",
}: {
  slug: string
  name: string
  variant?: "default" | "compact"
}) {
  useSyncExternalStore(subscribeSavedSpots, getSavedSpotsSnapshot, () => [])
  const saved = isSavedSlug(slug)
  const isCompact = variant === "compact"

  return (
    <button
      type="button"
      onClick={() => toggleSavedSlug(slug)}
      className={
        isCompact
          ? `inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 px-3 text-sm font-semibold ${
              saved
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-slate-200 bg-white text-slate-800"
            }`
          : `inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${
              saved
                ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`
      }
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved spots` : `Save ${name}`}
    >
      <Heart
        className={`h-4 w-4 shrink-0 ${saved ? "fill-amber-600 text-amber-600" : ""}`}
        aria-hidden
      />
      {isCompact ? (saved ? "Saved" : "Save") : saved ? "Saved" : "Save spot"}
    </button>
  )
}
