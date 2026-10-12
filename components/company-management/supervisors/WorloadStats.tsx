"use client";

import React from "react";
import { UsersRound, AlertOctagon, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/lib/db-mock/projectsData";

interface WorkloadStatsProps {
  projects: Project[];
  supervisorCount: number;
}

export default function WorkloadStats({
  projects,
  supervisorCount,
}: WorkloadStatsProps) {
  const unassignedCount = projects.filter((p) => !p.supervisorName).length;
  const assignedCount = projects.filter((p) => p.supervisorName).length;
  const avgLoad = supervisorCount > 0 ? (assignedCount / supervisorCount).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-sans">
      {/* Active Supervisors Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Active Supervisors
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {supervisorCount}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Currently managing active lots</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-fantastic/10 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
            <UsersRound className="h-6 w-6 text-blue-fantastic" />
          </div>
        </CardContent>
      </Card>

      {/* Unassigned Lots Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Unassigned Lots
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {unassignedCount}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Requires supervisor assignment</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-burning-flame/15 text-truffle-trouble group-hover:rotate-6 transition-all duration-300">
            <AlertOctagon className="h-6 w-6 text-truffle-trouble" />
          </div>
        </CardContent>
      </Card>

      {/* Average Workload Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Avg Load / Supervisor
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {avgLoad} <span className="text-sm text-blue-fantastic/40">lots</span>
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Average project load balance</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:rotate-6 transition-all duration-300">
            <BarChart3 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
