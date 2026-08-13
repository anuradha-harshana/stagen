import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Clock, PlusCircle, ShieldCheck } from "lucide-react"

type DefectStatus = "open" | "in-progress" | "resolved"

const DEFECTS: {
  id: string
  title: string
  area: string
  reported: string
  status: DefectStatus
}[] = [
  { id: "DEF-001", title: "Garage door alignment issue",          area: "Garage",     reported: "Jan 12, 2026", status: "resolved" },
  { id: "DEF-002", title: "Hairline crack – master bedroom wall", area: "Bedroom 1",  reported: "Feb 3, 2026",  status: "in-progress" },
  { id: "DEF-003", title: "Laundry tap dripping",                 area: "Laundry",    reported: "Mar 1, 2026",  status: "open" },
]

const statusConfig: Record<DefectStatus, { label: string; badge: string; dot: string }> = {
  resolved:    { label: "Resolved",    badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold", dot: "bg-truffle-trouble" },
  "in-progress":{ label: "In Progress",badge: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-bold",   dot: "bg-burning-flame" },
  open:        { label: "Open",        badge: "bg-red-500/10 text-red-700 border-red-500/30 font-bold",                       dot: "bg-red-500" },
}

function DefectIcon({ status }: { status: DefectStatus }) {
  if (status === "resolved")    return <CheckCircle2 className="h-4.5 w-4.5 text-truffle-trouble" />
  if (status === "in-progress") return <Clock className="h-4.5 w-4.5 text-truffle-trouble animate-pulse" />
  return <AlertTriangle className="h-4.5 w-4.5 text-red-600" />
}

export function DefectLog() {
  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-sans">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">Defect Log</CardTitle>
          <Button
            size="xs"
            className="ml-auto bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 gap-1.5 shadow-sm font-bold h-7 px-2.5"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Report Defect
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-3 font-sans">
        {DEFECTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <div className="h-12 w-12 rounded-2xl bg-truffle-trouble/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-truffle-trouble" />
            </div>
            <p className="text-sm font-bold text-blue-fantastic/80">No defects reported</p>
            <p className="text-xs text-blue-fantastic/60 font-semibold">Your home is in great shape!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {DEFECTS.map((defect) => {
              const cfg = statusConfig[defect.status]
              return (
                <div
                  key={defect.id}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-transparent hover:bg-blue-fantastic/5 hover:border-blue-fantastic/15 transition-all duration-200 cursor-pointer"
                >
                  <DefectIcon status={defect.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-blue-fantastic font-bold truncate">{defect.title}</p>
                    <p className="text-xs text-blue-fantastic/60 mt-0.5 font-semibold">
                      <span className="font-bold text-blue-fantastic/80">{defect.area}</span> · {defect.reported}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-blue-fantastic/60 font-mono font-semibold hidden sm:inline">{defect.id}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    <Badge variant="outline" className={`text-xs border ${cfg.badge}`}>
                      {cfg.label}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
