import { redirect } from "next/navigation"

export const metadata = {
  title: "Location",
}

export default async function LocationLegacyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/areas/${slug}`)
}

