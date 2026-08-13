import { Receipt } from "lucide-react"

export function InvoicesHeader() {
  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-blue-fantastic/15 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <Receipt className="h-5 w-5 text-burning-flame" />
          </div>
          <div>
            <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
              Invoices &amp; Payments
            </h1>
            <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
              Track your payment schedule and invoice history
            </p>
          </div>
        </div>

        {/* progress indicator */}
        <div className="flex items-center gap-3 rounded-2xl bg-blue-fantastic/8 border border-blue-fantastic/10 px-4 py-2 w-full sm:w-72">
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-blue-fantastic">
              <span>Overall Progress</span>
              <span className="text-truffle-trouble font-bold">45% Paid</span>
            </div>
            <div className="h-1.5 rounded-full bg-blue-fantastic/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-truffle-trouble"
                style={{ width: "45%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
