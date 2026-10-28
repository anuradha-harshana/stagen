"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { NotificationHeader } from "./NotificationHeader"
import { NotificationList } from "./NotificationList"
import { NotificationSidebar } from "./NotificationSidebar"
import { FilterCategory } from "./NotificationFilter"
import { NotificationItem } from "./NotificationCard"
import { Loader2 } from "lucide-react"

export interface NotificationContainerProps {
  initialNotifications?: NotificationItem[]
}

export function NotificationContainer({
  initialNotifications,
}: NotificationContainerProps = {}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotifications && initialNotifications.length > 0 ? initialNotifications : []
  )
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(
    !initialNotifications || initialNotifications.length === 0
  )

  // Fetch notifications from the backend API
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/notifications")
      if (res.ok) {
        const data = await res.json()
        const items: NotificationItem[] = data.notifications || data || []
        setNotifications(items)
      } else if (!initialNotifications || initialNotifications.length === 0) {
        toast.error("Failed to load notifications from server")
      }
    } catch (err) {
      console.error("Error fetching notifications:", err)
      if (!initialNotifications || initialNotifications.length === 0) {
        toast.error("Network error while loading notifications")
      }
    } finally {
      setIsLoading(false)
    }
  }, [initialNotifications])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

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

  // Toggle read/unread handler
  const handleToggleRead = async (id: string | number) => {
    const idStr = String(id)
    const target = notifications.find((n) => String(n.id) === idStr)
    if (!target) return

    const newRead = !target.read
    const previous = [...notifications]

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((item) => (String(item.id) === idStr ? { ...item, read: newRead } : item))
    )

    try {
      const res = await fetch("/api/customer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idStr, read: newRead }),
      })

      if (!res.ok) {
        throw new Error("Failed to update notification state")
      }

      toast.success(newRead ? "Marked as read" : "Marked as unread")
    } catch (err) {
      // Rollback
      setNotifications(previous)
      toast.error("Could not update notification")
    }
  }

  // Delete notification handler
  const handleDelete = async (id: string | number) => {
    const idStr = String(id)
    const target = notifications.find((n) => String(n.id) === idStr)
    if (!target) return

    const previous = [...notifications]

    // Optimistic UI update
    setNotifications((prev) => prev.filter((item) => String(item.id) !== idStr))

    try {
      const res = await fetch(`/api/customer/notifications?id=${encodeURIComponent(idStr)}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete notification")
      }

      toast.info("Notification removed")
    } catch (err) {
      // Rollback
      setNotifications(previous)
      toast.error("Could not delete notification")
    }
  }

  // Mark all as read handler
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return

    const previous = [...notifications]

    // Optimistic UI update
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))

    try {
      const res = await fetch("/api/customer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      })

      if (!res.ok) {
        throw new Error("Failed to mark all as read")
      }

      toast.success("All notifications marked as read")
    } catch (err) {
      // Rollback
      setNotifications(previous)
      toast.error("Could not mark all as read")
    }
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
          {isLoading ? (
            <div className="bg-white border border-blue-fantastic/15 shadow-sm rounded-2xl p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-burning-flame" />
              <p className="text-sm font-semibold text-blue-fantastic/70">
                Loading notifications...
              </p>
            </div>
          ) : (
            <NotificationList
              notifications={filteredNotifications}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}
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
