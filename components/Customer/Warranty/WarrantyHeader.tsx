import { ShieldCheck } from "lucide-react"

export function WarrantyHeader() {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-blue-fantastic/15 font-sans">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
          <ShieldCheck className="h-5 w-5 text-burning-flame" />
        </div>
        <div>
          <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
            Warranty &amp; Maintenance
          </h1>
          <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
            Coverage details, defect periods &amp; scheduled services
          </p>
        </div>
      </div>

      {/* coverage summary pills */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 rounded-full border border-blue-fantastic/15 bg-blue-fantastic/5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-truffle-trouble" />
          <span className="text-xs text-blue-fantastic font-semibold">4 Active Warranties</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-blue-fantastic/15 bg-blue-fantastic/5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-truffle-trouble" />
          <span className="text-xs text-blue-fantastic font-semibold">1 Scheduled Service</span>
        </div>
      </div>
    </div>
  )
}
