"use client"

import { useMemo, useState } from "react"

import { CONTACT_EMAIL } from "@/lib/site"

type FormState = {
  restaurantName: string
  city: string
  address: string
  cuisines: string
  phone: string
  website: string
  notes: string
}

function toEmailSubject() {
  return "Restaurant Submission"
}

function formatSubmissionBody(state: FormState) {
  const lines = [
    "New restaurant submission",
    "",
    `Restaurant: ${state.restaurantName || "-"}`,
    `City: ${state.city || "-"}`,
    `Address: ${state.address || "-"}`,
    `Cuisine/Style: ${state.cuisines || "-"}`,
    `Phone: ${state.phone || "-"}`,
    `Website: ${state.website || "-"}`,
    state.notes ? "" : undefined,
    state.notes ? "Notes:" : undefined,
    state.notes ? state.notes : undefined,
  ].filter((v): v is string => typeof v === "string")

  return lines.join("\n")
}

function toMailtoHref(state: FormState) {
  const subject = encodeURIComponent(toEmailSubject())
  const body = encodeURIComponent(formatSubmissionBody(state))
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

export function SubmitRestaurantForm() {
  const [state, setState] = useState<FormState>({
    restaurantName: "",
    city: "",
    address: "",
    cuisines: "",
    phone: "",
    website: "",
    notes: "",
  })

  const bodyPreview = useMemo(() => formatSubmissionBody(state), [state])

  const missingRequired =
    !state.restaurantName.trim() || !state.city.trim() || !state.address.trim()

  async function copyToClipboard() {
    await navigator.clipboard.writeText(bodyPreview)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight text-slate-900">
        Submit
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Fill this out and we’ll format it for you. Submissions open your email
        app (no database required).
      </p>

      <form
        className="mt-5 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          // Keep the UX simple: open email with prefilled content.
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
              placeholder="e.g., Makola Marketplace"
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
          <span className="text-sm font-medium text-slate-900">
            Full address <span className="text-amber-700">*</span>
          </span>
          <input
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
            value={state.address}
            onChange={(e) => setState((s) => ({ ...s, address: e.target.value }))}
            placeholder="Street, City, State ZIP"
            required
          />
        </label>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-slate-900">
            Cuisine / style
          </span>
          <input
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
            value={state.cuisines}
            onChange={(e) =>
              setState((s) => ({ ...s, cuisines: e.target.value }))
            }
            placeholder="e.g., Nigerian • West African • Ethiopian"
          />
        </label>

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          <label className="grid min-w-0 gap-1.5">
            <span className="text-sm font-medium text-slate-900">Phone</span>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
              value={state.phone}
              onChange={(e) =>
                setState((s) => ({ ...s, phone: e.target.value }))
              }
              placeholder="(713) 555-1234"
            />
          </label>

          <label className="grid min-w-0 gap-1.5">
            <span className="text-sm font-medium text-slate-900">Website</span>
            <input
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
              value={state.website}
              onChange={(e) =>
                setState((s) => ({ ...s, website: e.target.value }))
              }
              placeholder="https://example.com"
            />
          </label>
        </div>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-sm font-medium text-slate-900">Notes</span>
          <textarea
            className="min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
            value={state.notes}
            onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
            placeholder="Anything helpful (delivery, hours, etc.)"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={missingRequired}
          >
            Submit
          </button>

          <button
            className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={() => void copyToClipboard()}
            disabled={!bodyPreview.trim()}
          >
            Copy details
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
            Required: restaurant name, city, and full address.
          </p>
        ) : null}
      </form>
    </section>
  )
}

