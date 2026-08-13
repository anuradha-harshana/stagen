import { Suspense } from "react"
import { Metadata } from "next"
import { SupervisorNotificationContainer } from "@/components/supervisor/notifications/SupervisorNotificationContainer"
import { SupervisorNotificationSkeleton } from "@/components/supervisor/notifications/SupervisorNotificationSkeleton"

export const metadata: Metadata = {
  title: "Supervisor Notifications | Stagen",
  description: "Manage site-level alerts, client messages, schedule delays, and warranty actions on Stagen Build Progress OS.",
}

export default function SupervisorNotificationsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <Suspense fallback={<SupervisorNotificationSkeleton />}>
        <SupervisorNotificationContainer />
      </Suspense>
    </div>
  )
}
