"use client"

import { useState } from "react"

import { CONTACT_EMAIL } from "@/lib/site"

export type VerificationFormProps = {
  restaurantName: string
  restaurantSlug: string
  transactionId: string
}

function toVerificationMailto(workEmail: string, proofOfOwnership: string, props: VerificationFormProps) {
  const subject = encodeURIComponent(`Verification details — ${props.restaurantName} (${props.restaurantSlug})`)
  const body = encodeURIComponent(
    [
      "Listing verification — proof of ownership",
      "",
      `Restaurant: ${props.restaurantName}`,
      `Slug: ${props.restaurantSlug}`,
      `Transaction ID: ${props.transactionId}`,
      "",
      "--- Your details ---",
      `Work email: ${workEmail || "(not provided)"}`,
      `Proof of ownership (link or description): ${proofOfOwnership || "(not provided)"}`,
      "",
      "Please verify this listing within 24 hours and update the directory.",
    ].join("\n")
  )
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

export function VerificationForm({ restaurantName, restaurantSlug, transactionId }: VerificationFormProps) {
  const [workEmail, setWorkEmail] = useState("")
  const [proofOfOwnership, setProofOfOwnership] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = toVerificationMailto(workEmail, proofOfOwnership, {
      restaurantName,
      restaurantSlug,
      transactionId,
    })
    setSubmitted(true)
  }

  return (
    <section
      className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-sm"
      aria-labelledby="verification-form-heading"
    >
      <h2 id="verification-form-heading" className="text-lg font-semibold tracking-tight text-slate-900">
        Almost done — send your verification details
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        So we can verify your listing within 24 hours, please provide your work email and proof of ownership (e.g. link to your business social media or a photo of your business license).
      </p>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-slate-900">
            Work email <span className="text-amber-700">*</span>
          </span>
          <input
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
            type="email"
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            required
          />
        </label>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-slate-900">Proof of ownership</span>
          <textarea
            className="min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
            value={proofOfOwnership}
            onChange={(e) => setProofOfOwnership(e.target.value)}
            placeholder="Link to your business website or social media, or describe how you’ll send a photo of your business license"
            rows={3}
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
            type="submit"
          >
            Send verification details
          </button>
          {submitted && (
            <span className="text-sm text-slate-600">Email client opened — send the message to complete.</span>
          )}
        </div>
      </form>
    </section>
  )
}
