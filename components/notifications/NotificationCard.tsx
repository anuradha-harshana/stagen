"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Receipt,
  Calendar,
  Wrench,
  ShieldAlert,
  Image as ImageIcon,
  Check,
  Eye,
  Trash2,
  Bell,
} from "lucide-react"

export interface NotificationItem {
  id: string | number
  title: string
  description: string
  time: string
  category: "Progress Updates" | "Invoices & Payments" | "Inspections" | "Warranty" | "System"
  read: boolean
}

interface NotificationCardProps {
  notification: NotificationItem
  onToggleRead: (id: string | number) => void
  onDelete: (id: string | number) => void
}

const categoryConfig: Record<
  NotificationItem["category"],
  { bg: string; text: string; border: string; iconBg: string; icon: React.ElementType }
> = {
  "Progress Updates": {
    bg: "bg-blue-fantastic/10",
    text: "text-blue-fantastic font-bold",
    border: "border-blue-fantastic/30",
    iconBg: "bg-blue-fantastic/15 border border-blue-fantastic/20",
    icon: CheckCircle2,
  },
  "Invoices & Payments": {
    bg: "bg-burning-flame/15",
    text: "text-truffle-trouble font-bold",
    border: "border-burning-flame/30",
    iconBg: "bg-burning-flame/20 border border-burning-flame/20",
    icon: Receipt,
  },
  Inspections: {
    bg: "bg-truffle-trouble/10",
    text: "text-truffle-trouble font-bold",
    border: "border-truffle-trouble/30",
    iconBg: "bg-truffle-trouble/15 border border-truffle-trouble/20",
    icon: Calendar,
  },
  Warranty: {
    bg: "bg-burning-flame/15",
    text: "text-truffle-trouble font-bold",
    border: "border-burning-flame/30",
    iconBg: "bg-burning-flame/20 border border-burning-flame/20",
    icon: Wrench,
  },
  System: {
    bg: "bg-blue-fantastic/5",
    text: "text-blue-fantastic/80 font-bold",
    border: "border-blue-fantastic/20",
    iconBg: "bg-blue-fantastic/10 border border-blue-fantastic/10",
    icon: ShieldAlert,
  },
}

export function NotificationCard({ notification, onToggleRead, onDelete }: NotificationCardProps) {
  const cfg = categoryConfig[notification.category] ?? {
    bg: "bg-blue-fantastic/10",
    text: "text-blue-fantastic font-bold",
    border: "border-blue-fantastic/20",
    iconBg: "bg-blue-fantastic/10 border border-blue-fantastic/10",
    icon: Bell,
  }

  const IconComponent = cfg.icon

  return (
    <div
      className={`group flex items-start sm:items-center gap-3.5 px-3.5 py-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
        notification.read
          ? "border-transparent bg-transparent hover:bg-blue-fantastic/5 hover:border-blue-fantastic/15"
          : "border-blue-fantastic/15 bg-blue-fantastic/5 hover:bg-blue-fantastic/10"
      }`}
    >
      {/* Icon */}
      <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
        <IconComponent className={`h-5 w-5 ${cfg.text.split(" ")[0]}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`text-sm font-bold font-sans truncate transition-colors ${
              notification.read
                ? "text-blue-fantastic/80 group-hover:text-blue-fantastic"
                : "text-blue-fantastic font-extrabold"
            }`}
          >
            {notification.title}
          </h3>

          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-burning-flame shadow-xs shrink-0" title="Unread" />
          )}
        </div>

        <p className="text-blue-fantastic/60 text-xs mt-0.5 font-sans line-clamp-2 leading-relaxed">
          {notification.description}
        </p>
      </div>

      {/* Category Badge */}
      <Badge
        variant="outline"
        className={`text-xs border hidden md:inline-flex shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
      >
        {notification.category}
      </Badge>

      {/* Timestamp */}
      <span className="text-blue-fantastic/50 text-xs font-sans font-semibold shrink-0 whitespace-nowrap">
        {notification.time}
      </span>

      {/* Quick Action buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation()
            onToggleRead(notification.id)
          }}
          title={notification.read ? "Mark as unread" : "Mark as read"}
          className="text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-blue-fantastic/10"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(notification.id)
          }}
          title="Delete notification"
          className="text-blue-fantastic/60 hover:text-truffle-trouble hover:bg-truffle-trouble/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

export default NotificationCard
