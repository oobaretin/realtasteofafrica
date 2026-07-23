import { cookies } from "next/headers"
import { Resend } from "resend"

import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isValidAdminKey,
  isValidAdminSessionToken,
} from "@/lib/adminAuth"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

const TO_EMAIL = "therealtasteofafrica@gmail.com"
const FROM_EMAIL = process.env.RESEND_FROM || "Real Taste of Africa <onboarding@resend.dev>"

async function requireAdminSession(): Promise<{ ok: true } | { ok: false; error: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (!isValidAdminSessionToken(token)) {
    return { ok: false, error: "Not authenticated" }
  }
  return { ok: true }
}

export async function signInAdmin(formData: FormData) {
  const key = formData.get("adminKey")
  if (!isValidAdminKey(typeof key === "string" ? key : null)) {
    return { success: false, error: "Invalid admin key" }
  }

  const token = createAdminSessionToken()
  if (!token) {
    return { success: false, error: "ADMIN_KEY is not configured" }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })

  return { success: true }
}

export async function signOutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
  return { success: true }
}

function field(formData: FormData, name: string): string {
  const v = formData.get(name)
  return typeof v === "string" ? v.trim() : ""
}

export async function addListing(formData: FormData) {
  const auth = await requireAdminSession()
  if (!auth.ok) return { success: false, error: auth.error }

  const name = field(formData, "restaurantName")
  const city = field(formData, "city")
  const address = field(formData, "address")
  const phone = field(formData, "phone")
  const cuisines = field(formData, "cuisines")
  const notes = field(formData, "notes")

  if (!name || !city) {
    return { success: false, error: "Restaurant name and city are required" }
  }

  if (!RESEND_API_KEY) {
    return {
      success: false,
      error: "RESEND_API_KEY not set. Add it in Vercel: Settings → Environment Variables.",
    }
  }

  const body = [
    "New restaurant submitted via admin portal",
    "",
    `Name: ${name}`,
    `City: ${city}`,
    address ? `Address: ${address}` : null,
    phone ? `Phone: ${phone}` : null,
    cuisines ? `Cuisine: ${cuisines}` : null,
    notes ? "" : null,
    notes ? "Notes:" : null,
    notes || null,
  ]
    .filter((line): line is string => typeof line === "string")
    .join("\n")

  try {
    const { error } = await resend!.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Listing: ${name} (${city})`,
      text: body,
    })

    if (error) {
      console.error("Resend API error:", error)
      return {
        success: false,
        error: error.message || "Resend rejected the email. Verify your domain at resend.com/domains.",
      }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Resend Error:", err)
    return { success: false, error: message }
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}
