import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, CheckCircle2, Clock, Circle, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

type ServiceStatus = "completed" | "scheduled" | "upcoming"

const SERVICES: {
  title: string
  date: string
  provider: string
  status: ServiceStatus
  notes: string
}[] = [
  { title: "3-Month Defects Inspection",  date: "Mar 15, 2026", provider: "Stagen Site Manager", status: "completed", notes: "Minor touch-up paintwork completed." },
  { title: "6-Month Maintenance Check",   date: "Jun 15, 2026", provider: "Stagen Homes",         status: "scheduled", notes: "Confirmation sent via email." },
  { title: "Annual HVAC Service",         date: "Dec 10, 2026", provider: "CoolAir Systems",       status: "upcoming",  notes: "" },
  { title: "12-Month Defects Inspection", date: "Dec 15, 2026", provider: "Stagen Site Manager",   status: "upcoming",  notes: "" },
  { title: "5-Year Structural Review",    date: "Dec 15, 2030", provider: "Stagen Homes",          status: "upcoming",  notes: "" },
]

const statusConfig: Record<ServiceStatus, { label: string; badge: string; dot: string }> = {
  completed: { label: "Completed", badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold", dot: "bg-truffle-trouble" },
  scheduled: { label: "Scheduled", badge: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-bold",      dot: "bg-burning-flame" },
  upcoming:  { label: "Upcoming",  badge: "bg-blue-fantastic/5 text-blue-fantastic/70 border-blue-fantastic/20 font-bold", dot: "bg-blue-fantastic/30" },
}

function StatusIcon({ status }: { status: ServiceStatus }) {
  if (status === "completed") return <CheckCircle2 className="h-4.5 w-4.5 text-truffle-trouble shrink-0" />
  if (status === "scheduled") return <Clock className="h-4.5 w-4.5 text-truffle-trouble shrink-0 animate-pulse" />
  return <Circle className="h-4.5 w-4.5 text-blue-fantastic/30 shrink-0" />
}

export function MaintenanceTimeline() {
  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-cream">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <Wrench className="h-4 w-4 text-truffle-trouble" />
          </div>
          <CardTitle className="text-blue-fantastic text-sm font-bold font-cream">Maintenance Schedule</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-0">
          {SERVICES.map((service, idx) => {
            const cfg = statusConfig[service.status]
            return (
              <div key={idx} className="relative flex items-start gap-3">
                {idx < SERVICES.length - 1 && (
                  <span
                    className={cn(
                      "absolute left-[8px] top-5 w-[1.5px] h-full",
                      service.status === "completed" ? "bg-truffle-trouble/30" : "bg-blue-fantastic/15"
                    )}
                  />
                )}
                <div className="mt-0.5 z-10 shrink-0">
                  <StatusIcon status={service.status} />
                </div>
                <div
                  className={cn(
                    "flex-1 pb-4 pl-1",
                    service.status === "upcoming" ? "text-blue-fantastic/75" : "text-blue-fantastic"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className={cn(
                        "text-sm font-bold leading-tight",
                        service.status === "upcoming" ? "text-blue-fantastic/80" : "text-blue-fantastic"
                      )}>
                        {service.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <CalendarDays className="h-3 w-3 text-blue-fantastic/55" />
                        <p className="text-xs text-blue-fantastic/70 font-semibold">
                          {service.date} · {service.provider}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      <Badge variant="outline" className={`text-xs border ${cfg.badge}`}>
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                  {service.notes && (
                    <p className="text-xs text-blue-fantastic/85 mt-1.5 font-semibold bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-lg px-2.5 py-1.5">
                      {service.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
