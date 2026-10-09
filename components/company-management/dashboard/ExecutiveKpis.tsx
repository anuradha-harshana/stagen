"use client";

import React from "react";
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Award,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyManagementKpis } from "@/lib/company-management/dashboardData";

interface ExecutiveKpisProps {
  kpis: CompanyManagementKpis;
}

export function ExecutiveKpis({ kpis }: ExecutiveKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans w-full">
      {/* Total Projects Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Total Projects
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {kpis.totalProjects}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">
              {kpis.activeProjects} active construction lots
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-fantastic/10 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
            <FolderKanban className="h-6 w-6 text-blue-fantastic" />
          </div>
        </CardContent>
      </Card>

      {/* On Track Projects Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              On Track
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {kpis.onTrackProjects}
            </h2>
            <p className="text-xs text-emerald-600 font-medium">
              Running according to schedule
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:rotate-6 transition-all duration-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Delayed & Actions Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Delayed / Attention
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {kpis.delayedProjects}
            </h2>
            <p className="text-xs text-truffle-trouble font-medium">
              Requires supervisor check
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-burning-flame/15 text-truffle-trouble group-hover:rotate-6 transition-all duration-300">
            <AlertTriangle className="h-6 w-6 text-truffle-trouble" />
          </div>
        </CardContent>
      </Card>

      {/* Completed & Avg Progress Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Avg Site Progress
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
                {kpis.avgProgress}%
              </h2>
              <span className="text-xs font-semibold text-blue-fantastic/50">
                ({kpis.completedProjects} handed over)
              </span>
            </div>
            <div className="w-28 bg-oatmeal/30 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                style={{ width: `${kpis.avgProgress}%` }}
                className="bg-burning-flame h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-oatmeal/30 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
            <TrendingUp className="h-6 w-6 text-blue-fantastic" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
