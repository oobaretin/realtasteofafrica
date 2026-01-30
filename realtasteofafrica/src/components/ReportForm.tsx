"use client"

import { useState } from "react"
import { CONTACT_EMAIL } from "@/lib/site"

const ISSUE_TYPES = [
  { value: "closed", label: "This business is permanently closed.", emoji: "❌" },
  { value: "duplicate", label: "This is a duplicate listing.", emoji: "👯" },
  { value: "address", label: "The address/location is incorrect.", emoji: "📍" },
  { value: "contact", label: "The phone number or website is broken.", emoji: "📞" },
] as const

export function ReportForm() {
  const [issueType, setIssueType] = useState<string>("")
  const [correctInfo, setCorrectInfo] = useState("")

  const subject = "Report an Issue – Real Taste of Africa"
  const issueLabel = ISSUE_TYPES.find((t) => t.value === issueType)?.label ?? issueType
  const body = [
    `Issue type: ${issueLabel}`,
    "",
    "Correct or additional information:",
    correctInfo.trim() || "(none provided)",
  ].join("\n")

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <section id="report" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight text-slate-900">Report an Issue</h2>
      <p className="mt-2 text-sm text-slate-600">
        Help us keep the directory accurate. Choose the issue type and provide correct info if you have it.
      </p>

      <div className="mt-4 space-y-3">
        <span className="text-sm font-medium text-slate-700">Issue Type</span>
        {ISSUE_TYPES.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50"
          >
            <input
              type="radio"
              name="issueType"
              value={opt.value}
              checked={issueType === opt.value}
              onChange={() => setIssueType(opt.value)}
              className="mt-1"
            />
            <span className="text-sm text-slate-800">
              <span aria-hidden>{opt.emoji}</span> {opt.label}
            </span>
          </label>
        ))}
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Correct Information</span>
        <textarea
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          rows={3}
          placeholder="Correct address, phone, website, or other details…"
          value={correctInfo}
          onChange={(e) => setCorrectInfo(e.target.value)}
        />
      </label>

      <div className="mt-4">
        <a
          className="inline-flex rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          href={mailtoHref}
        >
          Submit report
        </a>
      </div>
    </section>
  )
}
