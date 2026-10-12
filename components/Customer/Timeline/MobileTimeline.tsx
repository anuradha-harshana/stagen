"use client";

import React, { useState } from "react";
import { TimelineStage } from "@/lib/timeline/data";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  Truck, 
  AlertTriangle, 
  HelpCircle,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MobileTimelineProps {
  stages: TimelineStage[];
}

export default function MobileTimeline({ stages }: MobileTimelineProps) {
  const [expandedStageId, setExpandedStageId] = useState<string | null>(
    stages.find((s) => s.status === "in-progress")?.id || stages[0]?.id || null
  );

  const toggleStage = (stageId: string) => {
    setExpandedStageId((prev) => (prev === stageId ? null : stageId));
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getDaysBetween = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const diff = e.getTime() - s.getTime();
    return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  };

  // Milestone icon selector
  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "inspection":
        return <Eye className="h-3.5 w-3.5 text-blue-fantastic" />;
      case "approval":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
      case "delivery":
        return <Truck className="h-3.5 w-3.5 text-burning-flame" />;
      case "delay":
        return <AlertTriangle className="h-3.5 w-3.5 text-truffle-trouble" />;
      default:
        return <HelpCircle className="h-3.5 w-3.5 text-blue-fantastic/40" />;
    }
  };

  return (
    <div className="space-y-4 md:hidden">
      <div className="flex items-center justify-between border-b border-blue-fantastic/5 pb-2">
        <h3 className="text-sm font-extrabold text-blue-fantastic uppercase tracking-wider">
          Stage Breakdown
        </h3>
        <span className="text-[10px] font-bold text-blue-fantastic/45">
          Tap stages to view key milestones
        </span>
      </div>

      <div className="space-y-3.5">
        {stages.map((stage, index) => {
          const isExpanded = expandedStageId === stage.id;
          const plannedDays = getDaysBetween(stage.plannedStart, stage.plannedEnd);
          
          const actualStartStr = stage.actualStart || stage.plannedStart;
          const actualEndStr = stage.actualEnd || stage.plannedEnd;
          const actualDays = getDaysBetween(actualStartStr, actualEndStr);

          const isProjected = stage.status === "in-progress" || stage.status === "upcoming" || stage.status === "delayed";
          const delayVariance = actualDays - plannedDays;

          // Badges classes
          let badgeColor = "bg-white text-blue-fantastic border-blue-fantastic/10";
          let badgeText = "Upcoming";

          if (stage.status === "completed-on-time") {
            badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
            badgeText = "Completed On-Time";
          } else if (stage.status === "completed-late") {
            badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
            badgeText = "Completed Late";
          } else if (stage.status === "in-progress") {
            badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
            badgeText = "In Progress";
          } else if (stage.status === "delayed") {
            badgeColor = "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/20";
            badgeText = "Delayed Shift";
          }

          return (
            <Card 
              key={stage.id} 
              className={cn(
                "border overflow-hidden transition-all duration-300 rounded-2xl shadow-sm bg-white",
                isExpanded ? "border-blue-600/30 ring-1 ring-blue-600/10" : "border-blue-fantastic/5 hover:border-blue-fantastic/10"
              )}
            >
              {/* Header Tab */}
              <div
                onClick={() => toggleStage(stage.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none active:bg-surface-inset"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border font-bebas-neue text-sm font-bold",
                    stage.status === "completed-on-time" && "bg-emerald-50 border-emerald-200 text-emerald-700",
                    stage.status === "completed-late" && "bg-amber-50 border-amber-200 text-amber-600",
                    stage.status === "in-progress" && "bg-blue-50 border-blue-200 text-blue-700",
                    stage.status === "delayed" && "bg-truffle-trouble/10 border-truffle-trouble/20 text-truffle-trouble",
                    stage.status === "upcoming" && "bg-surface-inset border-blue-fantastic/5 text-blue-fantastic/40"
                  )}>
                    0{index + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-blue-fantastic truncate">
                      {stage.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={cn("text-[9px] font-extrabold px-1.5 py-0.2 rounded border tracking-wider", badgeColor)}>
                        {badgeText}
                      </span>
                      {stage.status !== "upcoming" && delayVariance > 0 && (
                        <span className="text-[9px] font-bold text-truffle-trouble">
                          (+{delayVariance}d shift)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-blue-fantastic/40">
                  {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                </div>
              </div>

              {/* Collapsible Details Content */}
              {isExpanded && (
                <div className="px-4 pb-4.5 pt-1.5 border-t border-blue-fantastic/5 space-y-4 bg-oatmeal/5 animate-fade-in">
                  {/* Description */}
                  <p className="text-xs text-blue-fantastic/75 leading-relaxed font-medium">
                    {stage.description}
                  </p>

                  {/* Dates Comparison Grid */}
                  <div className="grid grid-cols-2 gap-3.5 bg-white border border-blue-fantastic/5 p-3 rounded-xl shadow-[0_2px_8px_rgba(27,38,50,0.01)]">
                    {/* Planned Schedule Column */}
                    <div className="space-y-1 border-r border-blue-fantastic/5 pr-2">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-blue-fantastic/45 block">
                        Planned Target
                      </span>
                      <div className="text-xs font-bold text-blue-fantastic">
                        {formatDate(stage.plannedStart)} – {formatDate(stage.plannedEnd)}
                      </div>
                      <div className="text-[10px] font-semibold text-blue-fantastic/50 flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>Duration: {plannedDays} days</span>
                      </div>
                    </div>

                    {/* Actual / Projected Column */}
                    <div className="space-y-1 pl-1">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-blue-fantastic/45 block">
                        {isProjected ? "Projected Outlook" : "Actual Schedule"}
                      </span>
                      <div className={cn(
                        "text-xs font-bold",
                        delayVariance > 0 ? "text-truffle-trouble" : stage.status === "completed-on-time" ? "text-emerald-700" : "text-blue-fantastic"
                      )}>
                        {formatDate(actualStartStr)} – {formatDate(actualEndStr)}
                      </div>
                      <div className="text-[10px] font-semibold text-blue-fantastic/50 flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>
                          {isProjected ? "Proj" : "Act"} Duration: {actualDays} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage Milestones Checklist */}
                  {stage.milestones.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-fantastic/45 block">
                        Milestones & Events
                      </span>
                      <div className="bg-white border border-blue-fantastic/5 rounded-xl divide-y divide-blue-fantastic/5 overflow-hidden">
                        {stage.milestones.map((m, mIdx) => (
                          <div key={mIdx} className="p-3 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="h-7 w-7 rounded-full bg-surface-inset flex items-center justify-center shrink-0">
                                {getMilestoneIcon(m.type)}
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-bold text-blue-fantastic truncate">
                                  {m.name}
                                </h5>
                                <p className="text-[10px] text-blue-fantastic/40 font-medium">
                                  {m.type.charAt(0).toUpperCase() + m.type.slice(1)} • {formatDate(m.date)}
                                </p>
                              </div>
                            </div>
                            <span className={cn(
                              "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0",
                              m.status === "completed" && "bg-emerald-50 text-emerald-700 border border-emerald-100",
                              m.status === "scheduled" && "bg-blue-50 text-blue-600 border border-blue-100",
                              m.status === "pending" && "bg-truffle-trouble/5 text-truffle-trouble border border-truffle-trouble/10"
                            )}>
                              {m.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
