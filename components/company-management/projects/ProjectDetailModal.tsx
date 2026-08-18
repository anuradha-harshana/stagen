"use client";

import React from "react";
import { Project } from "@/lib/db-mock/projectsData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle, User, MapPin, Calendar, Building2 } from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white border border-blue-fantastic/15 rounded-3xl p-6 font-sans max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-fantastic/10 text-blue-fantastic font-bold">
              {project.id}
            </Badge>
            {project.region && (
              <Badge className="bg-white text-blue-fantastic font-bold border-none">
                {project.region}
              </Badge>
            )}
            <Badge
              className={`font-bold text-xs ${
                project.status === "Delayed"
                  ? "bg-red-100 text-red-700"
                  : project.status === "Action Required"
                  ? "bg-amber-100 text-amber-700"
                  : project.status === "Completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {project.status}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-blue-fantastic font-sans">
            {project.clientName}
          </DialogTitle>
          <DialogDescription className="text-xs text-blue-fantastic/60 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {project.address}
          </DialogDescription>
        </DialogHeader>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-inset rounded-2xl border border-blue-fantastic/15 text-xs">
          <div>
            <span className="text-blue-fantastic/50 font-bold block uppercase text-[10px]">Supervisor</span>
            <span className="font-extrabold text-blue-fantastic">{project.supervisorName || "Unassigned"}</span>
          </div>
          <div>
            <span className="text-blue-fantastic/50 font-bold block uppercase text-[10px]">Current Stage</span>
            <span className="font-extrabold text-blue-fantastic">{project.currentStage}</span>
          </div>
          <div>
            <span className="text-blue-fantastic/50 font-bold block uppercase text-[10px]">Progress</span>
            <span className="font-extrabold text-blue-fantastic">{project.progress}%</span>
          </div>
          <div>
            <span className="text-blue-fantastic/50 font-bold block uppercase text-[10px]">Est. Handover</span>
            <span className="font-extrabold text-blue-fantastic">{project.estHandover}</span>
          </div>
        </div>

        {/* Stage Progression Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-fantastic/70">
            Construction Stage Progression
          </h4>
          <div className="space-y-2">
            {project.stages.map((stage) => (
              <div
                key={stage.name}
                className="p-3 rounded-xl border border-blue-fantastic/15 bg-white flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {stage.status === "Completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : stage.status === "Active" ? (
                    <Clock className="h-4 w-4 text-truffle-trouble animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-oatmeal shrink-0" />
                  )}
                  <span className={`font-bold ${stage.status === "Active" ? "text-truffle-trouble" : "text-blue-fantastic"}`}>
                    {stage.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      stage.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : stage.status === "Active"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    {stage.status}
                  </Badge>
                  <span className="font-bold text-blue-fantastic/70 w-9 text-right">
                    {stage.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delay Incident History if any */}
        {project.delays && project.delays.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-blue-fantastic/15">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Recorded Delay Incidents ({project.delays.length})
            </h4>
            <div className="space-y-2">
              {project.delays.map((d) => (
                <div key={d.id} className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-red-900">
                    <span>{d.type} Delay</span>
                    <span>+{d.durationDays} Days</span>
                  </div>
                  <p className="text-[11px] text-red-800 font-medium">{d.description}</p>
                  <span className="text-[10px] text-red-600 font-bold block">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4 pt-3 border-t border-blue-fantastic/15 flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
