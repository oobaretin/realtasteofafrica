/**
 * Prestigious "Real Taste Verified" badge for claimed listings.
 * Soft gold (#D4AF37) with shield icon for an official look.
 */

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide shadow-sm ${className}`}
      style={{
        borderColor: "rgba(212, 175, 55, 0.5)",
        backgroundColor: "rgba(212, 175, 55, 0.12)",
        color: "#8B6914",
      }}
      title="This listing has been claimed and verified by the business"
    >
      <svg
        className="h-3.5 w-3.5 shrink-0"
        style={{ color: "#D4AF37" }}
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
      <span>Real Taste Verified</span>
    </span>
  )
}
