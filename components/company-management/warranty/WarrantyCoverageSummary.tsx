"use client";

import React from "react";
import { ShieldCheck, Shield, HelpCircle, ShieldAlert } from "lucide-react";

export default function WarrantyCoverageSummary() {
  const coverages = [
    {
      lot: "Lot 104",
      client: "Anuradha Harshana",
      minorRemaining: "62 days remaining",
      minorProgress: 68,
      structural: "Active (6 Years)",
    },
    {
      lot: "Lot 208",
      client: "Sarah Jenkins",
      minorRemaining: "75 days remaining",
      minorProgress: 83,
      structural: "Active (6 Years)",
    },
    {
      lot: "Lot 312",
      client: "Marcus Vance",
      minorRemaining: "Not Started (Pre-Handover)",
      minorProgress: 0,
      structural: "Pending Handover",
    },
  ];

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Warranty Periods Overview */}
      <div className="bg-white p-6 rounded-2xl border border-blue-fantastic/10 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-blue-fantastic/5">
          <Shield className="h-4.5 w-4.5 text-truffle-trouble" />
          <h3 className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">
            Active Coverage Policies
          </h3>
        </div>

        <p className="text-[11px] text-blue-fantastic/60 font-semibold leading-relaxed">
          Standard liability period monitoring for client handovers. Counts down from signoff date.
        </p>

        <div className="space-y-4">
          {coverages.map((c) => (
            <div key={c.lot} className="p-3.5 bg-blue-fantastic/4 border border-blue-fantastic/5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-blue-fantastic">{c.lot}</span>
                <span className="text-blue-fantastic/50 font-medium text-[10px]">{c.client}</span>
              </div>

              {/* Minor defects progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-blue-fantastic/70">
                  <span>90-Day Minor Defect Scope</span>
                  <span>{c.minorRemaining}</span>
                </div>
                {c.minorProgress > 0 && (
                  <div className="h-1.5 rounded-full bg-blue-fantastic/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-truffle-trouble"
                      style={{ width: `${c.minorProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Structural warranty */}
              <div className="flex items-center justify-between pt-1 text-[10px] font-semibold text-blue-fantastic/70">
                <span>6-Year Structural Guarantee</span>
                <div className="flex items-center gap-1">
                  {c.structural.includes("Active") ? (
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <HelpCircle className="h-3.5 w-3.5 text-blue-fantastic/40" />
                  )}
                  <span className="font-bold text-blue-fantastic">{c.structural}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Policy reminder */}
      <div className="bg-white p-6 rounded-2xl border border-blue-fantastic/10 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-blue-fantastic/5">
          <ShieldAlert className="h-4.5 w-4.5 text-burning-flame" />
          <h3 className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">
            SLA Policy Guidelines
          </h3>
        </div>

        <ul className="space-y-2 text-[11px] text-blue-fantastic/70 font-semibold list-disc pl-4 leading-relaxed">
          <li><strong>High Priority</strong> defects must be assigned and inspected within 48 hours.</li>
          <li>Standard maintenance queries have a target resolution timeline of <strong>14 business days</strong>.</li>
          <li>Unassigned tickets older than 3 days trigger system alerts automatically.</li>
        </ul>
      </div>
    </div>
  );
}
