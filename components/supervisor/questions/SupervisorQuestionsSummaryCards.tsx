import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Clock, CheckCircle2 } from "lucide-react"

interface SummaryProps {
  totalCount: number
  pendingCount: number
  answeredCount: number
  selectedProjectName: string
}

export function SupervisorQuestionsSummaryCards({
  totalCount,
  pendingCount,
  answeredCount,
  selectedProjectName,
}: SummaryProps) {
  const answeredPct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0

  const SUMMARY = [
    {
      label: "Total Questions",
      value: `${totalCount} Asked`,
      sub: selectedProjectName,
      icon: MessageCircle,
      iconBg: "bg-blue-fantastic/10 border-blue-fantastic/20",
      iconColor: "text-blue-fantastic",
      valueColor: "text-blue-fantastic",
      bar: null,
    },
    {
      label: "Pending Answer",
      value: `${pendingCount} Pending`,
      sub: "Awaiting supervisor reply",
      icon: Clock,
      iconBg: "bg-burning-flame/15 border-burning-flame/30",
      iconColor: "text-truffle-trouble",
      valueColor: "text-truffle-trouble",
      bar: { pct: totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0, color: "bg-burning-flame" },
    },
    {
      label: "Answered & Resolved",
      value: `${answeredCount} Resolved`,
      sub: `${answeredPct}% resolution rate`,
      icon: CheckCircle2,
      iconBg: "bg-truffle-trouble/10 border-truffle-trouble/20",
      iconColor: "text-truffle-trouble",
      valueColor: "text-truffle-trouble",
      bar: { pct: answeredPct, color: "bg-truffle-trouble" },
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 font-sans">
      {SUMMARY.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.label}
            className="sm:col-span-4 bg-palladian border border-blue-fantastic/15 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <CardContent className="pt-5 pb-4 px-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`h-8 w-8 rounded-xl border flex items-center justify-center ${item.iconBg}`}>
                  <Icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
              </div>
              <div>
                <p className={`text-xl md:text-2xl font-bold font-sans tracking-tight ${item.valueColor} truncate`}>
                  {item.value}
                </p>
                <p className="text-xs text-blue-fantastic/70 font-semibold mt-0.5 truncate">{item.sub}</p>
              </div>
              {item.bar && (
                <div className="h-1.5 rounded-full bg-blue-fantastic/10 overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${item.bar.color} transition-all`}
                    style={{ width: `${item.bar.pct}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
