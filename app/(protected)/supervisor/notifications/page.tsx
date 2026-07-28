import { Suspense } from "react"
import { Metadata } from "next"
import { SupervisorNotificationContainer } from "@/components/supervisor/notifications/supervisor-notification-container"
import { SupervisorNotificationSkeleton } from "@/components/supervisor/notifications/supervisor-notification-skeleton"

export const metadata: Metadata = {
  title: "Supervisor Notifications | Stagen",
  description: "Manage site-level alerts, client messages, schedule delays, and warranty actions on Stagen Build Progress OS.",
}

export default function SupervisorNotificationsPage() {
  return (
    <div className="min-h-full w-full bg-oatmeal px-5 py-6 md:px-8 md:py-8 space-y-6 pb-16">
      <Suspense fallback={<SupervisorNotificationSkeleton />}>
        <SupervisorNotificationContainer />
      </Suspense>
    </div>
  )
}
