"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSyncExternalStore } from "react"

import { getSavedSpotsServerSnapshot, getSavedSpotsSnapshot, subscribeSavedSpots } from "@/lib/savedSpots"
import {
  getRecentlyViewedServerSnapshot,
  getRecentlyViewedSnapshot,
  subscribeRecentlyViewed,
} from "@/lib/recentlyViewed"

function isActivePath(currentPath: string, href: string) {
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

function pickCount(saved: string[], recent: string[]): number {
  return new Set([...saved, ...recent]).size
}

export function SavedNavLink({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/"
  const saved = useSyncExternalStore(
    subscribeSavedSpots,
    getSavedSpotsSnapshot,
    getSavedSpotsServerSnapshot
  )
  const recent = useSyncExternalStore(
    subscribeRecentlyViewed,
    getRecentlyViewedSnapshot,
    getRecentlyViewedServerSnapshot
  )
  const active = isActivePath(pathname, "/saved")
  const count = pickCount(saved, recent)

  return (
    <Link
      href="/saved"
      onClick={onNavigate}
      className={[
        "relative rounded-md px-3 py-2 text-sm transition",
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      Your picks
      {count > 0 ? (
        <span className="ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-amber-900">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  )
}
