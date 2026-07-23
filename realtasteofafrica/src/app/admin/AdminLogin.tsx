"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFormStatus } from "react-dom"

import { signInAdmin } from "@/app/admin/actions"

function SignInButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  )
}

export function AdminLogin() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="mx-auto grid max-w-md gap-6 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your admin key to manage the directory. Your session lasts 7 days on this browser.
        </p>

        <form
          className="mt-6 grid gap-4"
          action={async (formData) => {
            setError(null)
            const result = await signInAdmin(formData)
            if (result.success) {
              router.refresh()
            } else {
              setError(result.error ?? "Sign in failed")
            }
          }}
        >
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-900">Admin key</span>
            <input
              name="adminKey"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Paste your admin key"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-amber-400"
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}

          <SignInButton />
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Tip: bookmark this page after signing in — you won&apos;t need the key in the URL.
        </p>
      </div>
    </div>
  )
}
