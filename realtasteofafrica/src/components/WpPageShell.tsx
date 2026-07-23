import { type ReactNode } from "react"

import { ContentGrid } from "@/components/ContentGrid"
import { PageHeader } from "@/components/PageHeader"
import { WpSidebar } from "@/components/WpSidebar"
import type { Crumb } from "@/components/Breadcrumbs"

export function WpPageShell({
  title,
  description,
  breadcrumbs,
  children,
  sidebar,
  beforeContent,
}: {
  title?: string
  description?: string
  breadcrumbs?: Crumb[]
  children: ReactNode
  /** When provided, used instead of default WpSidebar (e.g. sidebar + Open Now toggle). */
  sidebar?: ReactNode
  /** Optional block above the main/sidebar grid (e.g. mobile region chips). */
  beforeContent?: ReactNode
}) {
  return (
    <div className="grid gap-6">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />
      {beforeContent}
      <ContentGrid sidebar={sidebar ?? <WpSidebar />}>{children}</ContentGrid>
    </div>
  )
}
