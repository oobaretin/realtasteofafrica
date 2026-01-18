import { redirect } from "next/navigation"

export const metadata = {
  title: "Catering",
}

export default function CateringLegacyPage() {
  redirect("/submit")
}

