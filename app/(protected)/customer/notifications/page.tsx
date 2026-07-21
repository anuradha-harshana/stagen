import { Suspense } from "react"
import { NotificationContainer } from "@/components/notifications/notification-container"
import { NotificationSkeleton } from "@/components/notifications/notification-skeleton"

export default function NotificationPage() {
  return (
    <div className="flex flex-col gap-4 w-full px-5">
      <Suspense fallback={<NotificationSkeleton />}>
        <NotificationContainer />
      </Suspense>
    </div>
  )
}