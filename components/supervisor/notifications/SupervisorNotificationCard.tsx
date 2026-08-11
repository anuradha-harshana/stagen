"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  FileText,
  ShieldAlert,
  Check,
  Trash2,
  Bell,
  CornerDownRight,
  Send,
  CalendarCheck,
  Eye,
  AlertOctagon
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface SupervisorNotificationItem {
  id: string | number
  title: string
  description: string
  time: string
  category: "Customer Questions" | "Stage Audits" | "Delays & Alerts" | "Warranty" | "Documents" | "System & Safety"
  read: boolean
  lot?: string
  clientName?: string
  priority?: "low" | "medium" | "high" | "urgent"
  resolved?: boolean
  replyText?: string
}

interface SupervisorNotificationCardProps {
  notification: SupervisorNotificationItem
  onToggleRead: (id: string | number) => void
  onDelete: (id: string | number) => void
  onUpdateNotification: (updated: SupervisorNotificationItem) => void
}

const categoryConfig: Record<
  SupervisorNotificationItem["category"],
  { bg: string; text: string; border: string; iconBg: string; icon: React.ElementType }
> = {
  "Customer Questions": {
    bg: "bg-truffle-trouble/10",
    text: "text-truffle-trouble font-bold",
    border: "border-truffle-trouble/30",
    iconBg: "bg-truffle-trouble/15 border border-truffle-trouble/20",
    icon: MessageCircle,
  },
  "Stage Audits": {
    bg: "bg-blue-fantastic/10",
    text: "text-blue-fantastic font-bold",
    border: "border-blue-fantastic/30",
    iconBg: "bg-blue-fantastic/15 border border-blue-fantastic/20",
    icon: CheckCircle2,
  },
  "Delays & Alerts": {
    bg: "bg-burning-flame/15",
    text: "text-truffle-trouble font-bold",
    border: "border-burning-flame/30",
    iconBg: "bg-burning-flame/20 border border-burning-flame/20",
    icon: AlertTriangle,
  },
  Warranty: {
    bg: "bg-burning-flame/15",
    text: "text-truffle-trouble font-bold",
    border: "border-burning-flame/30",
    iconBg: "bg-burning-flame/20 border border-burning-flame/20",
    icon: Wrench,
  },
  Documents: {
    bg: "bg-blue-fantastic/10",
    text: "text-blue-fantastic font-bold",
    border: "border-blue-fantastic/30",
    iconBg: "bg-blue-fantastic/15 border border-blue-fantastic/20",
    icon: FileText,
  },
  "System & Safety": {
    bg: "bg-blue-fantastic/5",
    text: "text-blue-fantastic/80 font-bold",
    border: "border-blue-fantastic/20",
    iconBg: "bg-blue-fantastic/10 border border-blue-fantastic/10",
    icon: ShieldAlert,
  },
}

const priorityConfig: Record<
  NonNullable<SupervisorNotificationItem["priority"]>,
  { text: string; bg: string; border: string; icon: React.ElementType }
> = {
  low: { text: "text-blue-fantastic/70", bg: "bg-blue-fantastic/5", border: "border-blue-fantastic/20", icon: Bell },
  medium: { text: "text-blue-fantastic", bg: "bg-blue-fantastic/10", border: "border-blue-fantastic/30", icon: Bell },
  high: { text: "text-truffle-trouble", bg: "bg-burning-flame/10", border: "border-burning-flame/40", icon: AlertTriangle },
  urgent: { text: "text-truffle-trouble font-extrabold", bg: "bg-truffle-trouble/10 animate-pulse", border: "border-truffle-trouble/50", icon: AlertOctagon },
}

export function SupervisorNotificationCard({
  notification,
  onToggleRead,
  onDelete,
  onUpdateNotification,
}: SupervisorNotificationCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const cfg = categoryConfig[notification.category] ?? {
    bg: "bg-blue-fantastic/10",
    text: "text-blue-fantastic font-bold",
    border: "border-blue-fantastic/20",
    iconBg: "bg-blue-fantastic/10 border border-blue-fantastic/10",
    icon: Bell,
  }

  const IconComponent = cfg.icon

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message")
      return
    }

    setIsSubmittingReply(true)
    setTimeout(() => {
      onUpdateNotification({
        ...notification,
        read: true,
        replyText: replyMessage,
      })
      toast.success(`Reply sent to ${notification.clientName || "Client"} regarding ${notification.lot || "site"}!`)
      setReplyMessage("")
      setShowReplyForm(false)
      setIsSubmittingReply(false)
    }, 600)
  }

  const handleResolveDelay = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdateNotification({
      ...notification,
      read: true,
      resolved: true,
    })
    toast.success(`Delay alert "${notification.title}" resolved and logged in project timeline.`)
  }

  const handleAcknowledgeSystem = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleRead(notification.id)
    toast.success(`Notification acknowledged.`)
  }

  return (
    <div
      onClick={() => {
        if (!notification.read) {
          onToggleRead(notification.id)
        }
      }}
      className={cn(
        "group flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer bg-palladian/40",
        notification.read
          ? "border-blue-fantastic/10 hover:bg-blue-fantastic/5 hover:border-blue-fantastic/15"
          : "border-blue-fantastic/20 bg-white/70 hover:bg-white shadow-xs"
      )}
    >
      <div className="flex items-start gap-3.5 w-full">
        {/* Category Icon */}
        <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs", cfg.iconBg)}>
          <IconComponent className={cn("h-5 w-5", cfg.text.split(" ")[0])} />
        </div>

        {/* Info Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={cn(
                "text-sm font-bold font-sans truncate transition-colors",
                notification.read
                  ? "text-blue-fantastic/80 group-hover:text-blue-fantastic"
                  : "text-blue-fantastic font-extrabold"
              )}
            >
              {notification.title}
            </h3>

            {/* Unread circle */}
            {!notification.read && (
              <span className="h-2.5 w-2.5 rounded-full bg-truffle-trouble shadow-xs shrink-0 animate-pulse" title="Unread" />
            )}

            {/* Lot Badge */}
            {notification.lot && (
              <Badge variant="outline" className="text-[10px] h-4.5 px-2 font-bold font-cream border-truffle-trouble/30 text-truffle-trouble bg-truffle-trouble/5">
                {notification.lot}
              </Badge>
            )}

            {/* Client Badge */}
            {notification.clientName && (
              <span className="text-[11px] font-semibold text-blue-fantastic/60 font-sans truncate">
                · {notification.clientName}
              </span>
            )}

            {/* Priority Badge */}
            {notification.priority && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] h-4.5 px-1.5 font-bold uppercase tracking-wider",
                  priorityConfig[notification.priority].bg,
                  priorityConfig[notification.priority].text,
                  priorityConfig[notification.priority].border
                )}
              >
                {notification.priority}
              </Badge>
            )}
          </div>

          <p className="text-blue-fantastic/70 text-xs mt-1 font-sans leading-relaxed">
            {notification.description}
          </p>

          {/* Render Reply details if already replied */}
          {notification.replyText && (
            <div className="mt-2.5 bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-xl p-2.5 flex items-start gap-2">
              <CornerDownRight className="h-3.5 w-3.5 text-blue-fantastic/50 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-blue-fantastic/70 block">You replied:</span>
                <span className="text-blue-fantastic/80 font-medium italic mt-0.5 block">{notification.replyText}</span>
              </div>
            </div>
          )}

          {/* Render resolved state */}
          {notification.resolved && (
            <div className="mt-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 w-fit">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold text-emerald-700 font-sans">
                Delay Resolved &amp; Noted
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Timestamp & Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0 self-stretch justify-between">
          <span className="text-blue-fantastic/45 text-[11px] font-semibold whitespace-nowrap">
            {notification.time}
          </span>

          <div className="flex items-center gap-1 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
      </div>

      {/* Interactive Quick Workflows */}
      {!notification.resolved && !notification.replyText && (
        <div className="border-t border-blue-fantastic/5 pt-3 mt-1 flex gap-2 items-center flex-wrap">
          {notification.category === "Customer Questions" && !showReplyForm && (
            <Button
              size="xs"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                setShowReplyForm(true)
              }}
              className="bg-truffle-trouble/5 border-truffle-trouble/25 text-truffle-trouble hover:bg-truffle-trouble/10 text-xs font-semibold cursor-pointer"
            >
              <MessageCircle className="h-3 w-3" />
              Quick Reply
            </Button>
          )}

          {notification.category === "Delays & Alerts" && (
            <Button
              size="xs"
              onClick={handleResolveDelay}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold cursor-pointer"
            >
              <CalendarCheck className="h-3 w-3" />
              Log as Resolved
            </Button>
          )}

          {notification.category === "Documents" && (
            <Button
              size="xs"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onToggleRead(notification.id)
                toast.success(`Opening document details for ${notification.title}`)
              }}
              className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-semibold cursor-pointer"
            >
              <Eye className="h-3 w-3" />
              Open Document
            </Button>
          )}

          {notification.category === "System & Safety" && !notification.read && (
            <Button
              size="xs"
              variant="outline"
              onClick={handleAcknowledgeSystem}
              className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-semibold cursor-pointer"
            >
              <Check className="h-3 w-3" />
              Acknowledge Alert
            </Button>
          )}
        </div>
      )}

      {/* Expandable Reply Form */}
      {showReplyForm && (
        <form
          onSubmit={handleSendReply}
          onClick={(e) => e.stopPropagation()}
          className="border-t border-blue-fantastic/5 pt-3 mt-1.5 flex flex-col gap-2 w-full animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="flex gap-2 items-center">
            <CornerDownRight className="h-3.5 w-3.5 text-truffle-trouble shrink-0" />
            <span className="text-xs font-bold text-truffle-trouble uppercase tracking-wider">
              Replying to {notification.clientName || "Client"}
            </span>
          </div>

          <div className="relative">
            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your response here..."
              className="min-h-[70px] pr-10 text-xs font-sans bg-white border-blue-fantastic/15 text-blue-fantastic focus-visible:ring-truffle-trouble/20 focus-visible:border-truffle-trouble"
            />
            <Button
              type="submit"
              size="icon-xs"
              disabled={isSubmittingReply || !replyMessage.trim()}
              className="absolute right-2 bottom-2 bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 disabled:opacity-50 cursor-pointer"
            >
              {isSubmittingReply ? (
                <span className="h-3 w-3 border-2 border-palladian border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>

          <div className="flex justify-end gap-1.5">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => {
                setShowReplyForm(false)
                setReplyMessage("")
              }}
              className="text-blue-fantastic/60 hover:text-blue-fantastic text-xs cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default SupervisorNotificationCard
