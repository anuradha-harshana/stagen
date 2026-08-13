"use client";


export function BillingUsageBreakdown() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sites by Status */}
      <div className="bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15">
        <h3 className="font-semibold text-base text-blue-fantastic mb-4">
          Sites by Status
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Active</span>
              <span>120 Sites</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "63%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>On Hold / Suspended</span>
              <span>8 Sites</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-truffle-trouble rounded-full" style={{ width: "12%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Completed / Handed Over</span>
              <span>62 Sites</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-fantastic rounded-full" style={{ width: "35%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Region */}
      <div className="bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15">
        <h3 className="font-semibold text-base text-blue-fantastic mb-4">
          Revenue by Region
        </h3>
        <div className="space-y-3">
          {[
            { region: "NSW", amount: "$102,450", pct: "41%" },
            { region: "VIC", amount: "$78,320", pct: "32%" },
            { region: "QLD", amount: "$46,890", pct: "19%" },
            { region: "WA", amount: "$17,340", pct: "8%" },
          ].map((reg) => (
            <div key={reg.region} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
              <span className="font-semibold text-blue-fantastic">{reg.region}</span>
              <div className="flex items-center gap-4">
                <span className="text-blue-fantastic/60">{reg.pct}</span>
                <span className="font-bold text-blue-fantastic">{reg.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
