export type WebsiteLinkKind = "official" | "maps" | "order" | "social" | "directory"

export type WebsiteLinkPresentation = {
  label: string
  kind: WebsiteLinkKind
}

const ORDER_HOST_FRAGMENTS = [
  "doordash.com",
  "ubereats.com",
  "postmates.com",
  "grubhub.com",
  "seamless.com",
  "toasttab.com",
  "order.online",
  "square.site",
  "toast.site",
  "clover.com",
  "chownow.com",
  "delivery.com",
  "caviar.com",
  "skipthedishes.com",
  "goto-where.com",
  "gotoeat.net",
]

const DIRECTORY_HOST_FRAGMENTS = [
  "yelp.com",
  "tripadvisor.com",
  "foursquare.com",
  "mapquest.com",
  "yellowpages.com",
  "res-menu.com",
  "restaurants-info.com",
  "restaurants-world.com",
  "zmenu.com",
  "openstreetmap.org",
  "bing.com",
  "nextdoor.com",
]

function hostMatches(host: string, fragments: string[]): boolean {
  return fragments.some((f) => host === f || host.endsWith("." + f))
}

/**
 * User-facing label for an external listing URL (official site vs Maps vs ordering vs social).
 */
export function getWebsiteLinkPresentation(url: string): WebsiteLinkPresentation {
  const raw = String(url || "").trim()
  if (!raw) return { label: "Link", kind: "official" }

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return { label: "Link", kind: "official" }
  }

  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase()

  if (
    host === "maps.google.com" ||
    (host === "google.com" && parsed.pathname.includes("/maps")) ||
    (host.endsWith("google.com") && parsed.pathname.includes("/maps")) ||
    parsed.href.includes("google.com/maps")
  ) {
    return { label: "Google Maps", kind: "maps" }
  }

  if (host === "maps.apple.com" || host.endsWith(".apple.com")) {
    return { label: "Apple Maps", kind: "maps" }
  }

  if (host === "facebook.com" || host.endsWith(".facebook.com")) {
    return { label: "Facebook", kind: "social" }
  }
  if (host === "instagram.com" || host.endsWith(".instagram.com")) {
    return { label: "Instagram", kind: "social" }
  }
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    return { label: "TikTok", kind: "social" }
  }

  if (hostMatches(host, ORDER_HOST_FRAGMENTS)) {
    return { label: "Order online", kind: "order" }
  }

  if (hostMatches(host, DIRECTORY_HOST_FRAGMENTS)) {
    return { label: "Listing page", kind: "directory" }
  }

  return { label: "Website", kind: "official" }
}
