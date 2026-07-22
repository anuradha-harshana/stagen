"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Wrench, 
  FileText, 
  TrendingUp,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { INITIAL_PROJECTS, Project } from "@/lib/db-mock/projectsData";

export default function SupervisorProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "On Track" | "Delayed">("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects based on search term & status filter
  const filteredProjects = INITIAL_PROJECTS.filter((project) => {
    const matchesSearch = 
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || 
      project.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-5 w-full px-6 py-6 font-cream">
      {/* 1. Header & Quick stats */}
      <div className="flex items-start justify-between flex-wrap gap-4 py-1">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <Building2 className="h-5 w-5 text-burning-flame" />
          </div>
          <div>
            <h1 className="text-blue-fantastic text-2xl font-sans font-bold leading-tight">
              My Build Projects
            </h1>
            <p className="text-blue-fantastic/50 text-sm mt-0.5 font-sans">
              Manage construction schedules, trades, and site inspections
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
            <Input
              placeholder="Search by lot or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-8 text-sm font-sans w-52 focus-visible:ring-truffle-trouble"
            />
          </div>

          <div className="flex gap-1 bg-blue-fantastic/8 p-0.5 rounded-xl border border-blue-fantastic/10">
            {(["All", "On Track", "Delayed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-cream transition-all ${
                  statusFilter === filter
                    ? "bg-blue-fantastic text-palladian shadow-sm"
                    : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-palladian/40 border border-dashed border-blue-fantastic/20 rounded-2xl">
          <Building2 className="h-10 w-10 text-blue-fantastic/30 mb-2" />
          <p className="text-sm font-bold text-blue-fantastic">No Projects Found</p>
          <p className="text-xs text-blue-fantastic/60 mt-1">Try tweaking your search or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-cream">
          {filteredProjects.map((project) => {
            const activeStage = project.stages.find(s => s.status === "Active")?.name || project.currentStage;
            const delayCount = project.delays.length;

            return (
              <Card
                key={project.id}
                className="group relative overflow-hidden bg-palladian border border-blue-fantastic/15 shadow-sm hover:shadow-md hover:border-blue-fantastic/30 transition-all duration-200"
              >
                {/* top accent strip */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-burning-flame/50 via-truffle-trouble/50 to-transparent" />

                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-truffle-trouble" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-blue-fantastic text-sm font-bold font-cream">
                          {project.clientName}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-[10px] border font-bold px-2 py-0.2 ${
                            project.status === "On Track"
                              ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                              : "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                          }`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-fantastic/70 font-semibold mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0 text-blue-fantastic/40" />
                        <span className="truncate">{project.address}</span>
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-2">
                  {/* Current stage indicator */}
                  <div className="bg-blue-fantastic/4 p-2.5 rounded-xl border border-blue-fantastic/5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-fantastic/60 font-bold uppercase tracking-wider">Active Stage</span>
                      <span className="text-xs text-blue-fantastic font-bold">{activeStage}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-blue-fantastic/70">Overall Construction Progress</span>
                      <span className="text-truffle-trouble font-bold">{project.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-blue-fantastic/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-truffle-trouble to-burning-flame/70 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Dates */}
                  <div className="flex justify-between items-center text-[11px] text-blue-fantastic/75 pt-1.5 border-t border-blue-fantastic/10">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-fantastic/40" />
                      <span>Started: <strong>{project.startDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-blue-fantastic/40" />
                      <span>Est Handover: <strong>{project.estHandover}</strong></span>
                    </div>
                  </div>

                  {/* Quick summary and view details */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-blue-fantastic/60 font-bold flex items-center gap-1">
                      {delayCount > 0 ? (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5 text-truffle-trouble" />
                          <span className="text-truffle-trouble font-semibold">{delayCount} delay logs</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-fantastic/40" />
                          <span>No active delays</span>
                        </>
                      )}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setSelectedProject(project)}
                      className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold h-7"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 3. Project Detail Modal */}
      <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="max-w-2xl bg-palladian text-blue-fantastic font-cream border border-blue-fantastic/20 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <Badge
                    variant="outline"
                    className={`text-xs border font-bold px-2 py-0.5 mb-2 ${
                      selectedProject.status === "On Track"
                        ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                        : "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                    }`}
                  >
                    {selectedProject.status}
                  </Badge>
                  <DialogTitle className="text-2xl font-bold font-cream text-blue-fantastic">
                    {selectedProject.clientName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-blue-fantastic/60 font-semibold mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-blue-fantastic/40" />
                    {selectedProject.address}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Left Column: Progress & Milestones */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-truffle-trouble" />
                  Construction Milestones
                </h4>

                <div className="space-y-3 pl-1">
                  {selectedProject.stages.map((stage) => {
                    let dotColor = "bg-blue-fantastic/20 border-blue-fantastic/30";
                    let textColor = "text-blue-fantastic/50";
                    let isCompleted = stage.status === "Completed";
                    let isActive = stage.status === "Active";

                    if (isCompleted) {
                      dotColor = "bg-truffle-trouble border-truffle-trouble";
                      textColor = "text-blue-fantastic/80 font-bold";
                    } else if (isActive) {
                      dotColor = "bg-burning-flame border-burning-flame animate-pulse";
                      textColor = "text-blue-fantastic font-bold";
                    }

                    return (
                      <div key={stage.name} className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full border ${dotColor}`} />
                        <span className={`text-xs ${textColor}`}>{stage.name}</span>
                        {isCompleted && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-truffle-trouble ml-auto shrink-0" />
                        )}
                        {isActive && (
                          <Badge className="ml-auto text-[9px] bg-burning-flame/20 text-truffle-trouble border border-burning-flame/30 hover:bg-burning-flame/20">
                            Active
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Delay Log & Trades */}
              <div className="space-y-5">
                {/* Delay Log History */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-truffle-trouble" />
                    Site Delay History
                  </h4>
                  {selectedProject.delays.length === 0 ? (
                    <p className="text-xs text-blue-fantastic/60 font-semibold italic pl-1">
                      No delay incidents logged for this project.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                      {selectedProject.delays.map((del) => (
                        <div
                          key={del.id}
                          className="p-2.5 rounded-xl bg-burning-flame/8 border border-burning-flame/20 flex flex-col gap-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-truffle-trouble uppercase">
                              {del.type} Delay
                            </span>
                            <span className="text-[10px] text-blue-fantastic/60 font-semibold">{del.date}</span>
                          </div>
                          <p className="text-[11px] text-blue-fantastic/80 font-semibold leading-normal">
                            {del.description} ({del.durationDays} days extension)
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assigned Trades & Certs Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-fantastic" />
                    Required Certificates Checklist
                  </h4>
                  <div className="grid grid-cols-1 gap-2 pl-1">
                    {[
                      { label: "Building Permit & Approved Drawings", done: true },
                      { label: "Engineering Foundation Sign-off", done: true },
                      { label: "Structural Framing Certificate", done: selectedProject.progress >= 45 },
                      { label: "Wet Area Waterproofing Certificate", done: selectedProject.progress >= 75 },
                      { label: "Electrical & Gas Safety Certificates", done: selectedProject.progress >= 90 }
                    ].map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-blue-fantastic/85">
                        {cert.done ? (
                          <CheckCircle2 className="h-4 w-4 text-truffle-trouble shrink-0" />
                        ) : (
                          <span className="h-4 w-4 rounded-md border border-blue-fantastic/30 shrink-0" />
                        )}
                        <span className={cert.done ? "line-through text-blue-fantastic/50" : ""}>
                          {cert.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedProject(null)}
                className="text-xs font-semibold border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setSelectedProject(null);
                  window.location.href = `/supervisor/stage-updates?lot=${selectedProject.id}`;
                }}
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold"
              >
                Update Build Progress
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
