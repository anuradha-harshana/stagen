"use client"

import { Bell, Search, CheckCheck, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NotificationHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadCount: number;
  totalCount: number;
  onMarkAllAsRead: () => void;
}

export function NotificationHeader({
  searchQuery,
  setSearchQuery,
  unreadCount,
  totalCount,
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  const readCount = Math.max(0, totalCount - unreadCount);

  return (
    <div className="flex items-start justify-between flex-wrap gap-4 py-1">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
          <Bell className="h-5 w-5 text-burning-flame" />
        </div>
        <div>
          <h1 className="text-blue-fantastic text-2xl font-sans font-bold leading-tight">
            Notifications
          </h1>
          <p className="text-blue-fantastic/50 text-sm mt-0.5 font-sans">
            Stay updated with recent activity, project progress &amp; payment alerts
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-3 rounded-2xl bg-blue-fantastic/8 border border-blue-fantastic/10 px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5 text-burning-flame" />
            <span className="text-xs font-semibold text-blue-fantastic font-sans">
              {unreadCount} Unread
            </span>
          </div>
          <div className="w-px h-3 bg-blue-fantastic/15" />
          <div className="flex items-center gap-1.5">
            <CheckCheck className="h-3.5 w-3.5 text-truffle-trouble" />
            <span className="text-xs font-semibold text-blue-fantastic font-sans">
              {readCount} Read
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="pl-8 bg-white border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-8 text-sm font-sans w-52 focus-visible:ring-blue-fantastic/20"
          />
        </div>

        <Button
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 disabled:opacity-50 gap-2 font-sans font-semibold shadow-sm h-8 text-xs cursor-pointer"
          size="sm"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all as read
        </Button>
      </div>
    </div>
  )
}

export default NotificationHeader;