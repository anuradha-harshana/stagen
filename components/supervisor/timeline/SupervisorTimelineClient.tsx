"use client";

import React, { useState } from "react";
import { 
  History, 
  Building2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  Save, 
  Search, 
  Camera,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@/components/Providers/UserProvider";
import { Project } from "@/lib/db-mock/projectsData";
import { 
  TimelinePageData, 
  TimelineStage, 
  DelayLogEntry 
} from "@/lib/timeline/data";
import ZoomToggle, { ZoomScale } from "@/components/Customer/Timeline/ZoomToggle";
import { 
  INITIAL_SUPERVISOR_TIMELINES, 
  recalculateTimelineStats, 
  getAssignedProjects 
} from "./supervisor-timeline-store";
import { SupervisorGanttChart } from "./SupervisorGanttChart";
import { SupervisorStageEditor } from "./SupervisorStageEditor";
import { LogDelayModal } from "./LogDelayModal";
import { SupervisorDelayLog } from "./SupervisorDelayLog";

export function SupervisorTimelineClient() {
  const user = useUser();
  const assignedProjects = getAssignedProjects(user?.id);

  // Selected project state
  const [selectedProjectId, setSelectedProjectId] = useState<string>(assignedProjects[0]?.id || "lot-104");

  // Timelines dictionary state for mock persistence
  const [timelines, setTimelines] = useState<Record<string, TimelinePageData>>(INITIAL_SUPERVISOR_TIMELINES);

  // Active project timeline data
  const currentTimelineRaw = timelines[selectedProjectId] || INITIAL_SUPERVISOR_TIMELINES["lot-104"];
  const currentTimeline = recalculateTimelineStats(currentTimelineRaw);

  // Controls state
  const [zoomScale, setZoomScale] = useState<ZoomScale>("month");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [simulatedToday] = useState<string>("2024-07-10");

  // Selection for Stage Editor
  const [selectedStage, setSelectedStage] = useState<TimelineStage | null>(null);

  // Delay Modal state
  const [isLogDelayOpen, setIsLogDelayOpen] = useState(false);

  const activeProject = assignedProjects.find((p: Project) => p.id === selectedProjectId) || assignedProjects[0];

  // Handlers for Timeline Updates
  const handleUpdateStage = (updatedStage: TimelineStage) => {
    setTimelines((prev) => {
      const projTimeline = prev[selectedProjectId] || currentTimeline;
      const newStages = projTimeline.stages.map((s) => (s.id === updatedStage.id ? updatedStage : s));

      const updated = recalculateTimelineStats({
        ...projTimeline,
        stages: newStages,
      });

      return {
        ...prev,
        [selectedProjectId]: updated,
      };
    });

    if (selectedStage && selectedStage.id === updatedStage.id) {
      setSelectedStage(updatedStage);
    }
  };

  const handleSaveDelayLogEntry = (newEntry: DelayLogEntry) => {
    setTimelines((prev) => {
      const projTimeline = prev[selectedProjectId] || currentTimeline;
      const updatedLog = [newEntry, ...projTimeline.delayLog];

      // Update associated stage status to 'delayed' if not already completed
      const updatedStages = projTimeline.stages.map((s) => {
        if (s.name === newEntry.stageName && s.status !== "completed-on-time" && s.status !== "completed-late") {
          return {
            ...s,
            status: "delayed" as const,
            actualEnd: newEntry.toDate,
          };
        }
        return s;
      });

      const updated = recalculateTimelineStats({
        ...projTimeline,
        stages: updatedStages,
        delayLog: updatedLog,
        currentProjectedCompletion: newEntry.toDate,
      });

      return {
        ...prev,
        [selectedProjectId]: updated,
      };
    });
  };

  const handleDeleteDelayLogEntry = (logId: number) => {
    setTimelines((prev) => {
      const projTimeline = prev[selectedProjectId] || currentTimeline;
      const updatedLog = projTimeline.delayLog.filter((item) => item.id !== logId);

      const updated = recalculateTimelineStats({
        ...projTimeline,
        delayLog: updatedLog,
      });

      return {
        ...prev,
        [selectedProjectId]: updated,
      };
    });
    toast.success("Log entry removed");
  };

  const handleSaveAllChanges = () => {
    toast.success(`Timeline schedule for ${selectedProjectId.toUpperCase()} saved and synced with customer portal!`);
  };

  // SVG Gauge calculations
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentTimeline.percentage / 100) * circumference;

  // Filter stages according to statusFilter
  const filteredStages = currentTimeline.stages.filter((stage) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active Build") return stage.status === "in-progress";
    if (statusFilter === "Completed") return stage.status === "completed-on-time" || stage.status === "completed-late";
    if (statusFilter === "Delayed") return stage.status === "delayed";
    return true;
  });

  const filteredTimelineData: TimelinePageData = {
    ...currentTimeline,
    stages: filteredStages,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header & Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-1 border-b border-blue-fantastic/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <History className="h-6 w-6 text-burning-flame" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-blue-fantastic text-2xl font-sans font-bold leading-tight">
                Supervisor Timeline Manager
              </h1>
            </div>
            <p className="text-blue-fantastic/60 text-xs sm:text-sm mt-0.5 font-sans">
              Update construction milestone dates, status flags, and customer delay logs
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            onClick={() => setIsLogDelayOpen(true)}
            variant="outline"
            className="border-truffle-trouble/30 hover:bg-truffle-trouble/10 text-truffle-trouble font-sans font-bold text-xs h-9 px-3.5 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-1 text-truffle-trouble" />
            Log Schedule Adjustment
          </Button>

          <Button
            type="button"
            onClick={handleSaveAllChanges}
            className="bg-blue-fantastic hover:bg-abyssal-blue text-palladian font-sans font-bold text-xs h-9 px-4 rounded-xl shadow-xs"
          >
            <Save className="h-4 w-4 mr-1.5 text-burning-flame" />
            Save Timeline Changes
          </Button>
        </div>
      </div>

      {/* 2. Project Selection Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-inset p-3.5 rounded-2xl border border-blue-fantastic/15">
        <div className="flex items-center gap-2.5 flex-1">
          <span className="text-xs font-bold font-sans text-blue-fantastic flex items-center shrink-0">
            <Building2 className="h-4 w-4 mr-1.5 text-truffle-trouble" />
            Select Construction Lot:
          </span>

          <div className="w-full sm:w-72">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-full bg-white border-blue-fantastic/20 text-blue-fantastic font-sans font-bold text-xs h-9 rounded-xl focus:ring-truffle-trouble">
                <SelectValue placeholder="Select Lot..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-fantastic/20 font-sans">
                {assignedProjects.map((proj: Project) => (
                  <SelectItem key={proj.id} value={proj.id} className="text-xs cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-bold font-sans">{proj.id.toUpperCase()}</span>
                      <span className="text-blue-fantastic/60 text-[11px] truncate max-w-[140px]">{proj.clientName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-sans text-blue-fantastic/70 shrink-0">
          <span className="font-semibold text-blue-fantastic">{activeProject.clientName}</span>
          <span className="text-blue-fantastic/40">·</span>
          <span className="text-blue-fantastic/60">{activeProject.address}</span>
        </div>
      </div>

      {/* 3. Stat Cards Row (Matches Customer View) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Circular Gauge Ring */}
        <Card className="bg-white border border-blue-fantastic/15 shadow-xs font-sans">
          <CardContent className="p-4 sm:p-5 flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
              <svg className="h-24 w-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="#2c3b4d"
                  strokeOpacity="0.15"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="#a35139"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-blue-fantastic leading-none">
                  {currentTimeline.percentage}%
                </span>
                <span className="text-[10px] text-blue-fantastic/50 font-sans font-semibold mt-0.5 uppercase">
                  Complete
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-blue-fantastic">Overall Construction</h4>
              <p className="text-xs text-blue-fantastic/60 font-sans mt-0.5 leading-snug">
                {currentTimeline.percentage === 0
                  ? "Pre-construction mobilization underway."
                  : currentTimeline.percentage >= 100
                  ? "Build completed and ready for PCI handover."
                  : `${activeProject.currentStage} stage active.`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Projected Completion */}
        <Card className="bg-white border border-blue-fantastic/15 shadow-xs font-sans">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-blue-fantastic/50 font-sans uppercase font-semibold tracking-wider">
                  Target Handover Date
                </span>
                <h4 className="text-lg font-bold text-blue-fantastic mt-0.5">
                  {currentTimeline.currentProjectedCompletion}
                </h4>
              </div>
              <div className="h-8 w-8 rounded-xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center text-blue-fantastic shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
            </div>

            <p className="text-xs text-blue-fantastic/60 font-sans mt-2">
              Original estimate: <span className="font-semibold">{currentTimeline.originalEstCompletion}</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Schedule Status */}
        <Card className="bg-white border border-blue-fantastic/15 shadow-xs font-sans">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-blue-fantastic/50 font-sans uppercase font-semibold tracking-wider">
                  Schedule Health
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={`text-xs font-bold ${
                      currentTimeline.statusFlag === "delayed"
                        ? "bg-truffle-trouble/15 text-truffle-trouble border-truffle-trouble/30"
                        : "bg-emerald-500/15 text-emerald-800 border-emerald-500/30"
                    }`}
                  >
                    {currentTimeline.statusFlag === "delayed"
                      ? `Delayed by ${currentTimeline.delayDays} days`
                      : "On Track"}
                  </Badge>
                </div>
              </div>
              <div className="h-8 w-8 rounded-xl bg-truffle-trouble/15 border border-truffle-trouble/30 flex items-center justify-center text-truffle-trouble shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>

            <p className="text-xs text-blue-fantastic/60 font-sans mt-2">
              {currentTimeline.delayLog.length} schedule adjustment entries recorded.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Controls Row: Status Segmented Filter + Zoom Scale */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-blue-fantastic/8 p-1 rounded-xl border border-blue-fantastic/10 self-start">
          {["All", "Active Build", "Completed", "Delayed"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
                statusFilter === filter
                  ? "bg-white text-blue-fantastic shadow-xs"
                  : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Zoom Scale Toggle */}
        <ZoomToggle currentScale={zoomScale} onChange={setZoomScale} />
      </div>

      {/* 5. Main Gantt Chart Panel */}
      <SupervisorGanttChart
        data={filteredTimelineData}
        zoomScale={zoomScale}
        simulatedToday={simulatedToday}
        selectedStageId={selectedStage?.id || null}
        onSelectStage={(stage) => setSelectedStage(stage)}
      />

      {/* 6. Schedule Adjustments Log */}
      <SupervisorDelayLog
        delayLog={currentTimeline.delayLog}
        onDeleteLogEntry={handleDeleteDelayLogEntry}
      />

      {/* 7. Slide-over Stage Editor Sheet */}
      <SupervisorStageEditor
        stage={selectedStage}
        isOpen={Boolean(selectedStage)}
        onClose={() => setSelectedStage(null)}
        onUpdateStage={handleUpdateStage}
      />

      {/* 8. Log Delay Modal */}
      <LogDelayModal
        isOpen={isLogDelayOpen}
        onClose={() => setIsLogDelayOpen(false)}
        stages={currentTimeline.stages}
        onSaveDelayLog={handleSaveDelayLogEntry}
      />
    </div>
  );
}
