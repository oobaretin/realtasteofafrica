/** Returns true when the provided key matches the configured admin secret. */
export function isValidAdminKey(key: string | undefined | null): boolean {
  const expectedKey = process.env.ADMIN_KEY
  if (!expectedKey) return false
  if (!key) return false
  return key === expectedKey
}
