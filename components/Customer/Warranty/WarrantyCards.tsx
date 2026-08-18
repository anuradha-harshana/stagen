import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, Zap, Droplets, Wind, ExternalLink, ShieldCheck } from "lucide-react"

type WarrantyStatus = "Active" | "Expiring Soon" | "Expired"

type WarrantyItem = {
  icon: React.ElementType
  title: string
  provider: string
  period: string
  expiry: string
  status: WarrantyStatus
  description: string
  yearsTotal: number
  yearsLeft: number
}

const WARRANTIES: WarrantyItem[] = [
  {
    icon: Home,
    title: "Structural Warranty",
    provider: "Stagen Homes",
    period: "6 Years",
    expiry: "Dec 2031",
    status: "Active",
    description: "Full structural integrity coverage including foundations, frame, and load-bearing walls.",
    yearsTotal: 6,
    yearsLeft: 5.5,
  },
  {
    icon: Droplets,
    title: "Waterproofing",
    provider: "Stagen Homes",
    period: "6 Years",
    expiry: "Dec 2031",
    status: "Active",
    description: "Roof, bathroom, laundry, and wet area waterproofing coverage.",
    yearsTotal: 6,
    yearsLeft: 5.5,
  },
  {
    icon: Zap,
    title: "Electrical Systems",
    provider: "ElectroPro Pty Ltd",
    period: "2 Years",
    expiry: "Dec 2027",
    status: "Active",
    description: "Wiring, switchboards, power points, and all fixed electrical fittings.",
    yearsTotal: 2,
    yearsLeft: 1.5,
  },
  {
    icon: Wind,
    title: "HVAC & Ventilation",
    provider: "CoolAir Systems",
    period: "5 Years",
    expiry: "Dec 2030",
    status: "Active",
    description: "Ducted air conditioning, mechanical ventilation, and exhaust systems.",
    yearsTotal: 5,
    yearsLeft: 4.5,
  },
]

const statusConfig: Record<WarrantyStatus, { badge: string; dot: string }> = {
  Active:          { badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold", dot: "bg-truffle-trouble" },
  "Expiring Soon": { badge: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-bold",   dot: "bg-burning-flame" },
  Expired:         { badge: "bg-red-500/10 text-red-700 border-red-500/30 font-bold",                       dot: "bg-red-500" },
}

export function WarrantyCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
      {WARRANTIES.map((item) => {
        const Icon = item.icon
        const cfg = statusConfig[item.status]
        const pct = Math.round((item.yearsLeft / item.yearsTotal) * 100)

        return (
          <Card
            key={item.title}
            className="group relative overflow-hidden bg-white border border-blue-fantastic/15 shadow-sm hover:shadow-md hover:border-blue-fantastic/30 transition-all duration-200"
          >
            {/* top accent strip */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-burning-flame/50 via-truffle-trouble/50 to-transparent" />

            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-truffle-trouble" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">{item.title}</CardTitle>
                    <div className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      <Badge variant="outline" className={`text-xs border ${cfg.badge}`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-blue-fantastic/70 font-semibold mt-0.5">{item.provider}</p>
                </div>
                <Button variant="ghost" size="icon-xs" className="shrink-0 text-blue-fantastic/60 hover:text-truffle-trouble opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              <p className="text-xs text-blue-fantastic/80 leading-relaxed font-semibold">{item.description}</p>

              {/* coverage duration bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-blue-fantastic/70">Coverage remaining</span>
                  <span className="text-truffle-trouble font-bold">{item.yearsLeft}y of {item.yearsTotal}y</span>
                </div>
                <div className="h-1.5 rounded-full bg-blue-fantastic/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-truffle-trouble to-burning-flame/70 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1.5 border-t border-blue-fantastic/10">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-truffle-trouble" />
                  <span className="text-xs text-blue-fantastic/70 font-semibold">Until</span>
                  <span className="text-xs text-blue-fantastic font-bold">{item.expiry}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
