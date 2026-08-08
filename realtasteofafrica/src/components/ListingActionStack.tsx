import { ListingExternalLink } from "@/components/ListingExternalLink"
import { SaveSpotButton } from "@/components/SaveSpotButton"
import { ShareButton } from "@/components/ShareButton"
import { formatPhoneDisplay, toTelHref } from "@/lib/formatPhone"
import { getRestaurantMapsUrl } from "@/lib/mapsUrl"
import { getWebsiteLinkPresentation } from "@/lib/websiteLinkLabel"
import type { Restaurant } from "@/lib/restaurants"

export function ListingActionStack({
  restaurant,
  listingNumber,
  totalListings,
  layout = "stack",
}: {
  restaurant: Restaurant
  listingNumber: number
  totalListings: number
  layout?: "stack" | "inline"
}) {
  const r = restaurant
  const isStack = layout === "stack"

  const btnBase = isStack
    ? "flex w-full min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-semibold shadow-sm transition"
    : "inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3.5 text-base font-semibold shadow-sm transition"

  return (
    <div className={isStack ? "grid gap-3" : "flex min-w-0 flex-wrap gap-3"}>
      {r.phone ? (
        <a
          href={`tel:${toTelHref(r.phone)}`}
          className={`${btnBase} bg-emerald-600 text-white hover:bg-emerald-700`}
        >
          <span aria-hidden>📞</span>
          {formatPhoneDisplay(r.phone)}
        </a>
      ) : null}
      <a
        href={getRestaurantMapsUrl(r)}
        target="_blank"
        rel="noreferrer"
        className={`${btnBase} bg-blue-600 text-white hover:bg-blue-700`}
      >
        <span aria-hidden>📍</span>
        Get Directions
      </a>
      {r.websiteUrl ? (
        <ListingExternalLink
          href={r.websiteUrl}
          className={`${btnBase} border-2 border-slate-200 bg-white text-slate-800 hover:border-amber-300 hover:bg-amber-50`}
        />
      ) : null}
      <SaveSpotButton slug={r.slug} name={r.name} />
      <div className={isStack ? "[&>button]:w-full [&>button]:justify-center" : undefined}>
        <ShareButton title={r.name} url={`/restaurants/${r.slug}`} shareName={r.name} />
      </div>
      {r.websiteUrl &&
      getWebsiteLinkPresentation(r.websiteUrl).kind !== "official" ? (
        <p className="text-xs text-slate-500">
          Link may go to ordering, maps, or a directory—not always the business’s own site.
        </p>
      ) : null}
      {listingNumber > 0 ? (
        <p className="sr-only">
          Listing {listingNumber} of {totalListings} in the directory.
        </p>
      ) : null}
    </div>
  )
}
