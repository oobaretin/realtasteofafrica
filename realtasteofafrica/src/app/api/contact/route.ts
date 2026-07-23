import { NextResponse } from "next/server"

import { sendContactEmailViaCloudflare } from "@/lib/cloudflare/contactEmail"
import { verifyTurnstileToken } from "@/lib/cloudflare/turnstile"

const ISSUE_VALUES = new Set([
  "Report a Closure",
  "Correction",
  "Business Claim",
])

const MAX_MESSAGE_LENGTH = 5000
const MAX_RESTAURANT_LENGTH = 200
const MAX_EMAIL_LENGTH = 254

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const record = body as Record<string, unknown>
  const issue = typeof record.issue === "string" ? record.issue.trim() : ""
  const message = typeof record.message === "string" ? record.message.trim() : ""
  const restaurantName =
    typeof record.restaurantName === "string" ? record.restaurantName.trim() : ""
  const senderEmail =
    typeof record.senderEmail === "string" ? record.senderEmail.trim() : ""
  const turnstileToken =
    typeof record.turnstileToken === "string" ? record.turnstileToken.trim() : ""

  if (!issue || !ISSUE_VALUES.has(issue)) {
    return NextResponse.json({ error: "Choose a valid issue type." }, { status: 400 })
  }

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 })
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 })
  }

  if (restaurantName.length > MAX_RESTAURANT_LENGTH) {
    return NextResponse.json({ error: "Restaurant name is too long." }, { status: 400 })
  }

  if (senderEmail && (senderEmail.length > MAX_EMAIL_LENGTH || !senderEmail.includes("@"))) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  const remoteIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null

  const turnstile = await verifyTurnstileToken(turnstileToken, remoteIp)
  if (!turnstile.ok) {
    return NextResponse.json({ error: turnstile.error }, { status: 403 })
  }

  const sent = await sendContactEmailViaCloudflare({
    issue,
    message,
    restaurantName: restaurantName || undefined,
    senderEmail: senderEmail || undefined,
  })

  if (!sent.ok) {
    console.error("Cloudflare contact email failed:", sent.error)
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true })
}
