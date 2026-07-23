import { NextResponse } from "next/server"

import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/paypal"
import { CLAIM_VERIFY_PRICE_USD } from "@/lib/site"

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

    const accessToken = await getPayPalAccessToken()
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
