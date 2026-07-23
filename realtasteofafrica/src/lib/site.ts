/** Canonical site origin for metadata, sitemap, and OG (no trailing slash). */
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.realtasteofafrica.com").replace(
    /\/$/,
    "",
  )

/** Public inbox — forward via Cloudflare Email Routing (e.g. to Gmail). */
export const CONTACT_EMAIL = "contact@realtasteofafrica.com"

export const CLAIM_VERIFY_PRICE_USD = 49

