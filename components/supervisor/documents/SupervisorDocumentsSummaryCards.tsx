import { Card, CardContent } from "@/components/ui/card"
import { FileText, Eye, ShieldCheck, Clock } from "lucide-react"
import { DocumentUploadPayload } from "./DocumentUploadForm"

interface SummaryProps {
  selectedProject: { code: string; name: string }
  totalCount: number
  publicCount: number
  latestDoc?: DocumentUploadPayload
}

export function SupervisorDocumentsSummaryCards({
  selectedProject,
  totalCount = 0,
  publicCount = 0,
  latestDoc,
}: SummaryProps) {
  const privateCount = Math.max(0, totalCount - publicCount)
  const publicPct = totalCount > 0 ? Math.round((publicCount / totalCount) * 100) : 0

  const SUMMARY = [
    {
      label: "Total Site Uploads",
      value: `${totalCount} Docs`,
      sub: `${selectedProject.code} · ${selectedProject.name}`,
      icon: FileText,
      iconBg: "bg-blue-fantastic/10 border-blue-fantastic/20",
      iconColor: "text-blue-fantastic",
      valueColor: "text-blue-fantastic",
      bar: null,
    },
    {
      label: "Customer Visible",
      value: `${publicCount} Docs`,
      sub: `${publicPct}% shared with client`,
      icon: Eye,
      iconBg: "bg-truffle-trouble/10 border-truffle-trouble/20",
      iconColor: "text-truffle-trouble",
      valueColor: "text-truffle-trouble",
      bar: { pct: publicPct, color: "bg-truffle-trouble" },
    },
    {
      label: "Internal & Mgmt",
      value: `${privateCount} Docs`,
      sub: "Restricted team visibility",
      icon: ShieldCheck,
      iconBg: "bg-burning-flame/15 border-burning-flame/30",
      iconColor: "text-truffle-trouble",
      valueColor: "text-blue-fantastic",
      bar: null,
    },
    {
      label: "Latest Activity",
      value: latestDoc ? latestDoc.dateOfUpdate.split("-")[0].trim() : "No Activity",
      sub: latestDoc ? latestDoc.title : `No uploads for ${selectedProject.code}`,
      icon: Clock,
      iconBg: "bg-blue-fantastic/10 border-blue-fantastic/25",
      iconColor: "text-blue-fantastic",
      valueColor: "text-blue-fantastic/80",
      bar: { pct: 100, color: "bg-blue-fantastic/40" },
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 font-cream">
      {SUMMARY.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.label}
            className="sm:col-span-3 bg-palladian border border-blue-fantastic/15 shadow-sm hover:shadow-md transition-all duration-200"
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
                <p className={`text-xl md:text-2xl font-bold font-cream tracking-tight ${item.valueColor} truncate`}>
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
