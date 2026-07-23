"use client"

import { useCallback, useEffect, useState } from "react"

import { TurnstileWidget } from "@/components/TurnstileWidget"
import { CONTACT_EMAIL } from "@/lib/site"

const ISSUE_OPTIONS = [
  { value: "", label: "Choose an issue type" },
  { value: "Report a Closure", label: "Report a Closure" },
  { value: "Correction", label: "Correction" },
  { value: "Business Claim", label: "Business Claim" },
] as const

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""

function FloatingLabel({
  id,
  label,
  value,
  focused,
  children,
}: {
  id: string
  label: string
  value: string
  focused: boolean
  children: React.ReactNode
}) {
  const floated = focused || value.length > 0
  return (
    <div className="relative">
      {children}
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-3 transition-all duration-200 ${
          floated
            ? "top-1.5 text-xs font-medium text-amber-600"
            : "top-4 text-sm text-slate-500"
        }`}
      >
        {label}
      </label>
    </div>
  )
}

export function ContactFormUnified({
  initialRestaurantName = "",
}: {
  initialRestaurantName?: string
}) {
  const [issue, setIssue] = useState("")
  const [restaurantName, setRestaurantName] = useState(initialRestaurantName)
  const [senderEmail, setSenderEmail] = useState("")
  const [message, setMessage] = useState("")
  const [messageFocused, setMessageFocused] = useState(false)
  const [restaurantFocused, setRestaurantFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [turnstileMountKey, setTurnstileMountKey] = useState(0)

  useEffect(() => {
    setRestaurantName(initialRestaurantName)
  }, [initialRestaurantName])

  const resetTurnstile = useCallback(() => {
    setTurnstileToken("")
    setTurnstileMountKey((k) => k + 1)
  }, [])

  const onTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const onTurnstileExpire = useCallback(() => {
    setTurnstileToken("")
  }, [])

  const missingRequired =
    !issue.trim() || !message.trim() || (!!TURNSTILE_SITE_KEY && !turnstileToken)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (missingRequired || status === "loading") return

    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue,
          restaurantName,
          message,
          senderEmail,
          turnstileToken,
        }),
      })

      const data = (await res.json()) as { success?: boolean; error?: string }

      if (!res.ok || !data.success) {
        setStatus("error")
        setErrorMessage(data.error || "Could not send your message. Please try again.")
        resetTurnstile()
        return
      }

      setStatus("success")
      setIssue("")
      setMessage("")
      setSenderEmail("")
      setRestaurantName("")
      resetTurnstile()
    } catch {
      setStatus("error")
      setErrorMessage("Network error. Check your connection and try again.")
      resetTurnstile()
    }
  }

  if (status === "success") {
    return (
      <section
        id="report"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-lg md:p-8"
      >
        <h2 className="text-xl font-bold tracking-tight text-emerald-900 md:text-2xl">
          Message sent
        </h2>
        <p className="mt-2 text-sm text-emerald-900/80">
          Thanks for helping keep the directory accurate. We&apos;ll review your report and follow
          up if needed.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
        >
          Send another message
        </button>
      </section>
    )
  }

  return (
    <section
      id="report"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8"
    >
      <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
        Report or correct a listing
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Submit the form and we&apos;ll email our team at{" "}
        <a className="font-medium text-amber-700 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        . Protected by Cloudflare Turnstile.
      </p>

      {!TURNSTILE_SITE_KEY ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Contact form is not fully configured yet. Set{" "}
          <code className="text-xs">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> and Cloudflare email
          env vars in production.
        </p>
      ) : null}

      <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
        <div className="relative">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Issue type <span className="text-amber-700">*</span>
          </span>
          <select
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
            aria-label="Issue type"
            required
          >
            {ISSUE_OPTIONS.map((opt) => (
              <option key={opt.value || "empty"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <FloatingLabel
            id="contact-restaurant"
            label="Restaurant name (if reporting a specific listing)"
            value={restaurantName}
            focused={restaurantFocused}
          >
            <input
              type="text"
              id="contact-restaurant"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              onFocus={() => setRestaurantFocused(true)}
              onBlur={() => setRestaurantFocused(false)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pt-6 pl-3 pr-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder=" "
            />
          </FloatingLabel>
        </div>

        <div className="relative">
          <FloatingLabel
            id="contact-email"
            label="Your email (optional, for follow-up)"
            value={senderEmail}
            focused={emailFocused}
          >
            <input
              type="email"
              id="contact-email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoComplete="email"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pt-6 pl-3 pr-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder=" "
            />
          </FloatingLabel>
        </div>

        <div className="relative">
          <FloatingLabel
            id="contact-message"
            label="Your message or correct information"
            value={message}
            focused={messageFocused}
          >
            <textarea
              id="contact-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setMessageFocused(true)}
              onBlur={() => setMessageFocused(false)}
              className="block w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 pt-6 pb-3 pl-3 pr-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder=" "
              required
            />
          </FloatingLabel>
        </div>

        {TURNSTILE_SITE_KEY ? (
          <TurnstileWidget
            key={turnstileMountKey}
            siteKey={TURNSTILE_SITE_KEY}
            onVerify={onTurnstileVerify}
            onExpire={onTurnstileExpire}
            onError={onTurnstileExpire}
          />
        ) : null}

        <p className="text-xs text-slate-500">
          Include business name, address, or details so we can act quickly.
        </p>

        {status === "error" && errorMessage ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={missingRequired || status === "loading" || !TURNSTILE_SITE_KEY}
            className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>
        </div>

        {missingRequired ? (
          <p className="text-xs text-slate-500">
            Required: issue type, message
            {TURNSTILE_SITE_KEY ? ", and security check" : ""}.
          </p>
        ) : null}
      </form>
    </section>
  )
}
