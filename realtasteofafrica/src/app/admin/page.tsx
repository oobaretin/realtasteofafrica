import { AdminPanel } from "@/app/admin/AdminPanel"
import { isValidAdminKey } from "@/lib/adminAuth"
import { RESTAURANTS } from "@/lib/restaurants"

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const { key } = await searchParams
  const adminKeyConfigured = Boolean(process.env.ADMIN_KEY)

  if (!adminKeyConfigured) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-3xl border-t-8 border-orange-600 bg-white p-10 text-center shadow-2xl">
          <h1 className="text-3xl font-black text-gray-800">Admin Not Configured</h1>
          <p className="mt-4 font-medium text-gray-600">
            Set <code className="rounded bg-gray-100 px-1">ADMIN_KEY</code> in your environment
            variables to enable the admin portal.
          </p>
        </div>
      </div>
    )
  }

  if (!isValidAdminKey(key)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-3xl border-t-8 border-orange-600 bg-white p-10 text-center shadow-2xl">
          <h1 className="text-3xl font-black text-gray-800">Texas Admin Restricted</h1>
          <p className="mt-4 font-medium text-gray-600">
            {key
              ? "Invalid admin key. Check your URL and try again."
              : "Visit /admin?key=your-secret to access."}
          </p>
        </div>
      </div>
    )
  }

  return <AdminPanel adminKey={key!} listingCount={RESTAURANTS.length} />
}
