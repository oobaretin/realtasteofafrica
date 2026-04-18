import type { ReactNode } from "react"

import { getWebsiteLinkPresentation } from "@/lib/websiteLinkLabel"

type ListingExternalLinkProps = {
  href: string
  className?: string
  children?: ReactNode
}

/**
 * Outbound link with an honest label (Website vs Google Maps vs Order online, etc.).
 */
export function ListingExternalLink({ href, className, children }: ListingExternalLinkProps) {
  const { label } = getWebsiteLinkPresentation(href)
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children ?? (
        <>
          {label}
          <span className="sr-only"> (opens in new tab)</span>
        </>
      )}
    </a>
  )
}
