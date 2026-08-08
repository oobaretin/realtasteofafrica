import { SavedSpotsList } from "@/components/SavedSpotsList"
import { WpPageShell } from "@/components/WpPageShell"

export const metadata = {
  title: "Saved spots",
  description: "Your saved African restaurants and markets across Texas.",
}

export default function SavedPage() {
  return (
    <WpPageShell
      title="Saved spots"
      description="Places you’ve bookmarked on this device — great for planning your next meal run."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/saved", label: "Saved" },
      ]}
      sidebar={null}
    >
      <SavedSpotsList />
    </WpPageShell>
  )
}
