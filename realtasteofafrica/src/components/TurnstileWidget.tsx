"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
        }
      ) => string
      reset: (widgetId?: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

export function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  onError,
}: {
  siteKey: string
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onError,
      })
    }

    if (window.turnstile) {
      renderWidget()
      return
    }

    window.onTurnstileLoad = renderWidget
    const existing = document.querySelector('script[src*="turnstile/v0/api.js"]')
    if (!existing) {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
      script.async = true
      document.head.appendChild(script)
    }

    return () => {
      if (window.onTurnstileLoad === renderWidget) {
        window.onTurnstileLoad = undefined
      }
    }
  }, [siteKey, onVerify, onExpire, onError])

  return <div ref={containerRef} className="min-h-[65px]" />
}

export function resetTurnstileWidget(widgetId?: string) {
  window.turnstile?.reset(widgetId)
}
