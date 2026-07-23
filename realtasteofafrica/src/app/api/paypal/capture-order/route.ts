import { NextResponse } from "next/server"

import {
  extractCaptureId,
  getPayPalAccessToken,
  PAYPAL_API_BASE,
} from "@/lib/paypal"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const orderID = typeof body?.orderID === "string" ? body.orderID.trim() : ""
    if (!orderID) {
      return NextResponse.json({ error: "orderID is required" }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()

    const captureRes = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    const capture = (await captureRes.json().catch(() => ({}))) as {
      id?: string
      status?: string
      purchase_units?: Array<{
        payments?: { captures?: Array<{ id?: string; status?: string }> }
      }>
      details?: unknown
    }

    if (!captureRes.ok) {
      return NextResponse.json(
        { error: "PayPal capture failed", details: capture.details ?? capture },
        { status: captureRes.status }
      )
    }

    const captureId = extractCaptureId(capture)
    if (!captureId) {
      return NextResponse.json(
        { error: "PayPal capture completed but no capture ID returned", details: capture },
        { status: 502 }
      )
    }

    return NextResponse.json({
      orderID,
      captureId,
      status: capture.status ?? "COMPLETED",
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Capture order failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
