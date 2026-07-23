import { Inter } from "next/font/google"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import "./globals.css"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteJsonLd } from "@/components/SiteJsonLd"
import { SITE_URL } from "@/lib/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Real Taste of Africa — African Restaurant Directory",
    template: "%s | Real Taste of Africa",
  },
  description:
    "Directory of African restaurants, food trucks, and markets across Texas—browse by city and cuisine, verified listings with hours and contacts.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Real Taste of Africa",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <body className="font-sans overflow-x-hidden">
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

