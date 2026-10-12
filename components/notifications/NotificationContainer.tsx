"use client"

import { useState, useMemo } from "react"
import { NotificationHeader } from "./NotificationHeader"
import { NotificationList } from "./NotificationList"
import { NotificationSidebar } from "./NotificationSidebar"
import { FilterCategory } from "./NotificationFilter"
import { NotificationItem } from "./NotificationCard"

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Frame stage completed",
    description: "The Frame stage has been marked as completed by your site supervisor. Quality inspection passed.",
    time: "10 mins ago",
    category: "Progress Updates",
    read: false,
  },
  {
    id: "2",
    title: "New photos uploaded",
    description: "5 new site progress photos were added to your project documents gallery.",
    time: "1 hour ago",
    category: "Progress Updates",
    read: false,
  },
  {
    id: "3",
    title: "Invoice #INV-2024-0456 issued",
    description: "A new stage payment invoice of $12,450.00 is ready for review and payment.",
    time: "3 hours ago",
    category: "Invoices & Payments",
    read: false,
  },
  {
    id: "4",
    title: "Plumbing inspection scheduled",
    description: "Pre-lining plumbing & drainage inspection confirmed for Thursday, 10:00 AM.",
    time: "Yesterday",
    category: "Inspections",
    read: false,
  },
  {
    id: "5",
    title: "Warranty issue updated",
    description: "Technician assigned to repair minor tile hairline defect reported in master ensuite.",
    time: "2 days ago",
    category: "Warranty",
    read: true,
  },
  {
    id: "6",
    title: "System maintenance complete",
    description: "Customer portal system updates and performance enhancements have been deployed.",
    time: "3 days ago",
    category: "System",
    read: true,
  },
  {
    id: "7",
    title: "Variation Order #1 approved",
    description: "Kitchen island extension variation order signed and updated in project schedule.",
    time: "4 days ago",
    category: "Invoices & Payments",
    read: true,
  },
  {
    id: "8",
    title: "Site meeting request received",
    description: "Supervisor requested site walk-through to review electrical layout locations.",
    time: "5 days ago",
    category: "Inspections",
    read: true,
  },
]

export function NotificationContainer() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  // Compute counts for filter categories
  const counts = useMemo(() => {
    const map: Record<FilterCategory, number> = {
      All: notifications.length,
      Unread: notifications.filter((n) => !n.read).length,
      "Progress Updates": notifications.filter((n) => n.category === "Progress Updates").length,
      "Invoices & Payments": notifications.filter((n) => n.category === "Invoices & Payments").length,
      Inspections: notifications.filter((n) => n.category === "Inspections").length,
      Warranty: notifications.filter((n) => n.category === "Warranty").length,
      System: notifications.filter((n) => n.category === "System").length,
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
        if (!matchTitle && !matchDesc && !matchCat) return false
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

  return (
    <div className="flex flex-col gap-4 w-full font-sans">
      <NotificationHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
        {/* Main Feed */}
        <main className="flex-1 min-w-0 w-full">
          <NotificationList
            notifications={filteredNotifications}
            onToggleRead={handleToggleRead}
            onDelete={handleDelete}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </main>

        {/* Sub Sidebar */}
        <NotificationSidebar
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={counts}
        />
      </div>
    </div>
  )
}

export default NotificationContainer
