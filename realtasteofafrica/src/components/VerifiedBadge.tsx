/**
 * "Real Taste Verified" badge for claimed listings — gold shield.
 */

import Link from "next/link"

export function VerifiedBadge({
  className = "",
  variant = "default",
  linkToTrust = false,
}: {
  className?: string
  variant?: "default" | "prominent"
  /** When true, badge links to /trust for explanation */
  linkToTrust?: boolean
}) {
  const isProminent = variant === "prominent"
  const inner = (
    <>
      <svg
        className={`${isProminent ? "h-5 w-5" : "h-3.5 w-3.5"} shrink-0 text-[#5C4A0E]`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span className="font-bold">Real Taste Verified</span>
    </>
  )

  const badgeClass = `inline-flex items-center gap-2 rounded-full border-2 font-semibold tracking-wide shadow-md ${
    isProminent
      ? "border-[#6B5414] bg-[#D4AF37] px-3 py-1.5 text-sm text-[#1a1408] ring-2 ring-[#D4AF37]/40"
      : "border-[rgba(212,175,55,0.55)] bg-[rgba(212,175,55,0.12)] px-2.5 py-1 text-xs text-[#8B6914]"
  } ${className}`

  if (linkToTrust) {
    return (
      <Link
        href="/trust#owner"
        className={`${badgeClass} transition hover:brightness-105`}
        title="Owner verified — learn what this means"
      >
        {inner}
      </Link>
    )
  }

  return (
    <span
      className={badgeClass}
      title="This listing has been claimed and verified by the business"
    >
      {inner}
    </span>
  )
}
