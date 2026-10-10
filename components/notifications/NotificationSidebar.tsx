"use client"

import { NotificationFilter, FilterCategory } from "./NotificationFilter"
import { NotificationChannel } from "./NotificationChannel"

interface NotificationSidebarProps {
  activeFilter: FilterCategory
  onSelectFilter: (filter: FilterCategory) => void
  counts: Record<FilterCategory, number>
}

export function NotificationSidebar({
  activeFilter,
  onSelectFilter,
  counts,
}: NotificationSidebarProps) {
  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
      <NotificationFilter
        activeFilter={activeFilter}
        onSelectFilter={onSelectFilter}
        counts={counts}
      />
      <NotificationChannel />
    </aside>
  )
}

export default NotificationSidebar