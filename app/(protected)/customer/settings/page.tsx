import { requireRole } from "@/lib/auth/auth"
import { getCustomerSettings } from "@/lib/customer/customerSettings"
import CustomerSettingsClient from "@/components/Customer/Setting/CustomerSettingsClient"

export default async function SettingsPage() {
  const user = await requireRole(["customer"])
  const settings = await getCustomerSettings(user.id)

  return <CustomerSettingsClient initialSettings={settings} />
}