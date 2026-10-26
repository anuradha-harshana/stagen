"use client";

import React from "react";
import { AuditStats as AuditStatsType } from "@/lib/types/audit";

interface AuditStatsProps {
  stats?: AuditStatsType;
}

export function AuditStats({ stats }: AuditStatsProps) {
  const complianceScore = stats?.complianceScore?.value ?? "92%";
  const complianceRating = stats?.complianceScore?.rating ?? "Good Standing";
  const complianceDesc =
    stats?.complianceScore?.description ?? "ISO 27001 & Safety Verified";

  const openFlags = stats?.openFlags?.value ?? 3;
  const flagsRating = stats?.openFlags?.rating ?? "Needs Review";
  const flagsDesc =
    stats?.openFlags?.description ?? "2 Safety, 1 Document Gap";

  const auditsCompleted = stats?.auditsCompleted?.value ?? 142;
  const auditsDesc =
    stats?.auditsCompleted?.description ?? "YTD Site & Financial Audits";

  const dataIntegrity = stats?.dataIntegrityScore?.value ?? "98.4%";
  const integrityDesc =
    stats?.dataIntegrityScore?.description ?? "✓ Encrypted & Verified";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Compliance Score
        </span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold font-sans text-emerald-600">
            {complianceScore}
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {complianceRating}
          </span>
        </div>
        <p className="text-xs text-blue-fantastic/60 mt-2">{complianceDesc}</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Open Compliance Flags
        </span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold font-sans text-truffle-trouble">
            {openFlags}
          </span>
          <span className="text-xs font-semibold text-truffle-trouble bg-truffle-trouble/10 px-2 py-0.5 rounded-full border border-truffle-trouble/20">
            {flagsRating}
          </span>
        </div>
        <p className="text-xs text-blue-fantastic/60 mt-2">{flagsDesc}</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Audits Completed
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          {auditsCompleted}
        </div>
        <p className="text-xs text-blue-fantastic/60 mt-2">{auditsDesc}</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Data Integrity Score
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          {dataIntegrity}
        </div>
        <p className="text-xs text-emerald-600 font-medium mt-2">{integrityDesc}</p>
      </div>
    </div>
  );
}
