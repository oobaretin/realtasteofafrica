"use client"

import { useEffect, useMemo, useState } from "react"

import { CONTACT_EMAIL } from "@/lib/site"

const ISSUE_OPTIONS = [
  { value: "", label: "Choose an issue type" },
  { value: "Report a Closure", label: "Report a Closure" },
  { value: "Correction", label: "Correction" },
  { value: "Share your experience", label: "Share your experience" },
  { value: "Business Claim", label: "Business Claim" },
] as const

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

function buildMailtoHref({
  issue,
  restaurantName,
  senderEmail,
  message,
}: {
  issue: string
  restaurantName: string
  senderEmail: string
  message: string
}) {
  const subject = `${issue} – Real Taste of Africa`
  const bodyParts = [
    restaurantName.trim() ? `Restaurant: ${restaurantName.trim()}` : null,
    senderEmail.trim() ? `Your email: ${senderEmail.trim()}` : null,
    "",
    message.trim(),
  ].filter((line): line is string => typeof line === "string")
  const body = bodyParts.join("\n")
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function ContactFormUnified({
  initialRestaurantName = "",
  initialIssue = "",
}: {
  initialRestaurantName?: string
  initialIssue?: string
}) {
  const [issue, setIssue] = useState(initialIssue)
  const [restaurantName, setRestaurantName] = useState(initialRestaurantName)
  const [senderEmail, setSenderEmail] = useState("")
  const [message, setMessage] = useState("")
  const [messageFocused, setMessageFocused] = useState(false)
  const [restaurantFocused, setRestaurantFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)

  useEffect(() => {
    setRestaurantName(initialRestaurantName)
  }, [initialRestaurantName])

  useEffect(() => {
    if (initialIssue) setIssue(initialIssue)
  }, [initialIssue])

  const mailtoHref = useMemo(
    () => buildMailtoHref({ issue, restaurantName, senderEmail, message }),
    [issue, restaurantName, senderEmail, message]
  )

  const missingRequired = !issue.trim() || !message.trim()

  return (
    <section
      id="report"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8"
    >
      <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
        Report or correct a listing
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Submit opens your email app with a pre-filled message to{" "}
        <a className="font-medium text-amber-700 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <form
        className="mt-6 grid gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (missingRequired) return
          window.location.href = mailtoHref
        }}
      >
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

        <p className="text-xs text-slate-500">
          Include business name, address, or details so we can act quickly.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={missingRequired}
            className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Open email to send
          </button>
          <a
            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
            href={mailtoHref}
          >
            Open email instead →
          </a>
        </div>

        {missingRequired ? (
          <p className="text-xs text-slate-500">Required: issue type and message.</p>
        ) : null}
      </form>
    </section>
  )
}
