"use client";

import React from "react";

export function AuditStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Compliance Score
        </span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold font-sans text-emerald-600">92%</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Good Standing
          </span>
        </div>
        <p className="text-xs text-blue-fantastic/60 mt-2">ISO 27001 & Safety Verified</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Open Compliance Flags
        </span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold font-sans text-truffle-trouble">3</span>
          <span className="text-xs font-semibold text-truffle-trouble bg-truffle-trouble/10 px-2 py-0.5 rounded-full border border-truffle-trouble/20">
            Needs Review
          </span>
        </div>
        <p className="text-xs text-blue-fantastic/60 mt-2">2 Safety, 1 Document Gap</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Audits Completed
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          142
        </div>
        <p className="text-xs text-blue-fantastic/60 mt-2">YTD Site & Financial Audits</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Data Integrity Score
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          98.4%
        </div>
        <p className="text-xs text-emerald-600 font-medium mt-2">✓ Encrypted & Verified</p>
      </div>
    </div>
  );
}
