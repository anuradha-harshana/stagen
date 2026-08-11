import { Suspense } from "react"
import { NotificationContainer } from "@/components/notifications/NotificationContainer"
import { NotificationSkeleton } from "@/components/notifications/NotificationSkeleton"

export default function NotificationPage() {
  return (
    <div className="min-h-full w-full bg-oatmeal px-5 py-6 md:px-8 md:py-8 space-y-6 pb-16">
      <Suspense fallback={<NotificationSkeleton />}>
        <NotificationContainer />
      </Suspense>
    </div>
  )
}