import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react"

const SUMMARY = [
  {
    label: "Contract Value",
    value: "$485,000",
    sub: "Total project amount",
    icon: DollarSign,
    iconBg: "bg-blue-fantastic/10 border-blue-fantastic/20",
    iconColor: "text-blue-fantastic",
    valueColor: "text-blue-fantastic",
    bar: null,
  },
  {
    label: "Amount Paid",
    value: "$218,250",
    sub: "45% of contract",
    icon: CheckCircle2,
    iconBg: "bg-truffle-trouble/10 border-truffle-trouble/20",
    iconColor: "text-truffle-trouble",
    valueColor: "text-truffle-trouble",
    bar: { pct: 45, color: "bg-truffle-trouble" },
  },
  {
    label: "Next Due",
    value: "$97,000",
    sub: "Stage 3 – Lock-up",
    icon: Clock,
    iconBg: "bg-burning-flame/15 border-burning-flame/30",
    iconColor: "text-truffle-trouble", // changed to truffle-trouble for better contrast
    valueColor: "text-blue-fantastic",
    bar: null,
  },
  {
    label: "Outstanding",
    value: "$169,750",
    sub: "Remaining balance",
    icon: AlertCircle,
    iconBg: "bg-blue-fantastic/10 border-blue-fantastic/25",
    iconColor: "text-blue-fantastic",
    valueColor: "text-blue-fantastic/80",
    bar: { pct: 35, color: "bg-blue-fantastic/40" },
  },
]

export function InvoicesSummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-9 gap-3 font-sans">
      {SUMMARY.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.label}
            className="col-span-3 bg-white border border-blue-fantastic/15 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <CardContent className="pt-5 pb-4 px-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider">{item.label}</span>
                <div className={`h-8 w-8 rounded-xl border flex items-center justify-center ${item.iconBg}`}>
                  <Icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
              </div>
              <div>
                <p className={`text-2xl font-bold font-sans tracking-tight ${item.valueColor}`}>{item.value}</p>
                <p className="text-xs text-blue-fantastic/70 font-semibold mt-0.5">{item.sub}</p>
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
