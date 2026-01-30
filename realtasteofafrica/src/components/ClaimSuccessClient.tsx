"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { VerifiedBadge } from "@/components/VerifiedBadge"
import { CONTACT_EMAIL } from "@/lib/site"
import { getRestaurantBySlug } from "@/lib/restaurants"

function buildSuccessMailto(params: {
  restaurantName: string
  slug: string
  transactionId: string
  menuUrl: string
  instagramHandle: string
  photoFileName: string
  specialOffer: string
}) {
  const { restaurantName, slug, transactionId, menuUrl, instagramHandle, photoFileName, specialOffer } = params
  const subject = encodeURIComponent(`Listing update — ${restaurantName} (${slug})`)
  const body = encodeURIComponent(
    [
      "Post-payment listing update",
      "",
      `Restaurant: ${restaurantName}`,
      `Slug: ${slug}`,
      `PayPal Transaction ID: ${transactionId}`,
      "",
      "--- Owner-provided details ---",
      `Menu URL: ${menuUrl || "(not provided)"}`,
      `Instagram: ${instagramHandle ? `@${instagramHandle.replace(/^@/, "")}` : "(not provided)"}`,
      `Photo file: ${photoFileName || "(please attach your best dish photo to this email)"}`,
      "",
      "Special offer / note for customers:",
      specialOffer || "(none)",
      "",
      "Please verify and update the listing within 24 hours. Attach the owner's best dish photo if they sent it separately.",
    ].join("\n")
  )
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

function VerificationPendingBar() {
  return (
    <div className="mt-3 rounded-full bg-slate-100 p-1">
      <div
        className="h-2 rounded-full bg-amber-500 transition-all duration-1000 ease-out"
        style={{ width: "60%" }}
        role="progressbar"
        aria-valuenow={60}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Verification in progress"
      />
      <p className="mt-1.5 text-xs font-medium text-slate-600">
        Verification pending — we’ll update your listing within 24 hours
      </p>
    </div>
  )
}

export function ClaimSuccessClient() {
  const searchParams = useSearchParams()
  const slug = searchParams.get("slug") ?? ""
  const tx = searchParams.get("tx") ?? ""

  const restaurant = slug ? getRestaurantBySlug(slug) : null

  const [menuUrl, setMenuUrl] = useState("")
  const [instagramHandle, setInstagramHandle] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [specialOffer, setSpecialOffer] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailto = buildSuccessMailto({
      restaurantName: restaurant?.name ?? slug,
      slug,
      transactionId: tx,
      menuUrl,
      instagramHandle,
      photoFileName: photoFile?.name ?? "",
      specialOffer,
    })
    window.location.href = mailto
    setSubmitted(true)
  }

  if (!slug) {
    return (
      <div className="grid gap-6">
        <p className="text-slate-600">No listing selected. Complete your claim from the claim page.</p>
        <Link
          href="/claim"
          className="inline-flex w-fit rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
        >
          Go to Claim page
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-10">
      <header className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Welcome to the Family! Your listing is being verified.
        </h1>
        <p className="text-slate-600">
          While we finalize your Gold Badge, please provide the details below so we can make your page shine.
        </p>
      </header>

      {restaurant && (
        <section
          className="rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/80 to-white p-6 shadow-sm"
          aria-labelledby="preview-heading"
        >
          <h2 id="preview-heading" className="sr-only">
            Preview of your verified listing
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-slate-900">{restaurant.name}</span>
            <VerifiedBadge />
          </div>
          <p className="mt-1 text-sm font-medium text-slate-600">{restaurant.city}, Texas</p>
          <VerificationPendingBar />
        </section>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Update your listing</h2>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-slate-900">Menu URL</span>
          <input
            type="url"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
            placeholder="e.g. link to PDF menu or DoorDash"
            value={menuUrl}
            onChange={(e) => setMenuUrl(e.target.value)}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-slate-900">Instagram handle</span>
          <input
            type="text"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
            placeholder="e.g. yourrestaurant or @yourrestaurant"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-slate-900">Best dish photo</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-amber-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-amber-800"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-slate-500">
            We’ll open your email — attach this photo there so we can add it to your listing.
          </p>
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-slate-900">Special offer or note for customers</span>
          <textarea
            className="min-h-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400"
            placeholder="e.g. 10% off for first-time visitors"
            value={specialOffer}
            onChange={(e) => setSpecialOffer(e.target.value)}
            rows={3}
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            Update my listing
          </button>
          {submitted && (
            <span className="text-sm text-slate-600">
              Email opened — send the message and attach your photo to complete.
            </span>
          )}
        </div>
      </form>

      <p className="text-center text-sm text-slate-500">
        We’ll verify your listing and add your Gold Badge within 24 hours. Questions?{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-amber-700 hover:underline">
          Email us
        </a>
        .
      </p>
    </div>
  )
}
