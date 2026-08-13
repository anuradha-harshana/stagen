"use client";

import React from "react";
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  FileText,
  TrendingUp,
  User,
  ShieldCheck
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/db-mock/projectsData";

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-palladian text-blue-fantastic font-sans border border-blue-fantastic/20 max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs border font-bold px-2 py-0.5 ${
                    project.status === "On Track"
                      ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                      : project.status === "Delayed"
                      ? "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                      : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  {project.status}
                </Badge>
                <Badge className="text-xs bg-blue-fantastic/5 text-blue-fantastic border border-blue-fantastic/20">
                  Lot {project.id.toUpperCase()}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold font-sans text-blue-fantastic">
                {project.clientName}
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-fantastic/60 font-semibold mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-blue-fantastic/40" />
                {project.address}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column: Progress & Milestones */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-fantastic/5 pb-2">
              <TrendingUp className="h-4 w-4 text-truffle-trouble" />
              Construction Milestones
            </h4>

            <div className="space-y-3 pl-1">
              {project.stages.map((stage) => {
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
                  <div key={stage.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
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
                    {/* Render stage checklist if active or completed */}
                    {stage.checklist && stage.checklist.length > 0 && (isActive || isCompleted) && (
                      <div className="pl-5.5 space-y-1">
                        {stage.checklist.map((item) => (
                          <div key={item.id} className="flex items-center gap-1.5 text-[10px] text-blue-fantastic/65">
                            {item.completed ? (
                              <ShieldCheck className="h-3 w-3 text-truffle-trouble shrink-0" />
                            ) : (
                              <span className="h-3 w-3 rounded border border-blue-fantastic/25 shrink-0" />
                            )}
                            <span className={item.completed ? "line-through text-blue-fantastic/40" : ""}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Delay Log, Certs & Supervisor */}
          <div className="space-y-6">
            {/* Assigned Supervisor */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-fantastic/5 pb-2">
                <User className="h-4 w-4 text-blue-fantastic" />
                Assigned Supervisor
              </h4>
              <div className="flex items-center gap-3 bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10">
                <div className="h-9 w-9 rounded-full bg-truffle-trouble/10 border border-truffle-trouble/20 flex items-center justify-center text-truffle-trouble font-bold text-sm uppercase">
                  {project.supervisorName ? project.supervisorName.slice(0, 2) : "UN"}
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-fantastic">
                    {project.supervisorName || "Unassigned"}
                  </p>
                  <p className="text-[10px] text-blue-fantastic/50 font-medium">
                    {project.supervisorName ? "Site Construction Supervisor" : "Please assign a supervisor"}
                  </p>
                </div>
              </div>
            </div>

            {/* Delay Log History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-fantastic/5 pb-2">
                <AlertTriangle className="h-4 w-4 text-truffle-trouble" />
                Site Delay History
              </h4>
              {!project.delays || project.delays.length === 0 ? (
                <p className="text-xs text-blue-fantastic/60 font-semibold italic pl-1">
                  No delay incidents logged for this project.
                </p>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {project.delays.map((del) => (
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

            {/* Required Certificates Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-widest flex items-center gap-1.5 border-b border-blue-fantastic/5 pb-2">
                <FileText className="h-4 w-4 text-blue-fantastic" />
                Required Certificates Checklist
              </h4>
              <div className="grid grid-cols-1 gap-2 pl-1">
                {[
                  { label: "Building Permit & Approved Drawings", done: true },
                  { label: "Engineering Foundation Sign-off", done: true },
                  { label: "Structural Framing Certificate", done: project.progress >= 45 },
                  { label: "Wet Area Waterproofing Certificate", done: project.progress >= 75 },
                  { label: "Electrical & Gas Safety Certificates", done: project.progress >= 90 },
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
            onClick={onClose}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold px-5 rounded-xl h-9"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
