"use client"

import { useFormStatus } from "react-dom"

import { addListing } from "@/app/admin/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`md:col-span-2 rounded-2xl py-5 font-black text-white shadow-lg transition-all active:scale-95 ${
        pending ? "cursor-not-allowed bg-gray-400" : "bg-gray-900 hover:bg-orange-600"
      }`}
    >
      {pending ? "Sending..." : "Notify via Gmail"}
    </button>
  )
}

export function AdminPanel({ adminKey, listingCount }: { adminKey: string; listingCount: number }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-t-3xl bg-orange-600 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-black italic">The Real Taste of Africa</h1>
        <p className="text-sm font-bold uppercase tracking-widest opacity-90">
          Statewide Directory Manager
        </p>
      </div>

      <div className="rounded-b-3xl border-x border-b border-gray-100 bg-white p-10 shadow-2xl">
        <div className="mb-10 flex items-center justify-between border-b pb-6">
          <h2 className="text-2xl font-bold text-gray-800">{listingCount} Listings Active</h2>
          <span className="rounded-full border border-green-200 bg-green-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-600">
            Authenticated
          </span>
        </div>

        <form
          action={async (formData) => {
            formData.set("adminKey", adminKey)
            const result = await addListing(formData)
            if (result?.success) {
              alert("Success! Notification sent to Gmail.")
            } else {
              alert("Failed: " + (result?.error || "Unknown error"))
            }
          }}
          className="space-y-6"
        >
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8">
            <h3 className="mb-6 text-sm font-bold uppercase italic tracking-wider text-gray-600">
              Add Restaurant #{listingCount + 1}
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase text-gray-400">
                  Restaurant Name
                </label>
                <input
                  name="restaurantName"
                  type="text"
                  placeholder="e.g. Suya Joe's"
                  required
                  className="w-full rounded-xl border-2 border-gray-100 p-4 outline-none transition-all focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase text-gray-400">
                  City / Region
                </label>
                <input
                  name="city"
                  type="text"
                  placeholder="e.g. Houston"
                  required
                  className="w-full rounded-xl border-2 border-gray-100 p-4 outline-none transition-all focus:border-orange-500"
                />
              </div>

              <SubmitButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
