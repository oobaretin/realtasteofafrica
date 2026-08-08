"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSyncExternalStore } from "react"

import { getSavedSpotsServerSnapshot, getSavedSpotsSnapshot, subscribeSavedSpots } from "@/lib/savedSpots"

function isActivePath(currentPath: string, href: string) {
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

export function SavedNavLink({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/"
  const slugs = useSyncExternalStore(
    subscribeSavedSpots,
    getSavedSpotsSnapshot,
    getSavedSpotsServerSnapshot
  )
  const active = isActivePath(pathname, "/saved")
  const count = slugs.length

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
      Saved
      {count > 0 ? (
        <span className="ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-amber-900">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  )
}
