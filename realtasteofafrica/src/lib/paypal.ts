export const PAYPAL_API_BASE =
  process.env.PAYPAL_SANDBOX === "true"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com"

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID ?? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !secret) {
    throw new Error("PayPal credentials not configured (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)")
  }
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64")
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal token failed: ${res.status} ${text}`)
  }
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

/** Extract capture ID from PayPal capture-order response. */
export function extractCaptureId(capture: {
  id?: string
  status?: string
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{ id?: string }>
    }
  }>
}): string | undefined {
  const fromUnit = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id
  if (fromUnit) return fromUnit
  if (capture.status === "COMPLETED" && capture.id) return capture.id
  return undefined
}
