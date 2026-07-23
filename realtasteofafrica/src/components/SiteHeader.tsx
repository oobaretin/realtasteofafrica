"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

type NavItem = { href: string; label: string }

const NAV_ITEMS: NavItem[] = [
  { href: "/restaurants", label: "Browse" },
  { href: "/collections", label: "Guides" },
  { href: "/contact", label: "Contact" },
]

function isActivePath(currentPath: string, href: string) {
  if (href === "/") return currentPath === "/"
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/"
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 items-center justify-between px-4 py-2">
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
            className="h-14 w-14 origin-left scale-110 rounded-md object-contain sm:h-16 sm:w-16 sm:scale-110 md:h-20 md:w-20 md:scale-110"
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
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50 md:hidden"
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
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
          </nav>
        </div>
      ) : null}
    </header>
  )
}

