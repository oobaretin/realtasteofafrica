type TurnstileVerifyResponse = {
  success: boolean
  "error-codes"?: string[]
  action?: string
  hostname?: string
}

/** Validates a Turnstile token via Cloudflare Siteverify. */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return { ok: false, error: "Turnstile is not configured on the server." }
  }

  if (!token.trim()) {
    return { ok: false, error: "Complete the security check before submitting." }
  }

  const body: Record<string, string> = {
    secret,
    response: token,
  }
  if (remoteIp) body.remoteip = remoteIp

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    return { ok: false, error: "Could not verify security check. Try again." }
  }

  const data = (await res.json()) as TurnstileVerifyResponse
  if (!data.success) {
    return { ok: false, error: "Security check failed or expired. Refresh and try again." }
  }

  return { ok: true }
}
