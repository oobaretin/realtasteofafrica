import { createHmac, timingSafeEqual } from "node:crypto"

export const ADMIN_COOKIE_NAME = "rta_admin"
const SESSION_SALT = "rta-admin-session-v1"

/** Returns true when the provided key matches the configured admin secret. */
export function isValidAdminKey(key: string | undefined | null): boolean {
  const expectedKey = process.env.ADMIN_KEY
  if (!expectedKey) return false
  if (!key) return false
  return key === expectedKey
}

/** Derive a session token from ADMIN_KEY (never store the raw key in cookies). */
export function createAdminSessionToken(): string | null {
  const expectedKey = process.env.ADMIN_KEY
  if (!expectedKey) return null
  return createHmac("sha256", expectedKey).update(SESSION_SALT).digest("hex")
}

/** Compare session cookie value to expected token (timing-safe). */
export function isValidAdminSessionToken(token: string | undefined | null): boolean {
  const expected = createAdminSessionToken()
  if (!expected || !token) return false
  try {
    const a = Buffer.from(token, "utf8")
    const b = Buffer.from(expected, "utf8")
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
