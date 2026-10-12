"use client";

import React from "react";
import { CheckCircle2, Clock, CalendarDays, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressStage, Milestone } from "@/lib/progress/data";
import { cn } from "@/lib/utils";

interface MilestoneHighlightsProps {
  stages: ProgressStage[];
}

interface FlattenedMilestone extends Milestone {
  stageName: string;
}

export default function MilestoneHighlights({ stages }: MilestoneHighlightsProps) {
  // Extract and flatten milestones
  const allMilestones: FlattenedMilestone[] = stages.flatMap((stage) =>
    stage.milestones.map((m) => ({
      ...m,
      stageName: stage.name,
    }))
  );

  const completed = allMilestones.filter((m) => m.status === "completed");
  const scheduled = allMilestones.filter((m) => m.status === "scheduled");
  const upcoming = allMilestones.filter((m) => m.status === "upcoming");

  return (
    <Card className="bg-white border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden w-full flex flex-col">
      <CardHeader className="border-b border-blue-fantastic/[0.03] pb-4 pt-5 px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-truffle-trouble/10 flex items-center justify-center text-truffle-trouble">
            <Award className="h-4.5 w-4.5" />
          </div>
          <CardTitle className="text-blue-fantastic text-base font-extrabold font-sans">
            Milestone Highlights
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1">
        {allMilestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
            <CalendarDays className="h-10 w-10 text-blue-fantastic/15" />
            <p className="text-sm font-bold text-blue-fantastic/50">No milestones scheduled</p>
            <p className="text-xs text-blue-fantastic/30">Build timeline hasn't commenced yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-blue-fantastic/5">
              <div className="bg-surface-inset rounded-xl p-2.5 text-center">
                <span className="text-lg font-bold text-emerald-600 font-bebas-neue block">
                  {completed.length}
                </span>
                <span className="text-[9px] font-bold text-blue-fantastic/45 uppercase tracking-wide">
                  Approved
                </span>
              </div>
              <div className="bg-surface-inset rounded-xl p-2.5 text-center">
                <span className="text-lg font-bold text-burning-flame font-bebas-neue block">
                  {scheduled.length}
                </span>
                <span className="text-[9px] font-bold text-blue-fantastic/45 uppercase tracking-wide">
                  Upcoming
                </span>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
              {/* Scheduled / Pending first, then completed */}
              {[...scheduled, ...completed, ...upcoming.slice(0, 3)].map((milestone, idx) => {
                const isCompleted = milestone.status === "completed";
                const isScheduled = milestone.status === "scheduled";
                const isUpcoming = milestone.status === "upcoming";

                return (
                  <div
                    key={`${milestone.name}-${idx}`}
                    className={cn(
                      "flex items-start justify-between p-3 rounded-xl border transition-all duration-300",
                      isCompleted && "bg-emerald-50/20 border-emerald-500/10 hover:border-emerald-500/20",
                      isScheduled && "bg-burning-flame/5 border-burning-flame/10 hover:border-burning-flame/20",
                      isUpcoming && "bg-white border-blue-fantastic/[0.03] opacity-60"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                        ) : isScheduled ? (
                          <Clock className="h-4.5 w-4.5 text-burning-flame shrink-0 animate-pulse" />
                        ) : (
                          <div className="h-4.5 w-4.5 rounded-full border-2 border-blue-fantastic/20 shrink-0 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-fantastic/15" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-blue-fantastic leading-tight">
                          {milestone.name}
                        </h4>
                        <span className="text-[9px] font-bold text-truffle-trouble/70 tracking-wide uppercase mt-0.5 block">
                          {milestone.stageName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {milestone.date ? (
                        <span className="text-[10px] text-blue-fantastic/55 font-bold font-sans">
                          {milestone.date}
                        </span>
                      ) : (
                        <span className="text-[9px] text-blue-fantastic/30 font-bold uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                      <span
                        className={cn(
                          "block text-[8px] font-extrabold uppercase tracking-widest mt-0.5",
                          isCompleted && "text-emerald-600",
                          isScheduled && "text-burning-flame",
                          isUpcoming && "text-blue-fantastic/30"
                        )}
                      >
                        {milestone.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
