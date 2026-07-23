"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TimelineStage, TimelinePageData } from "@/lib/timeline/data";
import TimelineBar from "./TimelineBar";
import MilestoneMarker from "./MilestoneMarker";
import { ZoomScale } from "./ZoomToggle";
import { HelpCircle, Eye, CheckCircle2, Truck, AlertTriangle, CalendarDays } from "lucide-react";

interface GanttChartProps {
  data: TimelinePageData;
  zoomScale: ZoomScale;
  simulatedToday: string;
}

export default function GanttChart({
  data,
  zoomScale,
  simulatedToday,
}: GanttChartProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Parse date helpers
  const parseDate = (dStr: string) => new Date(dStr);
  
  // Find project start and end range boundaries (with padding)
  const getTimelineBoundaries = () => {
    let minTime = parseDate(data.startDate).getTime();
    
    // We target completion date for padding
    let maxCompletion = data.currentProjectedCompletion;
    if (new Date(data.originalEstCompletion) > new Date(maxCompletion)) {
      maxCompletion = data.originalEstCompletion;
    }
    let maxTime = parseDate(maxCompletion).getTime();

    // Find if there are any milestones or stages out of bounds
    data.stages.forEach((stage) => {
      const dates = [
        stage.plannedStart,
        stage.plannedEnd,
        stage.actualStart,
        stage.actualEnd,
      ].filter(Boolean) as string[];

      dates.forEach((d) => {
        const time = parseDate(d).getTime();
        if (time < minTime) minTime = time;
        if (time > maxTime) maxTime = time;
      });

      stage.milestones.forEach((m) => {
        const time = parseDate(m.date).getTime();
        if (time < minTime) minTime = time;
        if (time > maxTime) maxTime = time;
      });
    });

    // Pad by 5 days on start, 7 days on end for clean margins
    const paddedStart = new Date(minTime - 5 * 24 * 60 * 60 * 1000);
    const paddedEnd = new Date(maxTime + 7 * 24 * 60 * 60 * 1000);

    return {
      start: paddedStart,
      end: paddedEnd,
      totalDays: Math.ceil((paddedEnd.getTime() - paddedStart.getTime()) / (24 * 60 * 60 * 1000)),
    };
  };

  const { start: minDate, end: maxDate, totalDays } = getTimelineBoundaries();

  // Percentage position calculator
  const getPercent = (dateStr: string) => {
    const time = parseDate(dateStr).getTime();
    const minTime = minDate.getTime();
    const maxTime = maxDate.getTime();
    const pct = ((time - minTime) / (maxTime - minTime)) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  // Duration in days calculator
  const getDaysBetween = (startStr: string, endStr: string) => {
    const s = parseDate(startStr);
    const e = parseDate(endStr);
    const diff = e.getTime() - s.getTime();
    return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  };

  // Generate grid column dates based on scale
  const generateGridColumns = () => {
    const columns: { label: string; date: Date; leftPercent: number }[] = [];
    const minTime = minDate.getTime();
    const maxTime = maxDate.getTime();

    if (zoomScale === "week") {
      // Columns every Monday
      let current = new Date(minDate);
      // Move to next Monday
      current.setDate(current.getDate() + ((1 + 7 - current.getDay()) % 7));
      
      while (current.getTime() <= maxTime) {
        columns.push({
          label: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          date: new Date(current),
          leftPercent: getPercent(current.toISOString().split("T")[0]),
        });
        current.setDate(current.getDate() + 7);
      }
    } else {
      // Month scale or Project scale (Columns at start of each month)
      let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      if (current.getTime() < minTime) {
        current.setMonth(current.getMonth() + 1);
      }

      while (current.getTime() <= maxTime) {
        columns.push({
          label: current.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          date: new Date(current),
          leftPercent: getPercent(current.toISOString().split("T")[0]),
        });
        current.setMonth(current.getMonth() + 1);
      }
    }
    return columns;
  };

  const gridColumns = generateGridColumns();

  // Scroll to "Today" line on initial render or demoState change
  useEffect(() => {
    if (scrollContainerRef.current && data.statusFlag !== "not-started") {
      const container = scrollContainerRef.current;
      const todayPct = getPercent(simulatedToday);
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      // Calculate target scroll position (center the today line)
      const targetScroll = (todayPct / 100) * scrollWidth - clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }
  }, [zoomScale, simulatedToday, data.statusFlag]);

  // Width formatting based on zoom scale
  const getGanttWidthClass = () => {
    switch (zoomScale) {
      case "week":
        return "w-[250%] min-w-[1800px]";
      case "month":
        return "w-[150%] min-w-[1100px]";
      case "project":
      default:
        return "w-full";
    }
  };

  return (
    <div className="w-full bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl p-6 space-y-6">
      {/* 1. Timeline Legends */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-fantastic/5 pb-4">
        {/* Status Legends */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-fantastic/70">
          <div className="flex items-center gap-2">
            <div className="h-3 w-5 bg-emerald-600 rounded" />
            <span>On-Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-5 bg-amber-600 rounded" />
            <span>Completed Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-5 bg-blue-fantastic rounded" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-5 bg-truffle-trouble rounded" />
            <span>Projected Delay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-5 border border-dashed border-blue-fantastic/30 bg-blue-fantastic/[0.03] rounded" />
            <span>Planned baseline</span>
          </div>
        </div>

        {/* Milestone Legends */}
        <div className="flex items-center gap-3 text-xs font-semibold text-blue-fantastic/60">
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-blue-fantastic text-white rounded-full flex items-center justify-center scale-90"><Eye className="h-3 w-3" /></div>
            <span>Inspection</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-emerald-600 text-white rounded-full flex items-center justify-center scale-90"><CheckCircle2 className="h-3 w-3" /></div>
            <span>Approval</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-burning-flame text-blue-fantastic rounded-full flex items-center justify-center scale-90"><Truck className="h-3 w-3" /></div>
            <span>Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-truffle-trouble text-white rounded-full flex items-center justify-center scale-90"><AlertTriangle className="h-3 w-3" /></div>
            <span>Delay Cause</span>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Gantt Chart Container */}
      <div className="border border-blue-fantastic/5 rounded-2xl overflow-hidden shadow-inner bg-oatmeal/10 relative">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto custom-scrollbar flex"
        >
          {/* A. Fixed Stage Sidebar */}
          <div className="w-56 md:w-64 shrink-0 bg-palladian sticky left-0 z-20 border-r border-blue-fantastic/10 shadow-[4px_0_12px_-5px_rgba(27,38,50,0.06)]">
            {/* Header placeholder */}
            <div className="h-10 bg-palladian/45 border-b border-blue-fantastic/10 flex items-center px-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-fantastic/65">
                Construction Stages
              </span>
            </div>

            {/* Stages List */}
            <div className="divide-y divide-blue-fantastic/5">
              {data.stages.map((stage) => {
                const isActive = stage.status === "in-progress";
                return (
                  <div 
                    key={stage.id} 
                    className={cn(
                      "h-20 flex flex-col justify-center px-4 transition-colors",
                      isActive ? "bg-blue-fantastic/5" : "bg-palladian"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        stage.status === "completed-on-time" && "bg-emerald-500",
                        stage.status === "completed-late" && "bg-amber-500",
                        isActive && "bg-blue-fantastic animate-pulse",
                        stage.status === "delayed" && "bg-truffle-trouble",
                        stage.status === "upcoming" && "bg-blue-fantastic/20"
                      )} />
                      <h4 className="text-xs font-extrabold text-blue-fantastic truncate">
                        {stage.name}
                      </h4>
                    </div>
                    <p className="text-[10px] text-blue-fantastic/55 line-clamp-1 mt-0.5 pl-3.5">
                      {stage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Dynamic Gantt Grid */}
          <div className={cn("relative bg-palladian", getGanttWidthClass())}>
            {/* Grid Header Columns */}
            <div className="h-10 bg-palladian/45 border-b border-blue-fantastic/10 relative">
              {gridColumns.map((col, index) => (
                <div
                  key={index}
                  className="absolute bottom-0 text-[10px] font-bold text-blue-fantastic/55 px-2 border-l border-blue-fantastic/10 h-6 flex items-end pb-1 transform -translate-x-1/2 select-none"
                  style={{ left: `${col.leftPercent}%` }}
                >
                  {col.label}
                </div>
              ))}
            </div>

            {/* Grid rows with vertical lines */}
            <div className="relative divide-y divide-blue-fantastic/5">
              {/* Vertical Grid Lines Background */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {gridColumns.map((col, index) => (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 border-l border-blue-fantastic/[0.04]"
                    style={{ left: `${col.leftPercent}%` }}
                  />
                ))}
              </div>

              {/* Today line overlay */}
              {data.statusFlag !== "not-started" && (
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-truffle-trouble z-30 pointer-events-none"
                  style={{ left: `${getPercent(simulatedToday)}%` }}
                >
                  <div className="absolute top-0 -translate-x-1/2 bg-truffle-trouble text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-md tracking-wider flex items-center gap-1 select-none">
                    <CalendarDays className="h-3 w-3" />
                    <span>TODAY</span>
                  </div>
                </div>
              )}

              {/* Stage Rows */}
              {data.stages.map((stage) => {
                const plannedStartStr = stage.plannedStart;
                const plannedEndStr = stage.plannedEnd;
                const actualStartStr = stage.actualStart || stage.plannedStart;
                const actualEndStr = stage.actualEnd || stage.plannedEnd;

                const plannedLeft = getPercent(plannedStartStr);
                const plannedWidth = getPercent(plannedEndStr) - plannedLeft;

                const actualLeft = getPercent(actualStartStr);
                const actualWidth = getPercent(actualEndStr) - actualLeft;

                const plannedDays = getDaysBetween(plannedStartStr, plannedEndStr);
                const actualDays = getDaysBetween(actualStartStr, actualEndStr);

                const isProjected = stage.status === "in-progress" || stage.status === "upcoming" || stage.status === "delayed";

                return (
                  <div key={stage.id} className="h-20 relative hover:bg-palladian/10 transition-colors z-10 hover:z-40 focus-within:z-40">
                    {/* The double bars */}
                    <div className="w-full h-full px-4">
                      <TimelineBar
                        stageName={stage.name}
                        status={stage.status}
                        plannedLeft={plannedLeft}
                        plannedWidth={plannedWidth}
                        actualLeft={actualLeft}
                        actualWidth={actualWidth}
                        plannedDetails={{
                          start: plannedStartStr,
                          end: plannedEndStr,
                          days: plannedDays,
                          label: "Planned"
                        }}
                        actualDetails={{
                          start: actualStartStr,
                          end: actualEndStr,
                          days: actualDays,
                          label: isProjected ? "Projected" : "Actual"
                        }}
                        isProjected={isProjected}
                      />
                    </div>

                    {/* Milestones for this stage in top milestone track */}
                    {stage.milestones.map((m, idx) => {
                      const leftPercent = getPercent(m.date);
                      return (
                        <MilestoneMarker
                          key={idx}
                          milestone={m}
                          leftPercent={leftPercent}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
