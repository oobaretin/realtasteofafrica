"use client"

import { useState, useRef } from "react"
import { CONTACT_EMAIL } from "@/lib/site"

const ISSUE_OPTIONS = [
  { value: "", label: "Choose an issue type" },
  { value: "Report a Closure", label: "Report a Closure" },
  { value: "Correction", label: "Correction" },
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

export function ContactFormUnified() {
  const [issue, setIssue] = useState("")
  const [message, setMessage] = useState("")
  const [messageFocused, setMessageFocused] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const mailtoRef = useRef<HTMLAnchorElement>(null)

  const subject = issue ? `${issue} – Real Taste of Africa` : "Directory inquiry – Real Taste of Africa"
  const body = message.trim() || "(No message provided)"
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowThankYou(true)
  }

  const handleSendEmail = () => {
    mailtoRef.current?.click()
    setShowThankYou(false)
  }

  return (
    <>
      <section
        id="report"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8"
      >
        <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          Report or correct a listing
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Help us keep the directory accurate. We audit every submission within 24 hours.
        </p>

        <form className="mt-6 grid gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Issue type
            </span>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              aria-label="Issue type"
            >
              {ISSUE_OPTIONS.map((opt) => (
                <option key={opt.value || "empty"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute right-3 top-[2.6rem] text-slate-400"
              aria-hidden
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
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
              />
            </FloatingLabel>
          </div>

          <p className="text-xs text-slate-500">
            Include business name, address, or details so we can act quickly.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              Submit
            </button>
          </div>
        </form>
      </section>

      <a ref={mailtoRef} href={mailtoHref} className="hidden" aria-hidden>
        Send email
      </a>

      {showThankYou ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="thank-you-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 id="thank-you-title" className="text-lg font-bold text-slate-900">
              Thank you
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Your contribution helps keep the Texas African food scene accurate. We will audit this
              listing within 24 hours.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSendEmail}
                className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Send my message
              </button>
              <button
                type="button"
                onClick={() => setShowThankYou(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
