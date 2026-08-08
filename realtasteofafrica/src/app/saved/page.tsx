import { RecentlyViewedSection } from "@/components/RecentlyViewedSection"
import { SavedSpotsList } from "@/components/SavedSpotsList"
import { WpPageShell } from "@/components/WpPageShell"

export const metadata = {
  title: "Your picks",
  description:
    "Saved spots and recently viewed African restaurants across Texas — your personal shortlist on this device.",
}

export default function SavedPage() {
  return (
    <WpPageShell
      title="Your picks"
      description="Saved spots and recently viewed listings on this device — handy for planning your next meal run."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/saved", label: "Your picks" },
      ]}
      sidebar={null}
    >
      <div className="grid gap-10">
        <SavedSpotsList />
        <RecentlyViewedSection />
      </div>
    </WpPageShell>
  )
}
