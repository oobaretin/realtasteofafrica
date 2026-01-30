"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"

const PAYPAL_SCRIPT = "https://www.paypal.com/sdk/js"

export type PayPalButtonProps = {
  clientId: string
  restaurantSlug: string
  amount: string
  onSuccess: (restaurantSlug: string, transactionId: string) => void
  onError?: (err: unknown) => void
  disabled?: boolean
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: () => Promise<string>
        onApprove: (data: { orderID: string }) => Promise<void>
        onError?: (err: unknown) => void
        style?: { layout?: string; color?: string }
      }) => { render: (selector: string | HTMLElement) => Promise<unknown> }
    }
  }
}

function buildPayPalScriptUrl(clientId: string) {
  const params = new URLSearchParams({
    "client-id": clientId,
    currency: "USD",
    intent: "capture",
  })
  return `${PAYPAL_SCRIPT}?${params.toString()}`
}

export function PayPalButton({
  clientId,
  restaurantSlug,
  amount,
  onSuccess,
  onError,
  disabled,
}: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)

  const scriptUrl = clientId ? buildPayPalScriptUrl(clientId) : ""

  useEffect(() => {
    if (!loaded || !containerRef.current || !window.paypal || disabled) return

    const container = containerRef.current
    container.innerHTML = ""

    window.paypal
      .Buttons({
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ restaurantSlug }),
          })
          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error((err as { error?: string }).error ?? "Failed to create order")
          }
          const data = (await res.json()) as { orderID: string }
          return data.orderID
        },
        onApprove: async (data) => {
          onSuccess(restaurantSlug, data.orderID)
        },
        onError: (err) => {
          setScriptError(err instanceof Error ? err.message : "Payment failed")
          onError?.(err)
        },
        style: { layout: "vertical", color: "gold" },
      })
      .render(container)

    return () => {
      container.innerHTML = ""
    }
  }, [loaded, restaurantSlug, onSuccess, onError, disabled])

  if (!clientId) {
    return (
      <p className="text-sm text-amber-700">
        PayPal is not configured. Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in your environment.
      </p>
    )
  }

  if (scriptError) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4" role="alert">
        <p className="text-sm font-medium text-amber-800">{scriptError}</p>
        <p className="mt-2 text-xs text-amber-700">
          Client ID is present ({clientId.length} chars). If you replaced it in .env.local, do a{" "}
          <strong>hard refresh</strong>: Mac <kbd className="rounded border bg-white px-1">Cmd+Shift+R</kbd>.
        </p>
        <p className="mt-2 text-xs text-amber-700">
          Try opening this link in a new tab — if it shows JavaScript code, the ID is valid and something is blocking it on this page (e.g. ad blocker):{" "}
          <a
            href={scriptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline hover:no-underline"
          >
            PayPal SDK link
          </a>
        </p>
      </div>
    )
  }

  if (disabled) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Select your restaurant above to pay with PayPal.
      </div>
    )
  }

  return (
    <div className="paypal-button-container">
      {scriptUrl && !disabled && (
        <Script
          src={scriptUrl}
          strategy="afterInteractive"
          onLoad={() => setLoaded(true)}
          onError={() =>
            setScriptError(
              "PayPal script failed to load. Disable ad blockers for this site, try a private/incognito window, or open the link below in a new tab to test."
            )
          }
        />
      )}
      {!loaded && (
        <p className="text-sm text-slate-500">Loading PayPal…</p>
      )}
      <div ref={containerRef} />
    </div>
  )
}
