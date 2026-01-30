"use client"

import { useState } from "react"
import { CONTACT_EMAIL } from "@/lib/site"

const SUBJECT_OPTIONS = [
  { value: "Report a Closure", label: "Report a Closure" },
  { value: "Information Update", label: "Information Update" },
  { value: "New Restaurant Suggestion", label: "New Restaurant Suggestion" },
  { value: "General Inquiry", label: "General Inquiry" },
]

export function ContactForm() {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject || "Directory inquiry")}&body=${encodeURIComponent(body)}`

  return (
    <section id="contact-form" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight text-slate-900">Send a message</h2>
      <p className="mt-2 text-sm text-slate-600">
        Choose a subject and we’ll get back to you as soon as we can.
      </p>

      <div className="mt-4 grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Subject</span>
          <select
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select…</option>
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Message</span>
          <textarea
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            rows={5}
            placeholder="Your message…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Help us keep the Real Taste of Africa 100% accurate. If you see a business that has moved or
        closed, let us know!
      </p>

      <div className="mt-4">
        <a
          className="inline-flex rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          href={mailtoHref}
        >
          Email us →
        </a>
      </div>
    </section>
  )
}
