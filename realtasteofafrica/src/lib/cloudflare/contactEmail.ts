type CloudflareSendResult = {
  success: boolean
  errors?: { code: number; message: string }[]
  result?: {
    delivered?: string[]
    permanent_bounces?: string[]
    queued?: string[]
  }
}

export type ContactEmailPayload = {
  issue: string
  restaurantName?: string
  message: string
  senderEmail?: string
}

function contactToAddress(): string {
  return (
    process.env.CONTACT_TO_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "therealtasteofafrica@gmail.com"
  )
}

function contactFromAddress(): string {
  return (
    process.env.CLOUDFLARE_EMAIL_FROM ||
    "Real Taste of Africa <noreply@realtasteofafrica.com>"
  )
}

function formatContactBody(payload: ContactEmailPayload): string {
  const lines = [
    "New contact form submission — Real Taste of Africa",
    "",
    `Issue type: ${payload.issue}`,
    payload.restaurantName?.trim()
      ? `Restaurant: ${payload.restaurantName.trim()}`
      : null,
    payload.senderEmail?.trim() ? `Reply to: ${payload.senderEmail.trim()}` : null,
    "",
    "Message:",
    payload.message.trim(),
  ].filter((line): line is string => typeof line === "string")

  return lines.join("\n")
}

/** Send contact notification via Cloudflare Email Service REST API. */
export async function sendContactEmailViaCloudflare(
  payload: ContactEmailPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_EMAIL_API_TOKEN

  if (!accountId || !apiToken) {
    return {
      ok: false,
      error:
        "Contact email is not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_EMAIL_API_TOKEN.",
    }
  }

  const to = contactToAddress()
  const from = contactFromAddress()
  const subject = `${payload.issue} – Real Taste of Africa`
  const text = formatContactBody(payload)

  const emailBody: Record<string, unknown> = {
    to,
    from,
    subject,
    text,
  }

  const replyTo = payload.senderEmail?.trim()
  if (replyTo) {
    emailBody.reply_to = replyTo
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    }
  )

  let data: CloudflareSendResult
  try {
    data = (await res.json()) as CloudflareSendResult
  } catch {
    return { ok: false, error: "Unexpected response from email service." }
  }

  if (!res.ok || !data.success) {
    const msg =
      data.errors?.[0]?.message ||
      `Email service returned ${res.status}. Check Cloudflare Email Sending setup.`
    return { ok: false, error: msg }
  }

  const delivered = data.result?.delivered?.length ?? 0
  const queued = data.result?.queued?.length ?? 0
  if (delivered === 0 && queued === 0) {
    return { ok: false, error: "Email was not accepted for delivery." }
  }

  return { ok: true }
}
