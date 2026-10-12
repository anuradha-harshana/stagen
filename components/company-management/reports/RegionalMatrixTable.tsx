"use client";

import React from "react";

export interface RegionalReport {
  region: string;
  totalSites: number;
  activeSites: number;
  onTimePct: number;
  avgDelayDays: number;
  supervisors: number;
  efficiencyScore: number;
}

interface RegionalMatrixTableProps {
  reports: RegionalReport[];
}

export function RegionalMatrixTable({ reports }: RegionalMatrixTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-fantastic/15 overflow-hidden">
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
              <th className="py-3 px-6 font-semibold">Region / State</th>
              <th className="py-3 px-6 font-semibold">Total Sites</th>
              <th className="py-3 px-6 font-semibold">Active Sites</th>
              <th className="py-3 px-6 font-semibold">On-Time %</th>
              <th className="py-3 px-6 font-semibold">Avg Delay Days</th>
              <th className="py-3 px-6 font-semibold">Supervisors</th>
              <th className="py-3 px-6 font-semibold text-right">Efficiency Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {reports.map((rep) => (
              <tr key={rep.region} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-6 font-bold text-blue-fantastic">
                  {rep.region}
                </td>
                <td className="py-3.5 px-6 font-semibold text-blue-fantastic">
                  {rep.totalSites}
                </td>
                <td className="py-3.5 px-6 font-medium text-emerald-600">
                  {rep.activeSites}
                </td>
                <td className="py-3.5 px-6 font-bold text-blue-fantastic">
                  {rep.onTimePct}%
                </td>
                <td className="py-3.5 px-6 text-blue-fantastic/80">
                  {rep.avgDelayDays} days
                </td>
                <td className="py-3.5 px-6 font-medium text-blue-fantastic">
                  {rep.supervisors} Supervisors
                </td>
                <td className="py-3.5 px-6 text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-truffle-trouble/10 text-truffle-trouble border border-truffle-trouble/20">
                    {rep.efficiencyScore} / 100
                  </span>
                </td>
              </tr>
            ))}

            {reports.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-blue-fantastic/50 text-xs">
                  No regional reports match your selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
