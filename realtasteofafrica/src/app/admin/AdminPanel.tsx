"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useFormStatus } from "react-dom"

import { addListing, signOutAdmin } from "@/app/admin/actions"
import type { AdminRestaurantRow, AdminStats } from "@/lib/adminStats"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send notification email"}
    </button>
  )
}

function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

type Tab = "overview" | "add" | "lookup"

export function AdminPanel({
  stats,
  restaurants,
}: {
  stats: AdminStats
  restaurants: AdminRestaurantRow[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("overview")
  const [lookup, setLookup] = useState("")
  const [formMessage, setFormMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const filtered = useMemo(() => {
    const q = lookup.trim().toLowerCase()
    if (!q) return restaurants.slice(0, 25)
    return restaurants
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q)
      )
      .slice(0, 50)
  }, [lookup, restaurants])

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "add", label: "Add listing" },
    { id: "lookup", label: "Lookup" },
  ]

  return (
    <div className="mx-auto grid max-w-5xl gap-6 pb-10">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 text-white shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Directory dashboard</h1>
          <p className="mt-2 text-sm text-slate-300">
            {stats.total} listings across {stats.cityCount} Texas cities
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOutAdmin()
            router.refresh()
          }}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Sign out
        </button>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Admin sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-amber-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total listings" value={stats.total} />
            <StatCard label="Cities" value={stats.cityCount} />
            <StatCard label="Featured" value={stats.featured} />
            <StatCard label="Owner verified" value={stats.verified} />
            <StatCard label="Missing phone" value={stats.missingPhone} hint="Data gaps to fill" />
            <StatCard label="Missing website" value={stats.missingWebsite} hint="Data gaps to fill" />
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Listings by region</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {stats.byArea.map((a) => (
                <li
                  key={a.slug}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-800">{a.name}</span>
                  <span className="text-slate-600">{a.count}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Quick links</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link className="font-medium text-amber-700 hover:text-amber-800" href="/restaurants">
                Browse directory →
              </Link>
              <Link className="font-medium text-amber-700 hover:text-amber-800" href="/claim">
                Claim flow →
              </Link>
              <Link className="font-medium text-amber-700 hover:text-amber-800" href="/contact">
                Contact form →
              </Link>
              <Link className="font-medium text-amber-700 hover:text-amber-800" href="/submit">
                Public submit →
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Data updates: edit <code className="rounded bg-slate-100 px-1">data/restaurants.csv</code>, then run{" "}
              <code className="rounded bg-slate-100 px-1">npm run import:restaurants</code> (runs automatically on Vercel
              deploy).
            </p>
          </section>
        </div>
      ) : null}

      {tab === "add" ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Add a restaurant</h2>
          <p className="mt-1 text-sm text-slate-600">
            Sends a notification email to your inbox with the details below. Add to CSV after review.
          </p>

          <form
            className="mt-6 grid gap-4"
            action={async (formData) => {
              setFormMessage(null)
              const result = await addListing(formData)
              if (result.success) {
                setFormMessage({ type: "ok", text: "Notification email sent." })
              } else {
                setFormMessage({ type: "err", text: result.error ?? "Failed to send" })
              }
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-slate-900">Restaurant name *</span>
                <input
                  name="restaurantName"
                  required
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. Suya Joe's"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-slate-900">City *</span>
                <input
                  name="city"
                  required
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. Houston"
                />
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-900">Address</span>
              <input
                name="address"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Street, City, TX ZIP"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-slate-900">Phone</span>
                <input
                  name="phone"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="(713) 555-1234"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-slate-900">Cuisine</span>
                <input
                  name="cuisines"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Nigerian, West African"
                />
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-900">Notes</span>
              <textarea
                name="notes"
                rows={3}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Hours, website, source, etc."
              />
            </label>

            {formMessage ? (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  formMessage.type === "ok"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
                role="alert"
              >
                {formMessage.text}
              </p>
            ) : null}

            <SubmitButton />
          </form>
        </section>
      ) : null}

      {tab === "lookup" ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Find a listing</h2>
          <p className="mt-1 text-sm text-slate-600">Search by name, city, or slug. Opens the public listing page.</p>

          <input
            type="search"
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="Search restaurants…"
            className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400"
          />

          <ul className="mt-4 divide-y divide-slate-100">
            {filtered.map((r) => (
              <li key={r.slug} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{r.name}</p>
                  <p className="text-sm text-slate-500">
                    {r.city} · {r.areaSlug}
                    {r.isFeatured ? " · Featured" : ""}
                    {r.isVerified ? " · Verified" : ""}
                  </p>
                </div>
                <Link
                  href={`/restaurants/${r.slug}`}
                  className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-800"
                >
                  View →
                </Link>
              </li>
            ))}
          </ul>

          {filtered.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No listings match your search.</p>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
