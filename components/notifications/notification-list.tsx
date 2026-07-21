"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCheck, Inbox, ChevronDown } from "lucide-react"
import { NotificationCard, NotificationItem } from "./notification-card"

interface NotificationListProps {
  notifications: NotificationItem[]
  onToggleRead: (id: string | number) => void
  onDelete: (id: string | number) => void
  onMarkAllAsRead: () => void
}

export function NotificationList({
  notifications,
  onToggleRead,
  onDelete,
  onMarkAllAsRead,
}: NotificationListProps) {
  const [visibleCount, setVisibleCount] = useState(6)

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  const visibleNotifications = notifications.slice(0, visibleCount)

  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-sans rounded-2xl">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-truffle-trouble" />
            </div>
            <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">
              Activity Feed
            </CardTitle>
            <Badge
              variant="outline"
              className="text-xs text-blue-fantastic/70 border-blue-fantastic/20 bg-blue-fantastic/5 font-semibold"
            >
              {notifications.length} items
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs font-semibold text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/8 gap-1.5 h-7 px-2.5 rounded-xl"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-4 space-y-2">
        {notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-blue-fantastic/8 flex items-center justify-center mb-3">
              <Inbox className="h-6 w-6 text-blue-fantastic/40" />
            </div>
            <p className="text-blue-fantastic text-sm font-bold font-sans">
              No notifications found
            </p>
            <p className="text-blue-fantastic/50 text-xs mt-1 font-sans max-w-xs">
              There are no notifications matching your selected filter or search terms.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              {visibleNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onToggleRead={onToggleRead}
                  onDelete={onDelete}
                />
              ))}
            </div>

            {visibleCount < notifications.length && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="w-full bg-palladian border-blue-fantastic/15 text-blue-fantastic hover:bg-blue-fantastic/8 hover:border-blue-fantastic/25 font-sans font-semibold text-xs h-9 rounded-xl gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  Load More ({notifications.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default NotificationList