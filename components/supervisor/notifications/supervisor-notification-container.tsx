"use client"

import { useState, useMemo } from "react"
import { SupervisorNotificationHeader } from "./supervisor-notification-header"
import { SupervisorNotificationList } from "./supervisor-notification-list"
import { SupervisorNotificationSidebar } from "./supervisor-notification-sidebar"
import { SupervisorFilterCategory } from "./supervisor-notification-filter"
import { SupervisorNotificationItem } from "./supervisor-notification-card"

const INITIAL_SUPERVISOR_NOTIFICATIONS: SupervisorNotificationItem[] = [
  {
    id: "s1",
    title: "Kitchen layout variation request",
    description: "Client asked if we can extend the kitchen island by 400mm before the plasterboard stage begins. Please review and respond.",
    time: "15 mins ago",
    category: "Customer Questions",
    read: false,
    lot: "Lot 104",
    clientName: "Sarah Jenkins",
    priority: "high",
  },
  {
    id: "s2",
    title: "Severe weather alert: Concrete delay",
    description: "Heavy rain and thunderstorms forecast for Thursday. Concrete pour for slab foundation needs to be rescheduled.",
    time: "45 mins ago",
    category: "Delays & Alerts",
    read: false,
    lot: "Lot 208",
    clientName: "David Miller",
    priority: "urgent",
  },
  {
    id: "s3",
    title: "Pre-lining plumbing audit request",
    description: "Sewer and drainage line installation ready for inspection audit. Plumber is waiting for your site verification.",
    time: "2 hours ago",
    category: "Stage Audits",
    read: false,
    lot: "Lot 312",
    clientName: "Emily Watson",
    priority: "medium",
  },
  {
    id: "s4",
    title: "New warranty claim assigned",
    description: "Hairline grout crack reported in ensuite floor tiles. Work order issued to master tiler. Review tiler schedule.",
    time: "4 hours ago",
    category: "Warranty",
    read: false,
    lot: "Lot 104",
    clientName: "Sarah Jenkins",
    priority: "low",
  },
  {
    id: "s5",
    title: "Structural engineering revisions uploaded",
    description: "Version 3.2 of the steel beam bracing schedule uploaded by structural engineer. Use these plans for frame assembly.",
    time: "Yesterday",
    category: "Documents",
    read: false,
    lot: "Lot 208",
    clientName: "David Miller",
    priority: "high",
  },
  {
    id: "s6",
    title: "Site safety audit checklist updated",
    description: "New regulations for working at heights require updating the digital safety checklist. Complete audit before Friday.",
    time: "2 days ago",
    category: "System & Safety",
    read: false,
    lot: "All Sites",
    priority: "medium",
  },
  {
    id: "s7",
    title: "Question regarding electrical layout",
    description: "Client asking to relocate master bedroom pendant light switch to the left bedside wall. Need your confirmation.",
    time: "3 days ago",
    category: "Customer Questions",
    read: false,
    lot: "Lot 312",
    clientName: "Emily Watson",
    priority: "medium",
  },
  {
    id: "s8",
    title: "Frame stage audit passed",
    description: "Independent building inspector has passed the timber framing audit with zero defects. Ready for roof cladding.",
    time: "4 days ago",
    category: "Stage Audits",
    read: true,
    lot: "Lot 104",
    clientName: "Sarah Jenkins",
    priority: "low",
  },
  {
    id: "s9",
    title: "Warranty fix complete",
    description: "Front entry door alignment issue resolved. Weather seals replaced. Customer signed off on warranty ticket.",
    time: "5 days ago",
    category: "Warranty",
    read: true,
    lot: "Lot 208",
    clientName: "David Miller",
    priority: "low",
    resolved: true,
  },
  {
    id: "s10",
    title: "Steel framing supply delay",
    description: "Supplier notified that steel beam shipment is delayed by 5 days. Frame crew schedule shifted accordingly.",
    time: "1 week ago",
    category: "Delays & Alerts",
    read: true,
    lot: "Lot 312",
    clientName: "Emily Watson",
    priority: "high",
    resolved: true,
  },
]

export function SupervisorNotificationContainer() {
  const [notifications, setNotifications] = useState<SupervisorNotificationItem[]>(
    INITIAL_SUPERVISOR_NOTIFICATIONS
  )
  const [activeFilter, setActiveFilter] = useState<SupervisorFilterCategory>("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  // Compute counts for filter categories
  const counts = useMemo(() => {
    const map: Record<SupervisorFilterCategory, number> = {
      All: notifications.length,
      Unread: notifications.filter((n) => !n.read).length,
      "Customer Questions": notifications.filter((n) => n.category === "Customer Questions").length,
      "Stage Audits": notifications.filter((n) => n.category === "Stage Audits").length,
      "Delays & Alerts": notifications.filter((n) => n.category === "Delays & Alerts").length,
      Warranty: notifications.filter((n) => n.category === "Warranty").length,
      Documents: notifications.filter((n) => n.category === "Documents").length,
      "System & Safety": notifications.filter((n) => n.category === "System & Safety").length,
    }
    return map
  }, [notifications])

  // Filtered notifications list
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category / Status Filter
      if (activeFilter === "Unread" && n.read) return false
      if (
        activeFilter !== "All" &&
        activeFilter !== "Unread" &&
        n.category !== activeFilter
      ) {
        return false
      }

      // Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        const matchTitle = n.title.toLowerCase().includes(query)
        const matchDesc = n.description.toLowerCase().includes(query)
        const matchCat = n.category.toLowerCase().includes(query)
        const matchLot = n.lot?.toLowerCase().includes(query) ?? false
        const matchClient = n.clientName?.toLowerCase().includes(query) ?? false
        if (!matchTitle && !matchDesc && !matchCat && !matchLot && !matchClient) return false
      }

      return true
    })
  }, [notifications, activeFilter, searchQuery])

  // Handlers
  const handleToggleRead = (id: string | number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item))
    )
  }

  const handleDelete = (id: string | number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const handleUpdateNotification = (updated: SupervisorNotificationItem) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full font-sans">
      <SupervisorNotificationHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
        {/* Main Feed */}
        <main className="flex-1 min-w-0 w-full">
          <SupervisorNotificationList
            notifications={filteredNotifications}
            onToggleRead={handleToggleRead}
            onDelete={handleDelete}
            onUpdateNotification={handleUpdateNotification}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </main>

        {/* Sub Sidebar */}
        <SupervisorNotificationSidebar
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={counts}
        />
      </div>
    </div>
  )
}

export default SupervisorNotificationContainer
