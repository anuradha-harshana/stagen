"use client";

import React from "react";
import Link from "next/link";
import { UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupervisorWorkloadItem } from "@/lib/company-management/dashboardData";

interface SupervisorsWidgetProps {
  data: SupervisorWorkloadItem[];
}

export function SupervisorsWidget({ data }: SupervisorsWidgetProps) {
  return (
    <Card className="bg-white border border-blue-fantastic/10 hover:border-blue-fantastic/20 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden font-sans transition-all duration-300">
      <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-burning-flame" />
          <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
            Projects by Supervisor
          </CardTitle>
        </div>
        <Link
          href="/company-management/supervisors"
          className="text-xs font-bold text-truffle-trouble hover:underline transition-colors"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2 space-y-4 min-h-[14rem] flex flex-col justify-center">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-blue-fantastic/50">
            <p className="text-xs font-medium">No supervisors assigned yet.</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="flex items-center gap-3.5 group">
              {/* Initials Avatar */}
              <div className="w-9 h-9 rounded-xl bg-blue-fantastic/10 text-blue-fantastic font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-truffle-trouble group-hover:text-palladian transition-colors duration-300">
                {item.initials}
              </div>

              {/* Supervisor Info & Bar */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-fantastic group-hover:text-truffle-trouble transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-blue-fantastic/60 font-semibold">
                    {item.projectsCount} {item.projectsCount === 1 ? "Project" : "Projects"}
                    {item.delayedCount > 0 && (
                      <span className="text-truffle-trouble ml-1 font-bold">
                        ({item.delayedCount} delayed)
                      </span>
                    )}
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
          ))
        )}
      </CardContent>
    </Card>
  );
}
