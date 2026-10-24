"use client";

import React from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { ComplianceReadiness as ComplianceReadinessType } from "@/lib/types/audit";

interface ComplianceReadinessProps {
  readiness?: ComplianceReadinessType;
  onViewReport: () => void;
}

export function ComplianceReadiness({
  readiness,
  onViewReport,
}: ComplianceReadinessProps) {
  const score = readiness?.score ?? 92;
  const rating = readiness?.rating ?? "Good Standing";
  const description =
    readiness?.description ??
    "Automated audit rating based on active site compliance policies";
  const categories = readiness?.categories ?? [
    {
      id: "cat-safety",
      name: "Site Safety & Hazard Audits",
      score: 96,
      color: "emerald",
    },
    {
      id: "cat-docs",
      name: "Document Verification & Blueprint Sign-offs",
      score: 94,
      color: "emerald",
    },
    {
      id: "cat-fin",
      name: "Financial & Invoice Audit Trail",
      score: 98,
      color: "blue",
    },
    {
      id: "cat-workload",
      name: "Supervisor Workload & Checklists",
      score: 88,
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Compliance Rating Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-blue-fantastic mb-1">
            Compliance Readiness Score
          </h3>
          <p className="text-xs text-blue-fantastic/60">{description}</p>
        </div>

        <div className="my-6 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="h-32 w-32 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center bg-emerald-50/30">
              <ShieldCheck className="h-14 w-14 text-emerald-600" />
            </div>
            <div className="ml-6">
              <div className="text-4xl font-bold font-sans text-blue-fantastic">
                {score}%
              </div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">
                {rating}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onViewReport}
          className="w-full text-center text-xs font-semibold text-truffle-trouble hover:underline flex items-center justify-center gap-1 transition-colors"
        >
          View Regulatory Compliance Matrix <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Category Breakdown Progress */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base text-blue-fantastic">
            Compliance Categories Breakdown
          </h3>
          <span className="text-[11px] font-semibold text-blue-fantastic/50">
            {categories.length} Verified Standards
          </span>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const barColor =
              cat.color === "blue"
                ? "bg-blue-fantastic"
                : cat.color === "amber" || cat.score < 90
                ? "bg-truffle-trouble"
                : "bg-emerald-500";

            const textColor =
              cat.color === "blue"
                ? "text-blue-fantastic"
                : cat.color === "amber" || cat.score < 90
                ? "text-amber-600"
                : "text-emerald-600";

            return (
              <div key={cat.id || cat.name}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-fantastic">{cat.name}</span>
                  <span className={`${textColor} font-bold`}>{cat.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{
                      width: `${Math.min(100, Math.max(0, cat.score))}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
