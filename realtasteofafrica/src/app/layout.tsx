import { Inter } from "next/font/google"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Real Taste of Africa — African Restaurant Directory",
    template: "%s | Real Taste of Africa",
  },
  description:
    "Find African restaurants near you. Starting with Houston, Texas and neighboring cities — expanding nationwide.",
  metadataBase: new URL("https://realtasteofafrica.com"),
  icons: {
    icon: { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
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
        <SpeedInsights />
      </body>
    </html>
  )
}

