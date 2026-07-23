"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BarDetails {
  start: string;
  end: string;
  days: number;
  label: string;
}

interface TimelineBarProps {
  stageName: string;
  status: "completed-on-time" | "completed-late" | "in-progress" | "upcoming" | "delayed";
  plannedLeft: number;
  plannedWidth: number;
  actualLeft: number;
  actualWidth: number;
  plannedDetails: BarDetails;
  actualDetails: BarDetails;
  isProjected: boolean;
}

export default function TimelineBar({
  stageName,
  status,
  plannedLeft,
  plannedWidth,
  actualLeft,
  actualWidth,
  plannedDetails,
  actualDetails,
  isProjected,
}: TimelineBarProps) {
  // Styling mappings for actual/projected bar
  let barColor = "bg-palladian border-blue-fantastic/10 text-blue-fantastic/50";
  let barLabel = "Upcoming";
  let statusBadgeColor = "bg-blue-fantastic/10 text-blue-fantastic";

  switch (status) {
    case "completed-on-time":
      barColor = "bg-emerald-600 border-emerald-700 text-white shadow-sm shadow-emerald-600/10";
      barLabel = "Completed (On Time)";
      statusBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "completed-late":
      barColor = "bg-amber-600 border-amber-700 text-white shadow-sm shadow-amber-600/10";
      barLabel = "Completed (Late)";
      statusBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "in-progress":
      barColor = "bg-blue-fantastic text-white border-blue-fantastic/80 shadow-md shadow-blue-fantastic/15";
      barLabel = "In Progress";
      statusBadgeColor = "bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/20";
      break;
    case "delayed":
      barColor = "bg-truffle-trouble text-white border-truffle-trouble/80 shadow-sm shadow-truffle-trouble/15";
      barLabel = "Projected Delay";
      statusBadgeColor = "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/20";
      break;
    case "upcoming":
      barColor = "bg-palladian/80 border-blue-fantastic/10 text-blue-fantastic/50";
      barLabel = "Upcoming";
      statusBadgeColor = "bg-palladian text-blue-fantastic/60 border-blue-fantastic/10";
      break;
  }

  // Format date helper for tooltip
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Smart edge alignment for tooltips to prevent clipping under left sidebar
  const plannedIsNearLeft = plannedLeft < 15;
  const plannedIsNearRight = plannedLeft + plannedWidth > 85;

  const plannedTooltipAlignClass = plannedIsNearLeft
    ? "left-0 translate-x-0"
    : plannedIsNearRight
    ? "right-0 left-auto translate-x-0"
    : "left-1/2 -translate-x-1/2";

  const plannedArrowAlignClass = plannedIsNearLeft
    ? "left-4 translate-x-0"
    : plannedIsNearRight
    ? "right-4 left-auto translate-x-0"
    : "left-1/2 -translate-x-1/2";

  const actualIsNearLeft = actualLeft < 15;
  const actualIsNearRight = actualLeft + actualWidth > 85;

  const actualTooltipAlignClass = actualIsNearLeft
    ? "left-0 translate-x-0"
    : actualIsNearRight
    ? "right-0 left-auto translate-x-0"
    : "left-1/2 -translate-x-1/2";

  const actualArrowAlignClass = actualIsNearLeft
    ? "left-4 translate-x-0"
    : actualIsNearRight
    ? "right-4 left-auto translate-x-0"
    : "left-1/2 -translate-x-1/2";

  return (
    <div className="relative w-full h-full flex flex-col justify-end pb-2 gap-1">
      {/* 1. Planned Duration Baseline Bar (Top Track) */}
      <div className="relative w-full h-[14px]">
        {plannedWidth > 0 && (
          <div
            className="absolute h-full rounded-md border border-dashed border-blue-fantastic/30 bg-blue-fantastic/[0.04] flex items-center px-2 group hover:z-[100] transition-all duration-200 hover:bg-blue-fantastic/[0.08] hover:border-blue-fantastic/50 cursor-pointer"
            style={{ left: `${plannedLeft}%`, width: `${plannedWidth}%` }}
          >
            {/* Display label ONLY if width is large enough (> 16%) to prevent text truncation */}
            {plannedWidth > 16 && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-fantastic/50 select-none truncate">
                Planned: {plannedDetails.days}d
              </span>
            )}

            {/* Tooltip for Planned Bar - z-[100] to pop over sidebar */}
            <div className={cn(
              "absolute bottom-5 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-bottom z-[100] min-w-[210px] bg-white border border-blue-fantastic/15 rounded-xl shadow-2xl p-3 text-left",
              plannedTooltipAlignClass
            )}>
              <div className={cn(
                "absolute -bottom-1 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-blue-fantastic/15",
                plannedArrowAlignClass
              )} />
              <div className="space-y-1 relative z-10">
                <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-blue-fantastic/5 text-blue-fantastic border border-blue-fantastic/10 tracking-wider">
                  Baseline Schedule
                </span>
                <h5 className="text-xs font-extrabold text-blue-fantastic pt-0.5">{stageName}</h5>
                <div className="text-[10px] text-blue-fantastic/75 space-y-0.5 pt-1">
                  <p><span className="font-semibold text-blue-fantastic/50">Start:</span> {formatDate(plannedDetails.start)}</p>
                  <p><span className="font-semibold text-blue-fantastic/50">Finish:</span> {formatDate(plannedDetails.end)}</p>
                  <p className="pt-1 text-blue-fantastic font-bold"><span className="text-blue-fantastic/50 font-normal">Duration:</span> {plannedDetails.days} days</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Actual / Projected Duration Bar (Bottom Track) */}
      <div className="relative w-full h-[22px]">
        {actualWidth > 0 && (
          <div
            className={cn(
              "absolute h-full rounded-md border flex items-center justify-between px-2.5 group hover:z-[100] transition-all duration-200 hover:brightness-105 cursor-pointer shadow-sm",
              barColor
            )}
            style={{ left: `${actualLeft}%`, width: `${actualWidth}%` }}
          >
            {/* Display duration text inside ONLY if bar width > 14% */}
            {actualWidth > 14 ? (
              <span className="text-[10px] font-extrabold uppercase tracking-wider select-none truncate">
                {actualDetails.days} days
              </span>
            ) : actualWidth > 7 ? (
              <span className="text-[9px] font-extrabold select-none truncate">
                {actualDetails.days}d
              </span>
            ) : null}

            {/* Status indicator tag inside bar if very wide */}
            {actualWidth > 24 && (
              <span className="text-[8px] font-extrabold uppercase tracking-wider bg-black/15 px-1.5 py-0.5 rounded text-white select-none truncate">
                {status === "in-progress" ? "In Progress" : isProjected ? "Projected" : "Actual"}
              </span>
            )}

            {/* Tooltip for Actual / Projected Bar - z-[100] */}
            <div className={cn(
              "absolute bottom-7 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-bottom z-[100] min-w-[230px] bg-white border border-blue-fantastic/15 rounded-xl shadow-2xl p-3 text-left",
              actualTooltipAlignClass
            )}>
              <div className={cn(
                "absolute -bottom-1 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-blue-fantastic/15",
                actualArrowAlignClass
              )} />
              <div className="space-y-1.5 relative z-10 text-blue-fantastic">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-wider border", statusBadgeColor)}>
                    {barLabel}
                  </span>
                  {isProjected && status !== "completed-on-time" && status !== "completed-late" && (
                    <span className="text-[8px] font-extrabold text-truffle-trouble uppercase tracking-wider">Projected</span>
                  )}
                </div>
                <h5 className="text-xs font-extrabold pt-0.5">{stageName}</h5>
                <div className="text-[10px] text-blue-fantastic/75 space-y-0.5">
                  <p><span className="font-semibold text-blue-fantastic/50">Start:</span> {formatDate(actualDetails.start)}</p>
                  <p><span className="font-semibold text-blue-fantastic/50">{isProjected ? "Est. Finish:" : "Actual Finish:"}</span> {formatDate(actualDetails.end)}</p>
                  <p className="pt-1 font-bold text-blue-fantastic">
                    <span className="text-blue-fantastic/50 font-normal">Total Duration:</span> {actualDetails.days} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

