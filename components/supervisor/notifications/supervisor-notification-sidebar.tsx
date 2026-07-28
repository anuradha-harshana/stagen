"use client"

import { SupervisorNotificationFilter, SupervisorFilterCategory } from "./supervisor-notification-filter"
import { SupervisorNotificationChannel } from "./supervisor-notification-channel"

interface SupervisorNotificationSidebarProps {
  activeFilter: SupervisorFilterCategory
  onSelectFilter: (filter: SupervisorFilterCategory) => void
  counts: Record<SupervisorFilterCategory, number>
}

export function SupervisorNotificationSidebar({
  activeFilter,
  onSelectFilter,
  counts,
}: SupervisorNotificationSidebarProps) {
  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
      <SupervisorNotificationFilter
        activeFilter={activeFilter}
        onSelectFilter={onSelectFilter}
        counts={counts}
      />
      <SupervisorNotificationChannel />
    </aside>
  )
}

export default SupervisorNotificationSidebar
