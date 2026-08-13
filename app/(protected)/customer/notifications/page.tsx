import { Suspense } from "react"
import { NotificationContainer } from "@/components/notifications/NotificationContainer"
import { NotificationSkeleton } from "@/components/notifications/NotificationSkeleton"

export default function NotificationPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <Suspense fallback={<NotificationSkeleton />}>
        <NotificationContainer />
      </Suspense>
    </div>
  )
}