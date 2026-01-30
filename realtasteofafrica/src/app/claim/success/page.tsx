import { Suspense } from "react"

import { Breadcrumbs } from "@/components/Breadcrumbs"
import { ClaimSuccessClient } from "@/components/ClaimSuccessClient"

export const metadata = {
  title: "Claim Success",
  description:
    "Your listing is being verified. Add your menu link, Instagram, and photo so we can make your page shine.",
}

export default function ClaimSuccessPage() {
  return (
    <div className="grid gap-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/claim", label: "Claim" },
          { href: "/claim/success", label: "Success" },
        ]}
      />
      <Suspense fallback={<p className="text-slate-600">Loading…</p>}>
        <ClaimSuccessClient />
      </Suspense>
    </div>
  )
}
