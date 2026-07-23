"use client";

import React from "react";
import { Eye, CheckCircle2, Truck, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimelineMilestone } from "@/lib/timeline/data";

interface MilestoneMarkerProps {
  milestone: TimelineMilestone;
  leftPercent: number;
  rowOffset?: number; // Vertical offset for overlapping markers
}

export default function MilestoneMarker({
  milestone,
  leftPercent,
  rowOffset = 0,
}: MilestoneMarkerProps) {
  // Determine icon & color based on type
  let icon = <HelpCircle className="h-3 w-3" />;
  let colorClass = "bg-blue-fantastic text-white";
  let ringClass = "ring-blue-fantastic/20";
  let borderClass = "border-blue-fantastic/30";

  switch (milestone.type) {
    case "inspection":
      icon = <Eye className="h-3 w-3" />;
      colorClass = "bg-blue-fantastic text-white";
      ringClass = "ring-blue-fantastic/20";
      borderClass = "border-blue-fantastic/40";
      break;
    case "approval":
      icon = <CheckCircle2 className="h-3 w-3" />;
      colorClass = "bg-emerald-600 text-white";
      ringClass = "ring-emerald-600/20";
      borderClass = "border-emerald-600/40";
      break;
    case "delivery":
      icon = <Truck className="h-3 w-3" />;
      colorClass = "bg-burning-flame text-blue-fantastic";
      ringClass = "ring-burning-flame/20";
      borderClass = "border-burning-flame/40";
      break;
    case "delay":
      icon = <AlertTriangle className="h-3 w-3" />;
      colorClass = "bg-truffle-trouble text-white";
      ringClass = "ring-truffle-trouble/20";
      borderClass = "border-truffle-trouble/40";
      break;
  }

  // Format date for readable display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Smart edge alignment for tooltips to prevent clipping or hiding under sidebar/edge
  const isNearLeftEdge = leftPercent < 15;
  const isNearRightEdge = leftPercent > 85;

  const tooltipAlignClass = isNearLeftEdge
    ? "left-0 translate-x-0"
    : isNearRightEdge
    ? "right-0 left-auto translate-x-0"
    : "left-1/2 -translate-x-1/2";

  const arrowAlignClass = isNearLeftEdge
    ? "left-3 translate-x-0"
    : isNearRightEdge
    ? "right-3 left-auto translate-x-0"
    : "left-1/2 -translate-x-1/2";

  return (
    <div
      className="absolute group z-30 group-hover:z-[100] -translate-x-1/2 transition-all duration-300 ease-out"
      style={{ 
        left: `${leftPercent}%`,
        top: `4px`
      }}
    >
      {/* Visual Marker Pin Node */}
      <button 
        type="button"
        className={cn(
          "flex items-center justify-center h-5.5 w-5.5 rounded-full shadow-sm border cursor-pointer transition-all duration-200 ring-2 focus:outline-none hover:scale-125 hover:z-[100]",
          colorClass,
          ringClass,
          borderClass,
          milestone.status === "completed" ? "opacity-100" : "opacity-75 border-dashed"
        )}
      >
        {icon}
      </button>

      {/* Hover Card / Tooltip - Pop over everything with z-[100] */}
      <div className={cn(
        "absolute top-7 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-top z-[100] min-w-[210px] bg-white border border-blue-fantastic/15 rounded-xl shadow-2xl p-3 text-left",
        tooltipAlignClass
      )}>
        {/* Tooltip Arrow */}
        <div className={cn(
          "absolute -top-1.5 w-3 h-3 bg-white rotate-45 border-l border-t border-blue-fantastic/15",
          arrowAlignClass
        )} />

        {/* Content */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              "text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-wider border",
              milestone.type === "inspection" && "bg-blue-fantastic/5 text-blue-fantastic border-blue-fantastic/10",
              milestone.type === "approval" && "bg-emerald-50 text-emerald-700 border-emerald-100",
              milestone.type === "delivery" && "bg-burning-flame/10 text-truffle-trouble border-burning-flame/20",
              milestone.type === "delay" && "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/20"
            )}>
              {milestone.type}
            </span>
            <span className="text-[10px] text-blue-fantastic/50 font-bold">
              {formatDate(milestone.date)}
            </span>
          </div>

          <h5 className="text-xs font-extrabold text-blue-fantastic leading-snug">
            {milestone.name}
          </h5>

          <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-blue-fantastic/5">
            <span className="text-blue-fantastic/50 font-medium">Status:</span>
            <span className={cn(
              "font-bold uppercase tracking-wider",
              milestone.status === "completed" && "text-emerald-600",
              milestone.status === "scheduled" && "text-blue-600",
              milestone.status === "pending" && "text-truffle-trouble"
            )}>
              {milestone.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

