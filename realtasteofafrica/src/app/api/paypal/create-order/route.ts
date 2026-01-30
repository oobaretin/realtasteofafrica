import { NextResponse } from "next/server"

import { CLAIM_VERIFY_PRICE_USD } from "@/lib/site"

const PAYPAL_API_BASE =
  process.env.PAYPAL_SANDBOX === "true"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com"

async function getAccessToken(): Promise<string> {
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const restaurantSlug = typeof body?.restaurantSlug === "string" ? body.restaurantSlug.trim() : ""
    if (!restaurantSlug) {
      return NextResponse.json(
        { error: "restaurantSlug is required" },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()
    const value = CLAIM_VERIFY_PRICE_USD.toFixed(2)

    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: restaurantSlug,
            description: `Listing verification: ${restaurantSlug}`,
            amount: {
              currency_code: "USD",
              value,
            },
          },
        ],
      }),
    })

    if (!orderRes.ok) {
      const err = await orderRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: "PayPal order creation failed", details: err },
        { status: orderRes.status }
      )
    }

    const order = (await orderRes.json()) as { id: string }
    return NextResponse.json({ orderID: order.id })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create order failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
