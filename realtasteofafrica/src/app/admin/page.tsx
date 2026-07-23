import { redirect } from "next/navigation"

import { AdminLogin } from "@/app/admin/AdminLogin"
import { AdminPanel } from "@/app/admin/AdminPanel"
import { isAdminAuthenticated, setAdminSessionCookie } from "@/app/admin/adminSession"
import { isValidAdminKey } from "@/lib/adminAuth"
import { computeAdminStats, toAdminRestaurantRows } from "@/lib/adminStats"
import { RESTAURANTS } from "@/lib/restaurants"

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const adminKeyConfigured = Boolean(process.env.ADMIN_KEY)

  if (!adminKeyConfigured) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Admin not configured</h1>
          <p className="mt-3 text-sm text-slate-600">
            Set <code className="rounded bg-slate-100 px-1">ADMIN_KEY</code> in your environment variables.
          </p>
        </div>
      </div>
    )
  }

  const { key } = await searchParams

  // Legacy bookmark support: /admin?key=... sets session and strips key from URL
  if (isValidAdminKey(key)) {
    await setAdminSessionCookie()
    redirect("/admin")
  }

  const authed = await isAdminAuthenticated()
  if (!authed) {
    return <AdminLogin />
  }

  const stats = computeAdminStats(RESTAURANTS)
  const rows = toAdminRestaurantRows(RESTAURANTS)

  return <AdminPanel stats={stats} restaurants={rows} />
}
