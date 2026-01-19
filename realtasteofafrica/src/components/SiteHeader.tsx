"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"

type NavItem = { href: string; label: string }

const NAV_ITEMS: NavItem[] = [
  { href: "/restaurants", label: "Browse" },
  { href: "/areas/houston", label: "Houston Area" },
  { href: "/contact", label: "Contact" },
]

function isActivePath(currentPath: string, href: string) {
  if (href === "/") return currentPath === "/"
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/"
  const [isOpen, setIsOpen] = useState(false)

  const activeLabel = useMemo(() => {
    const active = NAV_ITEMS.find((i) => isActivePath(pathname, i.href))
    return active?.label ?? "Home"
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2">
        <Link
          className="group inline-flex items-center"
          href="/"
          onClick={() => setIsOpen(false)}
          aria-label="Real Taste of Africa"
        >
          <Image
            src="/realtasteofafrica.png"
            alt="Real Taste of Africa"
            width={224}
            height={224}
            priority
            className="h-16 w-16 origin-left scale-125 rounded-md object-contain sm:h-20 sm:w-20 sm:scale-125 md:h-24 md:w-24 md:scale-125"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.href}
                className={[
                  "rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
                href={item.href}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            className="ml-2 rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            href="/restaurants"
          >
            Search
          </Link>
        </nav>

        <button
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 md:hidden"
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="text-slate-500">Browse:</span> {activeLabel}
        </button>
      </div>

      {isOpen ? (
        <div id="mobile-nav" className="border-t border-slate-200 md:hidden">
          <nav className="mx-auto grid w-full max-w-6xl gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  className={[
                    "rounded-md px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-800 hover:bg-slate-50",
                  ].join(" ")}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              className="mt-1 rounded-md bg-amber-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
              href="/restaurants"
              onClick={() => setIsOpen(false)}
            >
              Search
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

