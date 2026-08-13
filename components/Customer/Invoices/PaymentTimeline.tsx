import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle2, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type MilestoneStatus = "paid" | "pending" | "upcoming"

const MILESTONES: {
  label: string
  amount: string
  date: string
  status: MilestoneStatus
  pct: number
}[] = [
  { label: "Deposit",     amount: "$97,000",  date: "Apr 1, 2025",  status: "paid",     pct: 20 },
  { label: "Foundation",  amount: "$72,750",  date: "May 20, 2025", status: "paid",     pct: 15 },
  { label: "Frame",       amount: "$48,500",  date: "Jul 5, 2025",  status: "paid",     pct: 10 },
  { label: "Lock-up",     amount: "$97,000",  date: "Aug 17, 2025", status: "pending",  pct: 20 },
  { label: "Fixing",      amount: "$97,000",  date: "Oct 6, 2025",  status: "upcoming", pct: 20 },
  { label: "Completion",  amount: "$72,750",  date: "Dec 6, 2025",  status: "upcoming", pct: 15 },
]

function MilestoneIcon({ status }: { status: MilestoneStatus }) {
  if (status === "paid")    return <CheckCircle2 className="h-4.5 w-4.5 text-truffle-trouble shrink-0" />
  if (status === "pending") return <Clock className="h-4.5 w-4.5 text-truffle-trouble shrink-0 animate-pulse" />
  return <Circle className="h-4.5 w-4.5 text-blue-fantastic/30 shrink-0" />
}

export function PaymentTimeline() {
  const paid = MILESTONES.filter((m) => m.status === "paid").length

  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-sans">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-burning-flame/15 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-truffle-trouble" />
          </div>
          <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">Payment Schedule</CardTitle>
          <span className="ml-auto text-xs text-blue-fantastic/70 font-semibold">
            {paid}/{MILESTONES.length} milestones
          </span>
        </div>
        {/* mini overall progress */}
        <div className="h-1.5 mt-2 rounded-full bg-blue-fantastic/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-truffle-trouble"
            style={{ width: `${Math.round((paid / MILESTONES.length) * 100)}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-0">
          {MILESTONES.map((milestone, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              {idx < MILESTONES.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[8px] top-5 w-[1.5px]",
                    "h-full",
                    milestone.status === "paid" ? "bg-truffle-trouble/40" : "bg-blue-fantastic/15"
                  )}
                />
              )}
              <div className="mt-0.5 z-10 shrink-0">
                <MilestoneIcon status={milestone.status} />
              </div>
              <div
                className={cn(
                  "flex-1 flex items-center justify-between pb-4 pl-1",
                  milestone.status === "upcoming" && "opacity-75"
                )}
              >
                <div>
                  <p className={cn(
                    "text-sm font-bold",
                    milestone.status === "paid"    ? "text-blue-fantastic"
                    : milestone.status === "pending" ? "text-truffle-trouble"
                    : "text-blue-fantastic/80"
                  )}>
                    {milestone.label}
                    {milestone.status === "pending" && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-truffle-trouble/90 bg-burning-flame/15 px-1.5 py-0.5 rounded border border-burning-flame/20">Due now</span>
                    )}
                  </p>
                  <p className="text-xs text-blue-fantastic/60 font-semibold mt-0.5">{milestone.date} · {milestone.pct}% of contract</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "text-sm font-bold tabular-nums",
                    milestone.status === "paid"    ? "text-truffle-trouble"
                    : milestone.status === "pending" ? "text-truffle-trouble"
                    : "text-blue-fantastic/60"
                  )}>
                    {milestone.amount}
                  </span>
                  {milestone.status === "pending" && (
                    <Button size="xs" className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 shadow-sm font-bold">
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
