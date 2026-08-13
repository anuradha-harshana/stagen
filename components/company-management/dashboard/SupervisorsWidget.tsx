"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SupervisorItem {
  name: string;
  initials: string;
  projectsCount: number;
  progressPercent: number;
}

const SUPERVISOR_DATA: SupervisorItem[] = [
  { name: "John Smith", initials: "JS", projectsCount: 15, progressPercent: 75 },
  { name: "David Brown", initials: "DB", projectsCount: 12, progressPercent: 60 },
  { name: "Michael Lee", initials: "ML", projectsCount: 10, progressPercent: 50 },
  { name: "Sarah Johnson", initials: "SJ", projectsCount: 8, progressPercent: 40 },
];

export function SupervisorsWidget() {
  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl overflow-hidden font-sans">
      <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
          Projects by Supervisor
        </CardTitle>
        <Link
          href="/company-management/supervisors"
          className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 space-y-4 h-56 flex flex-col justify-center">
        {SUPERVISOR_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-3.5 group">
            {/* Initials Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-fantastic/10 text-blue-fantastic font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-truffle-trouble group-hover:text-white transition-colors">
              {item.initials}
            </div>

            {/* Supervisor Info & Bar */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-fantastic">{item.name}</span>
                <span className="text-[11px] text-blue-fantastic/60 font-semibold">
                  {item.projectsCount} Projects
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-oatmeal/20 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${item.progressPercent}%` }}
                    className="bg-burning-flame h-full rounded-full transition-all duration-300 group-hover:bg-truffle-trouble"
                  />
                </div>
                <span className="text-xs font-bold text-blue-fantastic/80 w-8 text-right">
                  {item.progressPercent}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
