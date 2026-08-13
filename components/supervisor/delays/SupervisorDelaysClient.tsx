"use client";

import React, { useState } from "react";
import { useUser } from "@/components/Providers/UserProvider";
import { Project } from "@/lib/db-mock/projectsData";
import { TimelinePageData, DelayLogEntry } from "@/lib/timeline/data";
import { 
  INITIAL_SUPERVISOR_TIMELINES, 
  recalculateTimelineStats, 
  getAssignedProjects 
} from "@/components/supervisor/timeline/supervisor-timeline-store";
import { INITIAL_DELAY_MESSAGES, DelayMessage, getDelayCategoryMeta } from "./DelayStore";
import { DelayStatsOverview } from "./DelayStatsOverview";
import { LogDelayFormModal } from "./LogDelayFormModal";
import { SendDelayMessageModal } from "./SendDelayMessageModal";
import { DelayMessagesList } from "./DelayMessagesList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  Plus, 
  Send, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  CloudRain, 
  Wrench, 
  FileCheck, 
  Users, 
  Package, 
  HelpCircle,
  Building2,
  Calendar,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export function SupervisorDelaysClient() {
  const user = useUser();
  const assignedProjects = getAssignedProjects(user?.id);

  // Active project selection
  const [selectedProjectId, setSelectedProjectId] = useState<string>(assignedProjects[0]?.id || "lot-104");

  // Timelines dictionary state for live updates
  const [timelines, setTimelines] = useState<Record<string, TimelinePageData>>(INITIAL_SUPERVISOR_TIMELINES);

  // Messages dictionary state for customer notices
  const [delayMessages, setDelayMessages] = useState<DelayMessage[]>(INITIAL_DELAY_MESSAGES);

  // Active tab state: "log" vs "notices"
  const [activeTab, setActiveTab] = useState<"log" | "notices">("log");

  // Active project timeline data
  const currentTimelineRaw = timelines[selectedProjectId] || INITIAL_SUPERVISOR_TIMELINES["lot-104"];
  const currentTimeline = recalculateTimelineStats(currentTimelineRaw);
  const activeProject = assignedProjects.find((p: Project) => p.id === selectedProjectId) || assignedProjects[0];

  // Active project delay messages
  const currentMessages = delayMessages.filter((m) => m.projectId === selectedProjectId);

  // Modal controls
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedDelayForEdit, setSelectedDelayForEdit] = useState<DelayLogEntry | null>(null);
  const [selectedDelayForMessage, setSelectedDelayForMessage] = useState<DelayLogEntry | null>(null);

  // Handlers
  const handleOpenNewDelay = () => {
    setSelectedDelayForEdit(null);
    setIsLogModalOpen(true);
  };

  const handleOpenEditDelay = (entry: DelayLogEntry) => {
    setSelectedDelayForEdit(entry);
    setIsLogModalOpen(true);
  };

  const handleOpenSendMessage = (entry?: DelayLogEntry) => {
    setSelectedDelayForMessage(entry || null);
    setIsMessageModalOpen(true);
  };

  const handleSaveDelay = (entry: DelayLogEntry, autoNotify: boolean) => {
    setTimelines((prev) => {
      const projTimeline = prev[selectedProjectId] || INITIAL_SUPERVISOR_TIMELINES["lot-104"];
      const existingLog = projTimeline.delayLog || [];

      let updatedLog: DelayLogEntry[];
      const existsIndex = existingLog.findIndex((d) => String(d.id) === String(entry.id));

      if (existsIndex >= 0) {
        updatedLog = [...existingLog];
        updatedLog[existsIndex] = entry;
      } else {
        updatedLog = [...existingLog, entry];
      }

      const updatedTimeline = recalculateTimelineStats({
        ...projTimeline,
        delayLog: updatedLog,
      });

      return {
        ...prev,
        [selectedProjectId]: updatedTimeline,
      };
    });

    if (autoNotify) {
      setSelectedDelayForMessage(entry);
      setIsMessageModalOpen(true);
    }
  };

  const handleDeleteDelay = (delayId: string | number) => {
    setTimelines((prev) => {
      const projTimeline = prev[selectedProjectId] || INITIAL_SUPERVISOR_TIMELINES["lot-104"];
      const updatedLog = (projTimeline.delayLog || []).filter((d) => String(d.id) !== String(delayId));

      const updatedTimeline = recalculateTimelineStats({
        ...projTimeline,
        delayLog: updatedLog,
      });

      return {
        ...prev,
        [selectedProjectId]: updatedTimeline,
      };
    });
    toast.success("Delay log entry removed");
  };

  const handleSendMessage = (newMessage: DelayMessage) => {
    setDelayMessages((prev) => [newMessage, ...prev]);
  };

  const getCategoryIcon = (type: DelayLogEntry["type"]) => {
    switch (type) {
      case "weather":
        return <CloudRain className="h-4.5 w-4.5" />;
      case "machinery":
        return <Wrench className="h-4.5 w-4.5" />;
      case "permits":
        return <FileCheck className="h-4.5 w-4.5" />;
      case "labor":
        return <Users className="h-4.5 w-4.5" />;
      case "materials":
        return <Package className="h-4.5 w-4.5" />;
      default:
        return <HelpCircle className="h-4.5 w-4.5" />;
    }
  };

  return (
    <div className="space-y-6 font-sans p-4 sm:p-6 max-w-7xl mx-auto">
      {/* 1. Header Row & Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-fantastic/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-truffle-trouble font-bold">
            <AlertTriangle className="h-5 w-5" />
            <h1 className="text-2xl font-bold font-sans text-blue-fantastic tracking-tight">
              Delay Management
            </h1>
          </div>
          <p className="text-xs text-blue-fantastic/70 font-sans mt-0.5">
            Log official schedule adjustments, update target dates, and notify clients.
          </p>
        </div>

        {/* Project Selector & New Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-fantastic/50" />
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-64 bg-palladian border-blue-fantastic/20 text-blue-fantastic font-sans font-bold text-xs h-10 rounded-xl">
                <SelectValue placeholder="Select Lot..." />
              </SelectTrigger>
              <SelectContent className="bg-palladian border-blue-fantastic/20 font-sans">
                {assignedProjects.map((proj: Project) => (
                  <SelectItem key={proj.id} value={proj.id} className="text-xs cursor-pointer">
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="font-bold font-sans">{proj.id.toUpperCase()}</span>
                      <span className="text-blue-fantastic/60 text-[11px] truncate max-w-[130px]">
                        {proj.clientName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleOpenNewDelay}
            className="bg-truffle-trouble hover:bg-truffle-trouble/90 text-palladian font-bold font-sans text-xs rounded-xl h-10 px-4 shadow-sm gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Log New Delay</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Summary Stat Row */}
      <DelayStatsOverview timelineData={currentTimeline} messages={currentMessages} />

      {/* 3. View Switcher Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-fantastic/10 pb-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-blue-fantastic/5 p-1 rounded-xl border border-blue-fantastic/10 self-start">
          <button
            onClick={() => setActiveTab("log")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-1.5",
              activeTab === "log"
                ? "bg-palladian text-blue-fantastic shadow-xs"
                : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule Adjustments Log ({currentTimeline.delayLog?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("notices")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-1.5",
              activeTab === "notices"
                ? "bg-palladian text-blue-fantastic shadow-xs"
                : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
            )}
          >
            <MessageSquare className="h-3.5 w-3.5 text-truffle-trouble" />
            <span>Customer Delay Notices ({currentMessages.length})</span>
          </button>
        </div>

        {/* Quick Send Notice Action */}
        <Button
          variant="outline"
          onClick={() => handleOpenSendMessage()}
          className="bg-palladian border-blue-fantastic/20 text-blue-fantastic font-bold text-xs rounded-xl h-9 gap-1.5 self-start sm:self-auto"
        >
          <Send className="h-3.5 w-3.5 text-truffle-trouble" />
          <span>Send Customer Notice</span>
        </Button>
      </div>

      {/* 4. Tab Contents */}
      {activeTab === "log" ? (
        <div className="space-y-4">
          {!currentTimeline.delayLog || currentTimeline.delayLog.length === 0 ? (
            <div className="bg-palladian border border-blue-fantastic/10 rounded-2xl p-8 text-center space-y-2">
              <AlertTriangle className="h-8 w-8 text-blue-fantastic/30 mx-auto" />
              <h4 className="text-sm font-extrabold text-blue-fantastic font-sans">
                No Delay Log Entries
              </h4>
              <p className="text-xs text-blue-fantastic/60 font-sans max-w-sm mx-auto">
                No schedule adjustments have been logged for {activeProject.id.toUpperCase()} yet. Click "Log New Delay" to add an incident.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {currentTimeline.delayLog.map((entry) => {
                const catMeta = getDelayCategoryMeta(entry.type);
                const hasMessageSent = currentMessages.some((m) => String(m.delayId) === String(entry.id));

                return (
                  <div
                    key={entry.id}
                    className="bg-palladian border border-blue-fantastic/10 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all hover:border-blue-fantastic/20"
                  >
                    {/* Left Icon + Text details */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {/* Left Category Icon Badge */}
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5",
                          catMeta.bgClass
                        )}
                      >
                        {getCategoryIcon(entry.type)}
                      </div>

                      {/* Incident Info */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-truffle-trouble">
                            {entry.stageName} STAGE
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-fantastic/20" />
                          <span className="text-xs text-blue-fantastic/50 font-semibold font-sans">
                            Logged: {entry.date}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-extrabold px-2 py-0.5 rounded-full font-sans",
                              catMeta.badgeBg
                            )}
                          >
                            {catMeta.label}
                          </span>
                        </div>

                        <h4 className="text-sm font-extrabold text-blue-fantastic font-sans">
                          {entry.title}
                        </h4>

                        <p className="text-xs text-blue-fantastic/75 font-sans leading-relaxed">
                          {entry.reason}
                        </p>
                      </div>
                    </div>

                    {/* Schedule Impact (Exact Customer View Matching) + Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                      {/* SCHEDULE IMPACT Box */}
                      <div className="bg-palladian/40 border border-blue-fantastic/10 px-4 py-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 min-w-[180px]">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-fantastic/50 block text-center font-sans">
                          Schedule Impact
                        </span>
                        <div className="flex items-center gap-2 text-xs font-extrabold text-blue-fantastic font-sans">
                          <span className="text-blue-fantastic/50 line-through">
                            {entry.fromDate}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-truffle-trouble shrink-0" />
                          <span className="text-truffle-trouble font-black">
                            {entry.toDate}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenSendMessage(entry)}
                          className={cn(
                            "h-9 text-xs font-bold rounded-xl gap-1.5",
                            hasMessageSent
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-blue-fantastic/5 text-blue-fantastic border-blue-fantastic/20 hover:bg-blue-fantastic/10"
                          )}
                        >
                          <Send className="h-3.5 w-3.5 text-truffle-trouble" />
                          <span>{hasMessageSent ? "Sent Notice" : "Notify Client"}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDelay(entry)}
                          className="h-9 w-9 p-0 text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-blue-fantastic/5 rounded-xl"
                          title="Edit delay log"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDelay(entry.id)}
                          className="h-9 w-9 p-0 text-blue-fantastic/40 hover:text-truffle-trouble hover:bg-truffle-trouble/10 rounded-xl"
                          title="Delete delay log"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <DelayMessagesList messages={currentMessages} />
      )}

      {/* Log Delay Modal */}
      <LogDelayFormModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        stages={currentTimeline.stages}
        onSaveDelay={handleSaveDelay}
        initialEntry={selectedDelayForEdit}
      />

      {/* Send Message Modal */}
      <SendDelayMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        projectId={selectedProjectId}
        customerName={activeProject.clientName}
        customerEmail={`${activeProject.clientName.toLowerCase().replace(" ", ".")}@example.com`}
        delayEntry={selectedDelayForMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
