"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Save, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Camera, 
  Edit3, 
  Tag, 
  FileText,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TimelineStage, TimelineMilestone } from "@/lib/timeline/data";

interface SupervisorStageEditorProps {
  stage: TimelineStage | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (updatedStage: TimelineStage) => void;
  onOpenPhotosForStage?: (stageName: string) => void;
}

export function SupervisorStageEditor({
  stage,
  isOpen,
  onClose,
  onUpdateStage,
  onOpenPhotosForStage,
}: SupervisorStageEditorProps) {
  const [status, setStatus] = useState<TimelineStage["status"]>("upcoming");
  const [actualStart, setActualStart] = useState("");
  const [actualEnd, setActualEnd] = useState("");
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);

  // New milestone form state
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const [newMilestoneType, setNewMilestoneType] = useState<"inspection" | "approval" | "delivery" | "delay">("inspection");
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  useEffect(() => {
    if (stage) {
      setStatus(stage.status);
      setActualStart(stage.actualStart || stage.plannedStart);
      setActualEnd(stage.actualEnd || stage.plannedEnd);
      setMilestones(stage.milestones || []);
      setShowAddMilestone(false);
    }
  }, [stage]);

  if (!stage || !isOpen) return null;

  const handleSave = () => {
    const updatedStage: TimelineStage = {
      ...stage,
      status,
      actualStart: actualStart || undefined,
      actualEnd: actualEnd || undefined,
      milestones,
    };

    onUpdateStage(updatedStage);
    toast.success(`Updated ${stage.name} Stage details!`);
    onClose();
  };

  const handleAddMilestone = () => {
    if (!newMilestoneName.trim() || !newMilestoneDate) {
      toast.error("Please enter both milestone name and date");
      return;
    }

    const newM: TimelineMilestone = {
      name: newMilestoneName.trim(),
      date: newMilestoneDate,
      type: newMilestoneType,
      status: "scheduled",
    };

    setMilestones((prev) => [...prev, newM]);
    setNewMilestoneName("");
    setNewMilestoneDate("");
    setShowAddMilestone(false);
    toast.success("Milestone event added");
  };

  const handleToggleMilestone = (index: number) => {
    setMilestones((prev) =>
      prev.map((m, i) =>
        i === index
          ? {
              ...m,
              status: m.status === "completed" ? "scheduled" : "completed",
            }
          : m
      )
    );
  };

  const handleDeleteMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
    toast.success("Milestone event removed");
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-palladian border-l border-blue-fantastic/20 shadow-2xl p-5 flex flex-col justify-between font-cream overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-fantastic/10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-fantastic flex items-center justify-center text-burning-flame">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-blue-fantastic font-cream font-bold text-base leading-tight">
                Manage {stage.name} Stage
              </h3>
              <p className="text-xs text-blue-fantastic/60 font-sans">
                Update status, dates & milestone markers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl hover:bg-blue-fantastic/10 flex items-center justify-center text-blue-fantastic/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="py-4 space-y-4 font-sans text-xs">
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-bold font-cream text-blue-fantastic mb-1">
              Stage Execution Status
            </label>
            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
              <SelectTrigger className="w-full bg-palladian border-blue-fantastic/20 text-blue-fantastic font-cream font-bold text-xs h-9 rounded-xl">
                <SelectValue placeholder="Select Status..." />
              </SelectTrigger>
              <SelectContent className="bg-palladian border-blue-fantastic/20 font-sans">
                <SelectItem value="upcoming" className="text-xs cursor-pointer">
                  ⚪ Not Started (Upcoming)
                </SelectItem>
                <SelectItem value="in-progress" className="text-xs cursor-pointer">
                  🔵 Active Build (In Progress)
                </SelectItem>
                <SelectItem value="completed-on-time" className="text-xs cursor-pointer text-emerald-700">
                  🟢 Completed On-Time
                </SelectItem>
                <SelectItem value="completed-late" className="text-xs cursor-pointer text-amber-700">
                  🟠 Completed Late
                </SelectItem>
                <SelectItem value="delayed" className="text-xs cursor-pointer text-red-700">
                  🔴 Projected Delay
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Planned vs Actual Start Date */}
          <div className="grid grid-cols-2 gap-3 bg-palladian/60 p-3 rounded-xl border border-blue-fantastic/10">
            <div>
              <span className="block text-[10px] text-blue-fantastic/50 uppercase font-semibold">Planned Start</span>
              <span className="font-bold text-blue-fantastic">{stage.plannedStart}</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-blue-fantastic/70 uppercase mb-0.5">Actual/Est. Start</label>
              <Input
                type="date"
                value={actualStart}
                onChange={(e) => setActualStart(e.target.value)}
                className="bg-palladian border-blue-fantastic/20 text-blue-fantastic h-7 text-xs font-sans rounded-lg"
              />
            </div>
          </div>

          {/* Planned vs Actual End Date */}
          <div className="grid grid-cols-2 gap-3 bg-palladian/60 p-3 rounded-xl border border-blue-fantastic/10">
            <div>
              <span className="block text-[10px] text-blue-fantastic/50 uppercase font-semibold">Planned End</span>
              <span className="font-bold text-blue-fantastic">{stage.plannedEnd}</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-truffle-trouble uppercase mb-0.5">Actual/Est. End</label>
              <Input
                type="date"
                value={actualEnd}
                onChange={(e) => setActualEnd(e.target.value)}
                className="bg-palladian border-truffle-trouble/30 text-blue-fantastic h-7 text-xs font-sans rounded-lg"
              />
            </div>
          </div>

          {/* Milestones Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-cream text-blue-fantastic flex items-center">
                <Tag className="h-3.5 w-3.5 mr-1 text-truffle-trouble" />
                Stage Milestones ({milestones.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddMilestone(!showAddMilestone)}
                className="text-[11px] font-bold text-truffle-trouble hover:underline flex items-center"
              >
                <Plus className="h-3 w-3 mr-0.5" />
                Add Event
              </button>
            </div>

            {/* Add Milestone Inline Form */}
            {showAddMilestone && (
              <div className="p-3 bg-palladian border border-truffle-trouble/30 rounded-xl space-y-2 mb-3">
                <Input
                  placeholder="Milestone title (e.g. Frame Sign-off)"
                  value={newMilestoneName}
                  onChange={(e) => setNewMilestoneName(e.target.value)}
                  className="bg-palladian border-blue-fantastic/20 text-xs h-7 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    className="bg-palladian border-blue-fantastic/20 text-xs h-7 rounded-lg"
                  />
                  <Select value={newMilestoneType} onValueChange={(v: any) => setNewMilestoneType(v)}>
                    <SelectTrigger className="bg-palladian border-blue-fantastic/20 text-xs h-7 rounded-lg">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-palladian border-blue-fantastic/20 font-sans">
                      <SelectItem value="inspection" className="text-xs">Inspection</SelectItem>
                      <SelectItem value="approval" className="text-xs">Approval</SelectItem>
                      <SelectItem value="delivery" className="text-xs">Delivery</SelectItem>
                      <SelectItem value="delay" className="text-xs">Delay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <Button type="button" onClick={() => setShowAddMilestone(false)} variant="ghost" className="h-6 text-[10px] px-2">Cancel</Button>
                  <Button type="button" onClick={handleAddMilestone} className="h-6 text-[10px] px-2.5 bg-blue-fantastic text-palladian">Add</Button>
                </div>
              </div>
            )}

            {/* Milestones List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {milestones.length === 0 ? (
                <p className="text-[11px] text-blue-fantastic/50 italic py-2 text-center bg-palladian/40 rounded-xl border border-dashed border-blue-fantastic/10">
                  No milestone events recorded yet.
                </p>
              ) : (
                milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-palladian/60 border border-blue-fantastic/10 text-[11px]"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <button
                        type="button"
                        onClick={() => handleToggleMilestone(idx)}
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          m.status === "completed"
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-blue-fantastic/30 text-transparent hover:border-blue-fantastic"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </button>
                      <div className="truncate">
                        <span className={`font-semibold block truncate ${m.status === "completed" ? "line-through opacity-70" : "text-blue-fantastic"}`}>
                          {m.name}
                        </span>
                        <span className="text-[10px] text-blue-fantastic/50 font-mono">{m.date} ({m.type})</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(idx)}
                      className="text-red-500/70 hover:text-red-600 p-1 shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-blue-fantastic/10 space-y-2">
        {onOpenPhotosForStage && (
          <Button
            type="button"
            onClick={() => onOpenPhotosForStage(stage.name)}
            variant="outline"
            className="w-full border-blue-fantastic/20 hover:bg-blue-fantastic/10 text-blue-fantastic font-cream font-bold text-xs h-8 rounded-xl justify-center"
          >
            <Camera className="h-3.5 w-3.5 mr-1.5 text-truffle-trouble" />
            View Site Photos for {stage.name}
          </Button>
        )}

        <Button
          type="button"
          onClick={handleSave}
          className="w-full bg-blue-fantastic hover:bg-abyssal-blue text-palladian font-cream font-bold text-xs h-9 rounded-xl justify-center shadow-xs"
        >
          <Save className="h-3.5 w-3.5 mr-1.5 text-burning-flame" />
          Save Stage Changes
        </Button>
      </div>
    </div>
  );
}
