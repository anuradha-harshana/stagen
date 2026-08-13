"use client";

import React from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";

interface ComplianceReadinessProps {
  onViewReport: () => void;
}

export function ComplianceReadiness({ onViewReport }: ComplianceReadinessProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Compliance Rating Card */}
      <div className="bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-blue-fantastic mb-1">
            Compliance Readiness Score
          </h3>
          <p className="text-xs text-blue-fantastic/60">
            Automated audit rating based on active site compliance policies
          </p>
        </div>

        <div className="my-6 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="h-32 w-32 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center bg-emerald-50/30">
              <ShieldCheck className="h-14 w-14 text-emerald-600" />
            </div>
            <div className="ml-6">
              <div className="text-4xl font-bold font-sans text-blue-fantastic">92%</div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">
                Good Standing
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onViewReport}
          className="w-full text-center text-xs font-semibold text-truffle-trouble hover:underline flex items-center justify-center gap-1"
        >
          View Compliance Report <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Category Breakdown Progress */}
      <div className="lg:col-span-2 bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15 space-y-4">
        <h3 className="font-semibold text-base text-blue-fantastic">
          Compliance Categories Breakdown
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Site Safety & Hazard Audits</span>
              <span className="text-emerald-600 font-bold">96%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Document Verification & Blueprint Sign-offs</span>
              <span className="text-emerald-600 font-bold">94%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Financial & Invoice Audit Trail</span>
              <span className="text-emerald-600 font-bold">98%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-fantastic rounded-full" style={{ width: "98%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Supervisor Workload & Checklists</span>
              <span className="text-amber-600 font-bold">88%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-truffle-trouble rounded-full" style={{ width: "88%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
