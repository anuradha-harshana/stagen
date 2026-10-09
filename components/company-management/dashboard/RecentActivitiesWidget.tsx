"use client";

import React from "react";
import { Activity, CheckCircle2, AlertTriangle, Info, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivityItem } from "@/lib/company-management/dashboardData";

interface RecentActivitiesWidgetProps {
  activities: RecentActivityItem[];
}

export function RecentActivitiesWidget({ activities }: RecentActivitiesWidgetProps) {
  return (
    <Card className="bg-white border border-blue-fantastic/10 hover:border-blue-fantastic/20 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden font-sans transition-all duration-300">
      <CardHeader className="pb-3 pt-5 px-6 flex flex-row items-center justify-between border-b border-blue-fantastic/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-fantastic/10 flex items-center justify-center text-blue-fantastic">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
              Recent Site Activities & Logs
            </CardTitle>
            <p className="text-xs text-blue-fantastic/50 font-medium">
              Live updates logged by site supervisors across projects
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-blue-fantastic/50">
          {activities.length} updates
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-xs text-blue-fantastic/50 font-medium">
            No recent activity logged.
          </div>
        ) : (
          <div className="divide-y divide-blue-fantastic/5 max-h-[340px] overflow-y-auto">
            {activities.map((item) => (
              <div
                key={item.id}
                className="p-4 px-6 flex items-start gap-3 hover:bg-surface-inset/60 transition-colors group"
              >
                {/* Icon indicator */}
                <div className="mt-0.5 shrink-0">
                  {item.type === "warning" ? (
                    <div className="w-7 h-7 rounded-lg bg-burning-flame/15 text-truffle-trouble flex items-center justify-center">
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </div>
                  ) : item.type === "info" ? (
                    <div className="w-7 h-7 rounded-lg bg-blue-fantastic/10 text-blue-fantastic flex items-center justify-center">
                      <Info className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-blue-fantastic group-hover:text-truffle-trouble transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-medium text-blue-fantastic/50 flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>

                  <p className="text-xs text-blue-fantastic/70 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-fantastic/5 text-[10px] font-extrabold text-blue-fantastic">
                      {item.projectId}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-fantastic/60">
                      Stage: {item.stageName}
                    </span>
                    {item.clientName && (
                      <span className="text-[11px] text-blue-fantastic/50">
                        • {item.clientName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
