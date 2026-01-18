"use client"

import { useMemo, useState } from "react"

import { CLAIM_VERIFY_PRICE_USD, CONTACT_EMAIL } from "@/lib/site"

type FormState = {
  restaurantName: string
  city: string
  listingUrl: string
  contactName: string
  contactEmail: string
  contactPhone: string
  notes: string
}

function formatInvoiceRequestBody(state: FormState) {
  const lines = [
    `Claim & Verify Listing — PayPal invoice request ($${CLAIM_VERIFY_PRICE_USD} one-time)`,
    "",
    `Restaurant: ${state.restaurantName || "-"}`,
    `City: ${state.city || "-"}`,
    `Listing URL (if known): ${state.listingUrl || "-"}`,
    "",
    `Contact name: ${state.contactName || "-"}`,
    `Contact email (for invoice): ${state.contactEmail || "-"}`,
    `Contact phone: ${state.contactPhone || "-"}`,
    "",
    "Verification (send any one):",
    "- Business email, or",
    "- Link to official website/social, or",
    "- Photo of storefront/menu, or",
    "- Proof of ownership/management",
    "",
    state.notes ? "Notes:" : undefined,
    state.notes ? state.notes : undefined,
  ].filter((v): v is string => typeof v === "string")

  return lines.join("\n")
}

function toMailtoHref(state: FormState) {
  const subject = encodeURIComponent("Claim & Verify Listing — Invoice Request")
  const body = encodeURIComponent(formatInvoiceRequestBody(state))
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

export function ClaimListingForm() {
  const [state, setState] = useState<FormState>({
    restaurantName: "",
    city: "",
    listingUrl: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  })

  const bodyPreview = useMemo(() => formatInvoiceRequestBody(state), [state])

  const missingRequired =
    !state.restaurantName.trim() || !state.city.trim() || !state.contactEmail.trim()

  async function copyToClipboard() {
    await navigator.clipboard.writeText(bodyPreview)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight text-slate-900">
        Request an invoice
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        We’ll send a PayPal invoice and verify your listing after payment.
      </p>

      <form
        className="mt-5 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          window.location.href = toMailtoHref(state)
        }}
      >
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <label className="grid min-w-0 gap-1.5">
            <span className="text-sm font-medium text-slate-900">
              Restaurant name <span className="text-amber-700">*</span>
            </span>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
              value={state.restaurantName}
              onChange={(e) =>
                setState((s) => ({ ...s, restaurantName: e.target.value }))
              }
              placeholder="e.g., Taste of Nigeria"
              required
            />
          </label>

          <label className="grid min-w-0 gap-1.5">
            <span className="text-sm font-medium text-slate-900">
              City <span className="text-amber-700">*</span>
            </span>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
              value={state.city}
              onChange={(e) => setState((s) => ({ ...s, city: e.target.value }))}
              placeholder="e.g., Houston"
              required
            />
          </label>
        </div>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-slate-900">Listing URL</span>
          <input
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
            value={state.listingUrl}
            onChange={(e) =>
              setState((s) => ({ ...s, listingUrl: e.target.value }))
            }
            placeholder="Paste the restaurant page link (optional)"
          />
        </label>

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <label className="grid min-w-0 gap-1.5">
            <span className="text-sm font-medium text-slate-900">Your name</span>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
              value={state.contactName}
              onChange={(e) =>
                setState((s) => ({ ...s, contactName: e.target.value }))
              }
              placeholder="Owner / manager"
            />
          </label>

          <label className="grid min-w-0 gap-1.5">
            <span className="text-sm font-medium text-slate-900">
              Email (for invoice) <span className="text-amber-700">*</span>
            </span>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
              value={state.contactEmail}
              onChange={(e) =>
                setState((s) => ({ ...s, contactEmail: e.target.value }))
              }
              placeholder="name@business.com"
              required
              inputMode="email"
            />
          </label>
        </div>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-slate-900">Phone</span>
          <input
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
            value={state.contactPhone}
            onChange={(e) =>
              setState((s) => ({ ...s, contactPhone: e.target.value }))
            }
            placeholder="Optional"
          />
        </label>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-slate-900">Notes</span>
          <textarea
            className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
            value={state.notes}
            onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
            placeholder="What should we update (hours, website, delivery links, etc.)?"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={missingRequired}
          >
            Request PayPal invoice
          </button>

          <button
            className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={() => void copyToClipboard()}
            disabled={!bodyPreview.trim()}
          >
            Copy request
          </button>

          <a
            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
            href={toMailtoHref(state)}
          >
            Open email instead →
          </a>
        </div>

        <details className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">
            Preview
          </summary>
          <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-700">
            {bodyPreview}
          </pre>
        </details>

        {missingRequired ? (
          <p className="text-xs text-slate-500">
            Required: restaurant name, city, and invoice email.
          </p>
        ) : null}
      </form>
    </section>
  )
}

