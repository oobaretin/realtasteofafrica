"use client"

import { Share2 } from "lucide-react"
import { useCallback, useState } from "react"

const SHARE_TEXT = "Check out {name} on The Real Taste of Africa!"

export function ShareSpotButton({
  title,
  url,
  shareName,
  variant = "default",
}: {
  title: string
  url: string
  shareName: string
  variant?: "default" | "icon"
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
  const smsUrl = fullUrlForLinks
    ? `sms:?body=${encodeURIComponent(`${shareText} ${fullUrlForLinks}`)}`
    : "#"

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          onClick={handleShareClick}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-amber-200 hover:bg-amber-50/50 hover:text-amber-700"
          aria-label={`Share ${shareName}`}
        >
          <Share2 className="h-5 w-5" aria-hidden />
        </button>
        {open ? (
          <ShareSpotModal
            shareName={shareName}
            whatsappUrl={whatsappUrl}
            smsUrl={smsUrl}
            copied={copied}
            onCopy={handleCopyLink}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShareClick}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        aria-label="Share this listing"
      >
        Share
      </button>
      {open ? (
        <ShareSpotModal
          shareName={shareName}
          whatsappUrl={whatsappUrl}
          smsUrl={smsUrl}
          copied={copied}
          onCopy={handleCopyLink}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}

function ShareSpotModal({
  shareName,
  whatsappUrl,
  smsUrl,
  copied,
  onCopy,
  onClose,
}: {
  shareName: string
  whatsappUrl: string
  smsUrl: string
  copied: boolean
  onCopy: () => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-spot-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="share-spot-title" className="text-lg font-bold text-slate-900">
          Share this spot
        </h3>
        <p className="mt-1 text-sm text-slate-500">{shareName}</p>
        <div className="mt-5 grid gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            <span aria-hidden>💬</span>
            WhatsApp
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            <span aria-hidden>🔗</span>
            {copied ? "Link copied!" : "Copy link"}
          </button>
          <a
            href={smsUrl}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            <span aria-hidden>📱</span>
            SMS / Text
          </a>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </div>
  )
}
