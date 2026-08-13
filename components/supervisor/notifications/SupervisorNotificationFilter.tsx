"use client"

import { Card } from "@/components/ui/card"
import {
  Filter,
  Inbox,
  Bell,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  FileText,
  ShieldAlert
} from "lucide-react"
import { cn } from "@/lib/utils"

export type SupervisorFilterCategory =
  | "All"
  | "Unread"
  | "Customer Questions"
  | "Stage Audits"
  | "Delays & Alerts"
  | "Warranty"
  | "Documents"
  | "System & Safety"

interface SupervisorNotificationFilterProps {
  activeFilter: SupervisorFilterCategory
  onSelectFilter: (filter: SupervisorFilterCategory) => void
  counts: Record<SupervisorFilterCategory, number>
}

const filterConfig: { label: SupervisorFilterCategory; icon: React.ElementType }[] = [
  { label: "All", icon: Inbox },
  { label: "Unread", icon: Bell },
  { label: "Customer Questions", icon: MessageCircle },
  { label: "Stage Audits", icon: CheckCircle2 },
  { label: "Delays & Alerts", icon: AlertTriangle },
  { label: "Warranty", icon: Wrench },
  { label: "Documents", icon: FileText },
  { label: "System & Safety", icon: ShieldAlert },
]

export function SupervisorNotificationFilter({
  activeFilter,
  onSelectFilter,
  counts,
}: SupervisorNotificationFilterProps) {
  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl overflow-hidden p-0">
      <div className="border-b border-blue-fantastic/10 px-4 py-3 flex items-center gap-2">
        <div className="h-6 w-6 rounded-lg bg-blue-fantastic/10 flex items-center justify-center">
          <Filter className="h-3.5 w-3.5 text-blue-fantastic" />
        </div>
        <h2 className="text-blue-fantastic text-sm font-bold">
          Filter Activity
        </h2>
      </div>

      <div className="p-2 space-y-1">
        {filterConfig.map(({ label, icon: Icon }) => {
          const isActive = activeFilter === label
          const count = counts[label] ?? 0

          return (
            <button
              key={label}
              onClick={() => onSelectFilter(label)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border-0 outline-none",
                isActive
                  ? "bg-blue-fantastic text-palladian shadow-xs font-bold"
                  : "text-blue-fantastic/75 hover:bg-blue-fantastic/8 hover:text-blue-fantastic"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isActive ? "text-burning-flame" : "text-blue-fantastic/50"
                  )}
                />
                <span className="truncate">{label}</span>
              </div>
              <span
                className={cn(
                  "inline-flex items-center justify-center h-4.5 min-w-4.5 px-1.5 rounded-full text-[10px] font-bold shrink-0",
                  isActive
                    ? "bg-white/20 text-palladian"
                    : "bg-blue-fantastic/10 text-blue-fantastic/60"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default SupervisorNotificationFilter
