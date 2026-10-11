"use client"

import { useSupervisorData, supervisorRequest, DataState } from "@/components/supervisor/useSupervisorData";
import { useState, useMemo } from "react"
import { SupervisorNotificationHeader } from "./SupervisorNotifiationHeader"
import { SupervisorNotificationList } from "./SupervisorNotificationList"
import { SupervisorNotificationSidebar } from "./SupervisorNotificationsidebar"
import { SupervisorFilterCategory } from "./SupervisorNotificationFilter"
import { SupervisorNotificationItem } from "./SupervisorNotificationCard"

export function SupervisorNotificationContainer() {
  const api = useSupervisorData<SupervisorNotificationItem[]>("notifications", []);
  const notifications = api.data;
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

  const handleToggleRead = async (id: string | number) => api.mutate("PATCH", { id: String(id), read: !notifications.find(n => n.id === id)?.read });
  const handleDelete = async (id: string | number) => api.mutate("DELETE", { id: String(id) });
  const handleMarkAllAsRead = async () => api.mutate("PATCH", { all: true });
  const handleUpdateNotification = async (n: SupervisorNotificationItem) => api.mutate("PATCH", { id: String(n.id), read: n.read, resolved: n.resolved, replyText: n.replyText });
  if (api.loading || api.error) return <DataState loading={api.loading} error={api.error} />;

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
