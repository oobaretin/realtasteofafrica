"use client"

import { useState, useCallback } from "react"

const SHARE_TEXT = "Check out {name} on The Real Taste of Africa!"

export function ShareButton({
  title,
  url,
  shareName,
}: {
  title: string
  url: string
  shareName: string
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareText = SHARE_TEXT.replace("{name}", shareName)

  const getFullUrl = useCallback(() => {
    if (url.startsWith("http")) return url
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    return `${origin}${url.startsWith("/") ? url : `/${url}`}`
  }, [url])

  const handleShareClick = useCallback(() => {
    const fullUrl = getFullUrl()
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${title} | The Real Taste of Africa`,
          text: shareText,
          url: fullUrl,
        })
        .then(() => setOpen(false))
        .catch(() => setOpen(true))
    } else {
      setOpen(true)
    }
  }, [title, shareText, getFullUrl])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setOpen(true)
    }
  }, [getFullUrl])

  const fullUrlForLinks = open ? getFullUrl() : ""
  const whatsappUrl = fullUrlForLinks
    ? `https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrlForLinks}`)}`
    : "#"
  const smsUrl = fullUrlForLinks ? `sms:?body=${encodeURIComponent(`${shareText} ${fullUrlForLinks}`)}` : "#"

  return (
    <>
      <button
        type="button"
        onClick={handleShareClick}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        aria-label="Share this listing"
      >
        <ShareIcon className="h-5 w-5 text-slate-500" />
        Share
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="share-modal-title" className="text-lg font-bold text-slate-900">
              Share this spot
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {shareName}
            </p>
            <div className="mt-5 grid gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                <span className="text-xl" aria-hidden>💬</span>
                WhatsApp
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                <span className="text-xl" aria-hidden>🔗</span>
                <span className={copied ? "animate-fade-in" : ""}>
                  {copied ? "✅ Link Copied!" : "Copy Link"}
                </span>
              </button>
              <a
                href={smsUrl}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                <span className="text-xl" aria-hidden>📱</span>
                SMS / Text
              </a>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  )
}
