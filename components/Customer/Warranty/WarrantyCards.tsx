import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, Zap, Droplets, Wind, ExternalLink, ShieldCheck } from "lucide-react"
import type { WarrantyItem, WarrantyStatus } from "@/lib/customer/warranty"

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  Droplets,
  Zap,
  Wind,
  ShieldCheck,
}

const DEFAULT_WARRANTIES: WarrantyItem[] = []

const statusConfig: Record<WarrantyStatus, { badge: string; dot: string }> = {
  Active:          { badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold", dot: "bg-truffle-trouble" },
  "Expiring Soon": { badge: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-bold",   dot: "bg-burning-flame" },
  Expired:         { badge: "bg-red-500/10 text-red-700 border-red-500/30 font-bold",                       dot: "bg-red-500" },
}

interface WarrantyCardsProps {
  warranties?: WarrantyItem[];
}

export function WarrantyCards({ warranties = DEFAULT_WARRANTIES }: WarrantyCardsProps) {
  const list = warranties.length > 0 ? warranties : DEFAULT_WARRANTIES

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
      {list.map((item) => {
        const Icon = ICON_MAP[item.icon_key] || Home
        const cfg = statusConfig[item.status] || statusConfig.Active
        const yearsTotal = item.years_total || 1
        const yearsLeft = item.years_left || 0
        const pct = Math.min(100, Math.max(0, Math.round((yearsLeft / yearsTotal) * 100)))

        return (
          <Card
            key={item.id || item.title}
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
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 text-blue-fantastic/60 hover:text-truffle-trouble opacity-0 group-hover:opacity-100 transition-opacity"
                  title="View Certificate Details"
                >
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
                  <span className="text-truffle-trouble font-bold">{yearsLeft}y of {yearsTotal}y</span>
                </div>
                <div className="h-1.5 rounded-full bg-blue-fantastic/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-truffle-trouble to-burning-flame/70 transition-all duration-500"
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
                <span className="text-xs text-blue-fantastic/40 font-mono ml-auto">
                  {item.period} period
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
