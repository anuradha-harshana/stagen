"use client";

import React from "react";
import { Calendar, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "../Dashboard/PageHeader";
import { cn } from "@/lib/utils";
import { TimelineStage } from "@/lib/timeline/data";

interface TimelineHeaderProps {
  percentage: number;
  startDate: string;
  originalEstCompletion: string;
  currentProjectedCompletion: string;
  statusFlag: "on-track" | "delayed" | "ahead" | "not-started";
  delayDays: number;
  stages: TimelineStage[];
}

export default function TimelineHeader({
  percentage,
  startDate,
  originalEstCompletion,
  currentProjectedCompletion,
  statusFlag,
  delayDays,
  stages,
}: TimelineHeaderProps) {
  // SVG Gauge calculations
  const radius = 48;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Status styling configuration for bottom cards
  let statusBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let statusText = "On Track";
  let statusDesc = "Your build is currently meeting all milestone targets.";
  let statusIcon = <CheckCircle className="h-5 w-5 text-emerald-600" />;

  if (statusFlag === "delayed") {
    statusBadgeColor = "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/20";
    statusText = `Delayed by ${delayDays} days`;
    statusDesc = "Weather and machinery shifts pushed back the estimated handover.";
    statusIcon = <AlertTriangle className="h-5 w-5 text-truffle-trouble" />;
  } else if (statusFlag === "ahead") {
    statusBadgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
    statusText = `Ahead by ${Math.abs(delayDays)} days`;
    statusDesc = "Build is ahead of schedule due to fast-tracked finishing crews.";
    statusIcon = <TrendingUp className="h-5 w-5 text-emerald-700" />;
  } else if (statusFlag === "not-started") {
    statusBadgeColor = "bg-palladian text-blue-fantastic border-blue-fantastic/10";
    statusText = "Not Started";
    statusDesc = "Pre-construction planning is underway. Awaiting site mobilization.";
    statusIcon = <Clock className="h-5 w-5 text-blue-fantastic/60" />;
  }

  // Calculate dynamic counts for key metrics in the top header badges
  const upcomingCount = stages.filter(s => s.status === "upcoming" || s.status === "delayed" || s.status === "in-progress").length;
  const delayedCount = stages.filter(s => s.status === "delayed").length;

  // Build the flexible right side count badges combo
  const countBadges = (
    <div className="flex gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 rounded-full border border-blue-fantastic/15 bg-blue-fantastic/5 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-truffle-trouble" />
        <span className="text-xs text-blue-fantastic font-semibold">
          {upcomingCount} Active/Upcoming Phases
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-blue-fantastic/15 bg-blue-fantastic/5 px-3 py-1.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", delayedCount > 0 ? "bg-truffle-trouble" : "bg-emerald-500")} />
        <span className="text-xs text-blue-fantastic font-semibold">
          {delayedCount > 0 ? `${delayedCount} Delayed` : "0 Delayed"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Reusable PageHeader Component */}
      <PageHeader
        icon={<Calendar className="h-5 w-5 text-burning-flame" />}
        title="Timeline"
        subtitle="Chronological schedule view of planned vs. actual dates"
        rightContent={countBadges}
      />

      {/* Stats Cards Row (Body Content below Header - kept exactly identical) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Gauge & Status Details */}
        <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-truffle-trouble/5 blur-md" />
              <svg className="w-full h-full transform -rotate-90 relative z-10">
                <defs>
                  <linearGradient id="timeline-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--burning-flame)" />
                    <stop offset="100%" stopColor="var(--truffle-trouble)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-palladian/60"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#timeline-progress-gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 - (percentage / 100) * (2 * Math.PI * 40)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-blue-fantastic font-bebas-neue leading-none">
                  {percentage}%
                </span>
                <span className="text-[8px] font-bold text-blue-fantastic/45 uppercase tracking-wide mt-0.5">
                  Phase
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-fantastic/50 block">
                Schedule Status
              </span>
              <div className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border", statusBadgeColor)}>
                {statusText}
              </div>
              <p className="text-[11px] leading-tight text-blue-fantastic/70 font-medium">
                {statusDesc}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Planned Targets */}
        <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-fantastic/50 block">
                  Original Baseline
                </span>
                <h2 className="text-xl font-extrabold text-blue-fantastic font-sans tracking-tight">
                  {originalEstCompletion}
                </h2>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-fantastic/10 flex items-center justify-center text-blue-fantastic">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-blue-fantastic/5 pt-3.5 mt-4">
              <span className="text-blue-fantastic/45 font-medium">Start Date:</span>
              <span className="text-blue-fantastic/80 font-bold font-sans">{startDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Projected Completion */}
        <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-fantastic/50 block">
                  Projected Finish
                </span>
                <h2 className={cn(
                  "text-xl font-extrabold font-sans tracking-tight",
                  statusFlag === "delayed" ? "text-truffle-trouble" : statusFlag === "ahead" ? "text-emerald-700" : "text-blue-fantastic"
                )}>
                  {currentProjectedCompletion}
                </h2>
              </div>
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center border",
                statusFlag === "delayed" 
                  ? "bg-truffle-trouble/10 border-truffle-trouble/20 text-truffle-trouble" 
                  : statusFlag === "ahead" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-blue-fantastic/10 border-blue-fantastic/5 text-blue-fantastic"
              )}>
                {statusIcon}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-blue-fantastic/5 pt-3.5 mt-4">
              <span className="text-blue-fantastic/45 font-medium">Variance:</span>
              <span className={cn(
                "font-bold font-sans",
                statusFlag === "delayed" ? "text-truffle-trouble" : statusFlag === "ahead" ? "text-emerald-700" : "text-blue-fantastic/60"
              )}>
                {statusFlag === "delayed" 
                  ? `+${delayDays} days delay` 
                  : statusFlag === "ahead" 
                  ? `${delayDays} days early` 
                  : "0 days shift"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
