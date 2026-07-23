/** Canonical site origin for metadata, sitemap, and OG (no trailing slash). */
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.realtasteofafrica.com").replace(
    /\/$/,
    "",
  )

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@realtasteofafrica.com"

export const CLAIM_VERIFY_PRICE_USD = 49

