"use client";

import React, { useState } from "react";
import DemoControls from "../Progress/DemoControls";
import TimelineHeader from "./TimelineHeader";
import ZoomToggle, { ZoomScale } from "./ZoomToggle";
import GanttChart from "./GanttChart";
import MobileTimeline from "./MobileTimeline";
import DelayLog from "./DelayLog";
import { User } from "@/lib/types/types";
import {
  timelineNotStartedData,
  timelineActiveData,
  timelineCompletedData,
  TimelinePageData
} from "@/lib/timeline/data";

interface TimelinePageClientProps {
  user: User;
}

export default function TimelinePageClient({ user }: TimelinePageClientProps) {
  const [demoState, setDemoState] = useState<"active" | "not-started" | "completed">("active");
  const [zoomScale, setZoomScale] = useState<ZoomScale>("project");

  // Select dataset based on review toggle
  const data: TimelinePageData =
    demoState === "not-started"
      ? timelineNotStartedData
      : demoState === "completed"
        ? timelineCompletedData
        : timelineActiveData;

  // Determine Today's simulated date based on active demo state to keep display correct
  const getSimulatedToday = () => {
    switch (demoState) {
      case "not-started":
        return "2024-10-20";
      case "completed":
        return "2024-09-12";
      case "active":
      default:
        return "2024-07-10";
    }
  };

  const simulatedToday = getSimulatedToday();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Main Timeline Header Widget */}
      <TimelineHeader
        percentage={data.percentage}
        startDate={data.startDate}
        originalEstCompletion={data.originalEstCompletion}
        currentProjectedCompletion={data.currentProjectedCompletion}
        statusFlag={data.statusFlag}
        delayDays={data.delayDays}
        stages={data.stages}
      />

      {/* 2. Interactive Review Mode Header (Aligned Right, Card style removed) */}
      <div className="flex justify-end w-full">
        <DemoControls currentState={demoState} onChange={setDemoState} />
      </div>

      {/* 3. Gantt Layout Controls Header Row */}
      <div className="flex items-center justify-between gap-4 bg-white/80 border border-blue-fantastic/5 px-6 py-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">
            Build Schedule Visualization
          </span>
        </div>

        {/* Only show zoom toggle on desktop since Gantt is desktop-only */}
        <div className="hidden md:block">
          <ZoomToggle currentScale={zoomScale} onChange={setZoomScale} />
        </div>

        <div className="block md:hidden text-[10px] font-bold text-blue-fantastic/50 uppercase tracking-widest">
          Mobile Stack List
        </div>
      </div>

      {/* 4. Desktop Gantt Chart (Hidden on Mobile) */}
      <div className="hidden md:block w-full">
        <GanttChart
          data={data}
          zoomScale={zoomScale}
          simulatedToday={simulatedToday}
        />
      </div>

      {/* 5. Mobile Fallback (Stacked List) */}
      <div className="block md:hidden w-full">
        <MobileTimeline stages={data.stages} />
      </div>

      {/* 6. Delay and Shift Logs Log list */}
      <div className="w-full">
        <DelayLog logs={data.delayLog} />
      </div>
    </div>
  );
}
