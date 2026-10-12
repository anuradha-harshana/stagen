"use client";

import React from "react";
import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  User,
  Edit2,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types/project";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onViewDetails,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const activeStage = project.stages.find((s) => s.status === "Active")?.name || project.currentStage;
  const delayCount = project.delays?.length || 0;

  return (
    <Card className="group relative overflow-hidden bg-white border border-blue-fantastic/15 shadow-sm hover:shadow-md hover:border-blue-fantastic/30 transition-all duration-200 flex flex-col justify-between h-full font-sans">
      {/* Top accent strip */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-burning-flame/50 via-truffle-trouble/50 to-transparent" />

      <div>
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">
                  {project.clientName}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`text-[10px] border font-bold px-2 py-0.2 ${
                    project.status === "On Track"
                      ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                      : project.status === "Delayed"
                      ? "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                      : "bg-red-100 text-red-700 border-red-200" // Action Required
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
          {/* Lot ID & Supervisor Row */}
          <div className="flex justify-between items-center text-xs pb-1.5 border-b border-blue-fantastic/5">
            <span className="text-[11px] text-blue-fantastic/65 font-bold uppercase tracking-wider">
              LOT: <strong className="text-blue-fantastic">{project.id.toUpperCase()}</strong>
            </span>
            <div className="flex items-center gap-1.5 bg-blue-fantastic/5 px-2 py-1 rounded-lg border border-blue-fantastic/10">
              <User className="h-3 w-3 text-blue-fantastic/50" />
              <span className="text-[10px] font-bold text-blue-fantastic/80">
                {project.supervisorName || "Unassigned"}
              </span>
            </div>
          </div>

          {/* Current stage indicator */}
          <div className="bg-blue-fantastic/4 p-2.5 rounded-xl border border-blue-fantastic/5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-blue-fantastic/60 font-bold uppercase tracking-wider">
                Active Stage
              </span>
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
        </CardContent>
      </div>

      <div className="px-6 pb-6 pt-2 border-t border-blue-fantastic/5 flex items-center justify-between mt-3 bg-blue-fantastic/[0.01]">
        {/* Delay feedback */}
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

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(project)}
            className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold h-8 rounded-xl flex items-center gap-1"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => onDelete(project)}
            className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 rounded-xl"
            title="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            onClick={() => onViewDetails(project)}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold h-8 rounded-xl flex items-center gap-1.5"
          >
            <span>Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
