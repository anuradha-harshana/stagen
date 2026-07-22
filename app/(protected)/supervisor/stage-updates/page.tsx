"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ListChecks, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Camera, 
  Save, 
  FileText, 
  Clock, 
  RefreshCw,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { INITIAL_PROJECTS, Project, Stage, DelayLog } from "@/lib/db-mock/projectsData";

function StageUpdatesContent() {
  const searchParams = useSearchParams();
  const lotQuery = searchParams.get("lot");

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("lot-104");
  const [selectedStageName, setSelectedStageName] = useState<string>("Frame");
  const [progressNote, setProgressNote] = useState("");
  
  // Delay form state
  const [delayType, setDelayType] = useState<"Weather" | "Materials" | "Inspections" | "Trade Availability">("Weather");
  const [delayDays, setDelayDays] = useState(3);
  const [delayDesc, setDelayDesc] = useState("");

  // Select project by lot query parameter if it exists on initial load
  useEffect(() => {
    if (lotQuery && projects.some(p => p.id === lotQuery)) {
      setSelectedProjectId(lotQuery);
      const proj = projects.find(p => p.id === lotQuery);
      if (proj) {
        const activeStage = proj.stages.find(s => s.status === "Active")?.name || proj.currentStage;
        setSelectedStageName(activeStage);
      }
    }
  }, [lotQuery]);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // If activeProject stages change, ensure we select an existing stage
  const currentStageDetails = activeProject.stages.find(s => s.name === selectedStageName) || 
                              activeProject.stages.find(s => s.status === "Active") || 
                              activeProject.stages[0];

  const handleProjectChange = (id: string) => {
    setSelectedProjectId(id);
    const proj = projects.find(p => p.id === id);
    if (proj) {
      const activeStage = proj.stages.find(s => s.status === "Active")?.name || proj.currentStage;
      setSelectedStageName(activeStage);
    }
  };

  // Toggle checklist item completeness
  const handleToggleChecklist = (stageName: string, itemId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        const updatedStages = p.stages.map(s => {
          if (s.name === stageName) {
            const updatedChecklist = s.checklist.map(item => {
              if (item.id === itemId) {
                return { ...item, completed: !item.completed };
              }
              return item;
            });

            // Calculate new progress for this stage
            const completedCount = updatedChecklist.filter(item => item.completed).length;
            const totalCount = updatedChecklist.length;
            const newStageProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return {
              ...s,
              checklist: updatedChecklist,
              progress: newStageProgress
            };
          }
          return s;
        });

        // Calculate new overall progress of the project
        // E.g., we have 7 stages. Each completed stage is 14% overall (or let's compute weighted progress)
        const completedStagesCount = updatedStages.filter(s => s.status === "Completed").length;
        const activeStageObj = updatedStages.find(s => s.status === "Active");
        const activeStageProgressContribution = activeStageObj ? (activeStageObj.progress / 100) : 0;
        
        // Simpler overall progress: (Completed Stages + active stage progress fraction) / total stages * 100
        const rawProgress = ((completedStagesCount + activeStageProgressContribution) / updatedStages.length) * 100;
        const newOverallProgress = Math.min(Math.round(rawProgress), 100);

        return {
          ...p,
          stages: updatedStages,
          progress: newOverallProgress
        };
      }
      return p;
    }));
  };

  // Save changes to current stage
  const handleSaveProgress = () => {
    toast.success("Progress saved successfully!");
  };

  // Mark stage as completed and activate next stage
  const handleCompleteStage = (stageName: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        const stageIdx = p.stages.findIndex(s => s.name === stageName);
        if (stageIdx === -1) return p;

        const updatedStages = p.stages.map((s, idx) => {
          if (idx === stageIdx) {
            // Mark completed, set progress to 100%, and check all checklist items
            return {
              ...s,
              status: "Completed" as const,
              progress: 100,
              checklist: s.checklist.map(item => ({ ...item, completed: true }))
            };
          }
          if (idx === stageIdx + 1) {
            // Activate the next stage
            return {
              ...s,
              status: "Active" as const,
              progress: 0
            };
          }
          return s;
        });

        // Compute overall progress
        const completedStagesCount = updatedStages.filter(s => s.status === "Completed").length;
        const activeStageObj = updatedStages.find(s => s.status === "Active");
        const activeStageProgressContribution = activeStageObj ? (activeStageObj.progress / 100) : 0;
        const newOverallProgress = Math.min(
          Math.round(((completedStagesCount + activeStageProgressContribution) / updatedStages.length) * 100), 
          100
        );

        // Determine next active stage name
        const nextActiveStage = updatedStages[stageIdx + 1]?.name || stageName;

        // Update selected stage view
        setTimeout(() => {
          setSelectedStageName(nextActiveStage);
        }, 100);

        return {
          ...p,
          stages: updatedStages,
          progress: newOverallProgress,
          currentStage: nextActiveStage
        };
      }
      return p;
    }));

    toast.success(`Stage '${stageName}' completed! Next stage is now active.`);
  };

  // Submit progress note
  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressNote.trim()) {
      toast.error("Please enter a note to submit");
      return;
    }
    toast.success("Progress note and timeline update posted to customer!");
    setProgressNote("");
  };

  // Log delay
  const handleLogDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delayDesc.trim()) {
      toast.error("Please enter a description for the delay");
      return;
    }

    const newDelay: DelayLog = {
      id: `d-${Date.now()}`,
      type: delayType,
      durationDays: delayDays,
      description: delayDesc,
      date: new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })
    };

    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          status: "Delayed" as const,
          delays: [newDelay, ...p.delays]
        };
      }
      return p;
    }));

    toast.success(`Delay logged. Project status set to 'Delayed'.`);
    setDelayDesc("");
  };

  return (
    <div className="flex flex-col gap-5 w-full px-6 py-6 font-cream">
      {/* 1. Header with project selector */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-1">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <ListChecks className="h-5 w-5 text-burning-flame" />
          </div>
          <div>
            <h1 className="text-blue-fantastic text-2xl font-sans font-bold leading-tight">
              Progress Updates Cockpit
            </h1>
            <p className="text-blue-fantastic/50 text-sm mt-0.5 font-sans">
              Update construction stages, checklists, and log site delays
            </p>
          </div>
        </div>

        {/* Project Selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-fantastic/60 uppercase">Select Site:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="bg-palladian border border-blue-fantastic/15 text-blue-fantastic font-semibold py-1.5 px-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-truffle-trouble cursor-pointer"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.clientName} ({p.id.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Visual Stepper for 7 stages */}
      <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
        <CardContent className="py-4">
          <div className="flex items-center justify-between overflow-x-auto gap-4 py-1 scrollbar-none">
            {activeProject.stages.map((stage, idx) => {
              const isCompleted = stage.status === "Completed";
              const isActive = stage.status === "Active";
              const isSelected = selectedStageName === stage.name;
              
              let stepBg = "bg-blue-fantastic/5 text-blue-fantastic/45 border-blue-fantastic/10";
              let connectorColor = "bg-blue-fantastic/10";
              
              if (isCompleted) {
                stepBg = "bg-truffle-trouble text-palladian border-truffle-trouble shadow-sm";
                connectorColor = "bg-truffle-trouble";
              } else if (isActive) {
                stepBg = "bg-burning-flame text-truffle-trouble border-burning-flame shadow-sm animate-pulse";
              }

              if (isSelected) {
                stepBg += " ring-2 ring-truffle-trouble/50 ring-offset-2 ring-offset-palladian";
              }

              return (
                <React.Fragment key={stage.name}>
                  {/* Step */}
                  <button
                    onClick={() => setSelectedStageName(stage.name)}
                    className="flex flex-col items-center gap-1.5 min-w-[70px] transition-all hover:scale-105 shrink-0 focus:outline-none"
                  >
                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold ${stepBg}`}>
                      {isCompleted ? <CheckCircle2 className="h-4.5 w-4.5" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? "text-truffle-trouble" : "text-blue-fantastic/70"}`}>
                      {stage.name}
                    </span>
                  </button>
                  
                  {/* Connector */}
                  {idx < activeProject.stages.length - 1 && (
                    <div className={`h-[2px] flex-1 min-w-[20px] ${connectorColor} shrink-0`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Stage Checklist Panel & Note Log split */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        {/* Left: Stage Checklist Card (3 cols) */}
        <Card className="lg:col-span-3 bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardHeader className="border-b border-blue-fantastic/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-blue-fantastic/10 flex items-center justify-center">
                <ListChecks className="h-4 w-4 text-blue-fantastic" />
              </div>
              <div>
                <CardTitle className="text-blue-fantastic text-sm font-bold font-cream">
                  {selectedStageName} Stage Details
                </CardTitle>
                <CardDescription className="text-[11px] text-blue-fantastic/60 font-semibold mt-0.5">
                  Update task checks to adjust this stage progress
                </CardDescription>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-blue-fantastic/50 font-bold uppercase">Stage Progress</span>
                  <span className="text-sm font-bold text-truffle-trouble">{currentStageDetails.progress}%</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4 min-h-[300px]">
            {/* Checklist items */}
            {currentStageDetails.checklist && currentStageDetails.checklist.length > 0 ? (
              <div className="flex flex-col gap-2">
                {currentStageDetails.checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(selectedStageName, item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      item.completed 
                        ? "bg-blue-fantastic/4 border-blue-fantastic/10 text-blue-fantastic/50" 
                        : "bg-palladian border-blue-fantastic/15 text-blue-fantastic hover:border-blue-fantastic/30"
                    }`}
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => {}} // toggled on container click
                      className="border-blue-fantastic/30 data-[state=checked]:bg-truffle-trouble data-[state=checked]:border-truffle-trouble h-4.5 w-4.5 rounded"
                    />
                    <span className={`text-xs font-semibold ${item.completed ? "line-through" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="h-10 w-10 rounded-full bg-blue-fantastic/5 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-fantastic/30" />
                </div>
                <p className="text-xs font-bold text-blue-fantastic">No Checklist Required</p>
                <p className="text-[11px] text-blue-fantastic/65 max-w-[200px] mt-1">
                  This stage does not require itemised check-offs.
                </p>
              </div>
            )}

            {/* Quick Actions Panel */}
            <div className="flex gap-2 justify-end mt-auto pt-3 border-t border-blue-fantastic/10">
              <Button
                variant="outline"
                onClick={handleSaveProgress}
                className="text-xs font-semibold border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 gap-1.5 h-8"
              >
                <Save className="h-3.5 w-3.5" />
                Save Progress
              </Button>

              {currentStageDetails.status === "Active" && (
                <Button
                  onClick={() => handleCompleteStage(selectedStageName)}
                  disabled={currentStageDetails.progress < 100}
                  className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold gap-1.5 h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark Stage Completed
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: Logging forms (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Note Upload Form */}
          <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
            <CardHeader className="pb-2 border-b border-blue-fantastic/10">
              <CardTitle className="text-blue-fantastic text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-blue-fantastic" />
                Post Progress Note &amp; Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <form onSubmit={handlePostNote} className="space-y-3">
                <Textarea
                  placeholder="E.g., Framing passed inspector checks today. Electrical starts tomorrow morning..."
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  className="bg-palladian border-blue-fantastic/20 text-xs text-blue-fantastic placeholder:text-blue-fantastic/35 focus-visible:ring-truffle-trouble font-sans"
                  rows={3}
                />
                
                <div className="flex gap-2 items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs border-blue-fantastic/25 text-blue-fantastic hover:bg-blue-fantastic/10 h-7 px-2 font-cream font-bold gap-1"
                  >
                    <Plus className="h-3.5 w-3.5 text-blue-fantastic/60" />
                    Attach Photos
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-fantastic text-palladian hover:bg-blue-fantastic/90 text-xs font-semibold h-7"
                  >
                    Post Note
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Delay Log Form */}
          <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
            <CardHeader className="pb-2 border-b border-blue-fantastic/10">
              <CardTitle className="text-blue-fantastic text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-truffle-trouble" />
                Log Site Delay Incident
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <form onSubmit={handleLogDelay} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-blue-fantastic/60 uppercase">Delay Type</label>
                    <select
                      value={delayType}
                      onChange={(e) => setDelayType(e.target.value as any)}
                      className="bg-palladian border border-blue-fantastic/20 text-blue-fantastic font-semibold py-1 px-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-truffle-trouble cursor-pointer"
                    >
                      <option value="Weather">Weather</option>
                      <option value="Materials">Materials</option>
                      <option value="Inspections">Inspections</option>
                      <option value="Trade Availability">Trades</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-blue-fantastic/60 uppercase">Extension (Days)</label>
                    <Input
                      type="number"
                      value={delayDays}
                      onChange={(e) => setDelayDays(Number(e.target.value))}
                      className="bg-palladian border-blue-fantastic/20 text-xs text-blue-fantastic h-7 font-sans focus-visible:ring-truffle-trouble"
                      min={1}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-blue-fantastic/60 uppercase">Reason / Note</label>
                  <Textarea
                    placeholder="Describe what caused the delay (e.g., Heavy rain flooded site)..."
                    value={delayDesc}
                    onChange={(e) => setDelayDesc(e.target.value)}
                    className="bg-palladian border-blue-fantastic/20 text-xs text-blue-fantastic placeholder:text-blue-fantastic/35 focus-visible:ring-truffle-trouble font-sans"
                    rows={2}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold h-7"
                >
                  Log Delay &amp; Notify Builder
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function StageUpdatesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[50vh]">
        <RefreshCw className="h-6 w-6 text-blue-fantastic animate-spin" />
      </div>
    }>
      <StageUpdatesContent />
    </Suspense>
  );
}
