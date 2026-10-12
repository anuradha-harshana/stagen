"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, Eye, CheckCircle2 } from "lucide-react";
import { AtRiskProjectItem } from "@/lib/company-management/dashboardData";
import { Project } from "@/lib/types/project";

interface AtRiskTableProps {
  data: AtRiskProjectItem[];
  onViewProject?: (project: Project) => void;
}

export function AtRiskTable({ data, onViewProject }: AtRiskTableProps) {
  return (
    <Card className="bg-white border border-blue-fantastic/10 hover:border-blue-fantastic/20 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden font-sans transition-all duration-300">
      <CardHeader className="pb-4 pt-5 px-6 flex flex-row items-center justify-between border-b border-blue-fantastic/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-burning-flame/15 flex items-center justify-center text-truffle-trouble">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
              At-Risk & Delayed Projects
            </CardTitle>
            <p className="text-xs text-blue-fantastic/50 font-medium">
              Projects with logged schedule variances or pending action items
            </p>
          </div>
        </div>
        <Link
          href="/company-management/at-risk"
          className="flex items-center gap-1.5 text-xs font-bold text-truffle-trouble hover:underline transition-colors"
        >
          View all in at-risk portal
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-blue-fantastic">All Projects On Track</h4>
            <p className="text-xs text-blue-fantastic/60 mt-1 max-w-sm">
              No construction lots currently have active delays or urgent supervisor flags.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-inset text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider border-b border-blue-fantastic/10">
                <th className="py-3 px-6">Project ID</th>
                <th className="py-3 px-4">Client / Site</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Delay Impact</th>
                <th className="py-3 px-4">% Complete</th>
                <th className="py-3 px-4">Supervisor</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-fantastic/5 text-xs text-blue-fantastic font-medium">
              {data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-surface-inset/70 transition-colors group"
                >
                  <td className="py-3.5 px-6 font-bold text-blue-fantastic">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-blue-fantastic group-hover:text-truffle-trouble transition-colors">
                      {row.customer}
                    </div>
                    <div className="text-[11px] text-blue-fantastic/50 truncate max-w-[200px]">
                      {row.rawProject.address}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-blue-fantastic">
                    {row.stage}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        row.delayDays >= 5 ? "text-truffle-trouble font-extrabold" : "text-burning-flame"
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {row.delayDays} days
                    </span>
                    {row.delayReason && (
                      <div className="text-[10px] text-blue-fantastic/50 truncate max-w-[160px]">
                        {row.delayReason}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-oatmeal/20 rounded-full h-1.5 overflow-hidden">
                        <div
                          style={{ width: `${row.progressPercent}%` }}
                          className="bg-burning-flame h-full rounded-full"
                        />
                      </div>
                      <span className="font-bold text-[11px] text-blue-fantastic">
                        {row.progressPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-blue-fantastic/80 font-medium">
                    {row.supervisor}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-fantastic/5 font-bold text-[11px] text-blue-fantastic">
                      {row.region}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {row.status === "Delayed" ? (
                      <Badge className="bg-burning-flame/15 text-truffle-trouble hover:bg-burning-flame/20 border-none font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                        Delayed
                      </Badge>
                    ) : (
                      <Badge className="bg-burning-flame/20 text-blue-fantastic hover:bg-burning-flame/30 border-none font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                        Action Required
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {onViewProject && (
                      <button
                        onClick={() => onViewProject(row.rawProject)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-fantastic bg-blue-fantastic/5 hover:bg-truffle-trouble hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
