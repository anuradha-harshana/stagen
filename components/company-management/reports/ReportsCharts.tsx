"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export function ReportsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Site Velocity & Completion Area Chart */}
      <div className="lg:col-span-2 bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-base text-blue-fantastic">
              Monthly Site Progress & Completion Trends
            </h3>
            <p className="text-xs text-blue-fantastic/60">
              Scheduled vs completed site milestone targets across active sites
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-fantastic"></span>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-burning-flame"></span>
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* SVG Grouped Bar Chart */}
        <div className="h-64 w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
            {/* Horizontal Grid */}
            <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="0" y1="180" x2="500" y2="180" stroke="#CBD5E1" />

            {/* Month 1: Jan */}
            <rect x="40" y="80" width="20" height="100" fill="#2C3B4D" rx="3" />
            <rect x="65" y="95" width="20" height="85" fill="#FFB162" rx="3" />

            {/* Month 2: Feb */}
            <rect x="120" y="60" width="20" height="120" fill="#2C3B4D" rx="3" />
            <rect x="145" y="70" width="20" height="110" fill="#FFB162" rx="3" />

            {/* Month 3: Mar */}
            <rect x="200" y="50" width="20" height="130" fill="#2C3B4D" rx="3" />
            <rect x="225" y="55" width="20" height="125" fill="#FFB162" rx="3" />

            {/* Month 4: Apr */}
            <rect x="280" y="70" width="20" height="110" fill="#2C3B4D" rx="3" />
            <rect x="305" y="80" width="20" height="100" fill="#FFB162" rx="3" />

            {/* Month 5: May */}
            <rect x="360" y="40" width="20" height="140" fill="#2C3B4D" rx="3" />
            <rect x="385" y="45" width="20" height="135" fill="#FFB162" rx="3" />

            {/* Month 6: Jun */}
            <rect x="440" y="30" width="20" height="150" fill="#2C3B4D" rx="3" />
            <rect x="465" y="35" width="20" height="145" fill="#FFB162" rx="3" />
          </svg>

          <div className="flex justify-between text-xs text-blue-fantastic/60 mt-3 px-6">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>

      {/* Stage Bottlenecks Breakdown */}
      <div className="bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-blue-fantastic">
            Average Days Per Construction Stage
          </h3>
          <p className="text-xs text-blue-fantastic/60">
            Comparing average days vs target benchmark
          </p>
        </div>

        <div className="space-y-4 my-4">
          {[
            { stage: "Base Slab & Foundation", days: "12 Days", target: "14 Days", status: "Ahead", pct: 85, color: "bg-emerald-500" },
            { stage: "Frame & Lockup", days: "18 Days", target: "15 Days", status: "Delayed", pct: 110, color: "bg-rose-500" },
            { stage: "Services & Fitout", days: "14 Days", target: "14 Days", status: "On Track", pct: 100, color: "bg-blue-fantastic" },
            { stage: "Linings & Carpentry", days: "10 Days", target: "12 Days", status: "Ahead", pct: 83, color: "bg-emerald-500" },
            { stage: "Practical Completion", days: "7 Days", target: "8 Days", status: "Ahead", pct: 88, color: "bg-emerald-500" },
          ].map((stg) => (
            <div key={stg.stage} className="text-xs space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-blue-fantastic">{stg.stage}</span>
                <span className="text-blue-fantastic">{stg.days} <span className="font-normal text-blue-fantastic/50">(Target: {stg.target})</span></span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${stg.color} rounded-full`} style={{ width: `${Math.min(stg.pct, 100)}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Operational Bottleneck:</span> Frame & Lockup stage in VIC region averaging +3 days delay due to timber supply chain schedules.
          </div>
        </div>
      </div>
    </div>
  );
}
