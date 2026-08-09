import { Suspense } from "react"
import { CompanyNotificationsOverview } from "@/components/company/notifications/CompanyNotificationsOverview"
import { CompanyNotificationsSkeleton } from "@/components/company/notifications/CompanyNotificationsSkeleton"

export const metadata = {
  title: "Notifications & Rules | Company Portal",
  description: "Configure automated communication templates and alert rules.",
}

export default function CompanyNotificationsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<CompanyNotificationsSkeleton />}>
        <CompanyNotificationsOverview />
      </Suspense>
    </div>
  )
}
