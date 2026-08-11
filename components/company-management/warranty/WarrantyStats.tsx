"use client";

import React from "react";
import { AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface DefectItem {
  id: string;
  projectId: string;
  clientName: string;
  title: string;
  area: string;
  priority: "Low" | "Medium" | "High";
  reported: string;
  status: "open" | "in-progress" | "resolved";
  assignedSupervisor: string;
  description: string;
}

interface WarrantyStatsProps {
  defects: DefectItem[];
}

export default function WarrantyStats({ defects }: WarrantyStatsProps) {
  const activeCount = defects.filter((d) => d.status !== "resolved").length;
  const resolvedCount = defects.filter((d) => d.status === "resolved").length;

  const slaAlertCount = defects.filter((d) => {
    if (d.status === "resolved") return false;
    const reportDate = new Date(d.reported);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - reportDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 14;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-cream">
      {/* Active Defects Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Active Defects
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-cream tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {activeCount}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Awaiting final resolution</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-fantastic/10 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
            <Clock className="h-6 w-6 text-blue-fantastic" />
          </div>
        </CardContent>
      </Card>

      {/* SLA Alerts Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              SLA Overdue (&gt;14 days)
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-cream tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {slaAlertCount}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Require immediate priority</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-burning-flame/15 text-truffle-trouble group-hover:rotate-6 transition-all duration-300">
            <AlertTriangle className="h-6 w-6 text-truffle-trouble" />
          </div>
        </CardContent>
      </Card>

      {/* Resolved Defects Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Total Resolved
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-cream tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {resolvedCount}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Successfully completed tickets</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:rotate-6 transition-all duration-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
