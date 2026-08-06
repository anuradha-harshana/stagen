"use client";

import React from "react";
import { FolderKanban, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/lib/db-mock/projectsData";

interface ProjectsStatsProps {
  projects: Project[];
}

export default function ProjectsStats({ projects }: ProjectsStatsProps) {
  const total = projects.length;
  const onTrack = projects.filter((p) => p.status === "On Track").length;
  const delayed = projects.filter((p) => p.status === "Delayed" || p.status === "Action Required").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Total Projects Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Total Projects
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-cream tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {total}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Active construction lots</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-fantastic/10 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
            <FolderKanban className="h-6 w-6 text-blue-fantastic" />
          </div>
        </CardContent>
      </Card>

      {/* On Track Projects Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              On Track
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-cream tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {onTrack}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Running according to schedule</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:rotate-6 transition-all duration-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Delayed & Actions Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Delayed / Attention
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-cream tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {delayed}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Requires supervisor check</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-burning-flame/15 text-truffle-trouble group-hover:rotate-6 transition-all duration-300">
            <AlertTriangle className="h-6 w-6 text-truffle-trouble" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
