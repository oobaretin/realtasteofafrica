"use client"

import { useCallback, useRef, useState } from "react"

import { ClaimListingForm } from "@/components/ClaimListingForm"
import { ClaimSearch } from "@/components/ClaimSearch"
import { PayPalButton } from "@/components/PayPalButton"
import { VerificationForm } from "@/components/VerificationForm"
import type { Restaurant } from "@/lib/restaurants"
import { CLAIM_VERIFY_PRICE_USD } from "@/lib/site"

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? ""

export function ClaimFlow() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSelect = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setPaymentComplete(false)
    setTransactionId(null)
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [])

  const handlePaymentSuccess = useCallback((restaurantSlug: string, txId: string) => {
    setTransactionId(txId)
    setPaymentComplete(true)
    console.log("Claim payment success", { restaurantId: restaurantSlug, transactionId: txId })
    setShowToast(true)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => {
      setShowToast(false)
      toastRef.current = null
    }, 6000)
  }, [])

  const initialValues = selectedRestaurant
    ? {
        restaurantName: selectedRestaurant.name,
        city: selectedRestaurant.city,
        listingUrl:
          typeof window !== "undefined"
            ? `${window.location.origin}/restaurants/${selectedRestaurant.slug}`
            : "",
      }
    : undefined

  return (
    <div className="grid gap-10">
      <section id="claim-search" className="scroll-mt-6">
        <ClaimSearch onSelect={handleSelect} inputId="claim-search-input" />
      </section>

      {selectedRestaurant && (
        <section
          id="claim-summary"
          ref={formRef}
          className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          aria-labelledby="claim-summary-heading"
        >
          <h2 id="claim-summary-heading" className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
            Claim summary
          </h2>
          <div className="mb-6 grid gap-1 text-sm text-slate-700">
            <p>
              <span className="font-medium">{selectedRestaurant.name}</span>
              <span className="text-slate-500"> — {selectedRestaurant.city}</span>
            </p>
            <p className="font-medium text-amber-800">
              One-time verification fee: ${CLAIM_VERIFY_PRICE_USD} USD
            </p>
          </div>

          {paymentComplete ? (
            <div className="grid gap-6">
              {showToast && (
                <div
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
                  role="status"
                >
                  Thank you! We will verify your listing within 24 hours.
                </div>
              )}
              {selectedRestaurant && transactionId && (
                <VerificationForm
                  restaurantName={selectedRestaurant.name}
                  restaurantSlug={selectedRestaurant.slug}
                  transactionId={transactionId}
                />
              )}
            </div>
          ) : (
            <PayPalButton
              clientId={PAYPAL_CLIENT_ID}
              restaurantSlug={selectedRestaurant.slug}
              amount={String(CLAIM_VERIFY_PRICE_USD)}
              onSuccess={handlePaymentSuccess}
              disabled={false}
            />
          )}
        </section>
      )}

      <section
        id="claim-form"
        className="scroll-mt-6"
        aria-labelledby="claim-form-heading"
      >
        <h2 id="claim-form-heading" className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
          Or request an invoice
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          Prefer to pay by invoice? We’ll send a PayPal invoice to your email.
        </p>
        <ClaimListingForm
          key={selectedRestaurant?.slug ?? "form"}
          initialValues={initialValues}
        />
      </section>
    </div>
  )
}
