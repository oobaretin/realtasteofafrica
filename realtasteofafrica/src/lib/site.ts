/** Canonical site origin for metadata, sitemap, and OG (no trailing slash). */
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.realtasteofafrica.com").replace(
    /\/$/,
    "",
  )

export const SITE_NAME = "Real Taste of Africa"

/** One trust line — use in hero, footer, and meta descriptions. */
export const SITE_TAGLINE =
  "Texas's African food map — verified hours, phones, and directions."

/** Public inbox — forward via Cloudflare Email Routing (e.g. to Gmail). */
export const CONTACT_EMAIL = "contact@realtasteofafrica.com"

export const CLAIM_VERIFY_PRICE_USD = 49

