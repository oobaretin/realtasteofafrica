import { cookies } from "next/headers"

import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isValidAdminSessionToken,
} from "@/lib/adminAuth"

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function setAdminSessionCookie(): Promise<boolean> {
  const token = createAdminSessionToken()
  if (!token) return false
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })
  return true
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function requireAdminSession(): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "Not authenticated" }
  }
  return { ok: true }
}
