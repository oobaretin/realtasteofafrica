import { Fraunces, Inter } from "next/font/google"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

import "./globals.css"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister"
import { SiteJsonLd } from "@/components/SiteJsonLd"
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — African Restaurant Directory`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#b45309",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} overflow-x-hidden`}>
      <body className="font-sans overflow-x-hidden">
        <ServiceWorkerRegister />
        <SiteJsonLd />
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-md bg-slate-900 px-3 py-2 text-sm"
          href="#main"
        >
          Skip to content
        </a>
        <div className="min-h-dvh overflow-x-hidden">
          <SiteHeader />
          <main id="main" className="mx-auto min-w-0 w-full max-w-6xl overflow-x-hidden px-4 py-10">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}

