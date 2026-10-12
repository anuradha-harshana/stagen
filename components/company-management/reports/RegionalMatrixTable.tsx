"use client";

import React from "react";
import { RegionalReport } from "@/lib/types/reports";

interface RegionalMatrixTableProps {
  reports: RegionalReport[];
  isLoading?: boolean;
}

export function RegionalMatrixTable({ reports, isLoading }: RegionalMatrixTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-fantastic/15 overflow-hidden font-sans">
      <div className="p-6 border-b border-blue-fantastic/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base text-blue-fantastic">
            Regional Operational Matrix
          </h3>
          <p className="text-xs text-blue-fantastic/60">
            State-by-state operational velocity, active sites, and supervisor workload ratios
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-blue-fantastic/60 border-b border-blue-fantastic/15">
              <th className="py-3 px-6 font-semibold text-left">Region / State</th>
              <th className="py-3 px-6 font-semibold text-center">Total Sites</th>
              <th className="py-3 px-6 font-semibold text-center">Active Sites</th>
              <th className="py-3 px-6 font-semibold text-center">On-Time %</th>
              <th className="py-3 px-6 font-semibold text-center">Avg Delay Days</th>
              <th className="py-3 px-6 font-semibold text-center">Supervisors</th>
              <th className="py-3 px-6 font-semibold text-center">Efficiency Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 px-6"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                  <td className="py-3.5 px-6 text-center"><div className="h-4 bg-slate-100 rounded w-12 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center"><div className="h-4 bg-slate-100 rounded w-12 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center"><div className="h-4 bg-slate-100 rounded w-16 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center"><div className="h-4 bg-slate-100 rounded w-16 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center"><div className="h-4 bg-slate-100 rounded w-20 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center"><div className="h-5 bg-slate-100 rounded-full w-16 mx-auto" /></td>
                </tr>
              ))
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-blue-fantastic/50 text-xs">
                  No regional reports match your selection.
                </td>
              </tr>
            ) : (
              reports.map((rep) => (
                <tr key={rep.region} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-blue-fantastic text-left">
                    {rep.region}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-blue-fantastic text-center">
                    {rep.totalSites}
                  </td>
                  <td className="py-3.5 px-6 font-medium text-emerald-600 text-center">
                    {rep.activeSites}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-blue-fantastic text-center">
                    {rep.onTimePct}%
                  </td>
                  <td className="py-3.5 px-6 text-blue-fantastic/80 text-center">
                    {rep.avgDelayDays} days
                  </td>
                  <td className="py-3.5 px-6 font-medium text-blue-fantastic text-center">
                    {rep.supervisors} Supervisors
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-truffle-trouble/10 text-truffle-trouble border border-truffle-trouble/20">
                      {rep.efficiencyScore} / 100
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
