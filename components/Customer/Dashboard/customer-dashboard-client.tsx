"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  Clock,
  ArrowRight,
  Camera,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Building2,
  HardHat,
  MessageSquareQuote,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types/project";
import { User } from "@/lib/types/types";
import { ProjectActivity, ProjectPhoto } from "@/lib/tenant/projects";
import DashboardHeader from "./DashboardHeader";
import StageTracker from "./StageTracker";
import ProjectCard from "@/components/company/projects/project-card";
import ProjectDetailsModal from "@/components/company/projects/project-details-modal";
import ProjectsFilters from "@/components/company/projects/projects-filters";

interface CustomerDashboardClientProps {
  initialProjects: Project[];
  activities: ProjectActivity[];
  photos: ProjectPhoto[];
  user: User;
}

export default function CustomerDashboardClient({
  initialProjects,
  activities,
  photos,
  user,
}: CustomerDashboardClientProps) {
  const router = useRouter();
  const [projects] = useState<Project[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjects[0]?.id || ""
  );
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "On Track" | "Delayed" | "Action Required">("All");
  const [stageFilter, setStageFilter] = useState("All");

  // Selected project for detailed timeline & stats
  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // Filter projects for the card grid
  const filteredProjects = projects.filter((project) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      project.clientName.toLowerCase().includes(query) ||
      project.address.toLowerCase().includes(query) ||
      project.id.toLowerCase().includes(query) ||
      (project.supervisorName && project.supervisorName.toLowerCase().includes(query));
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    const matchesStage = stageFilter === "All" || project.currentStage === stageFilter;
    return matchesSearch && matchesStatus && matchesStage;
  });

  // Unique list of stages across all customer projects for filter dropdown
  const allStages = Array.from(
    new Set(projects.flatMap((p) => p.stages.map((s) => s.name)))
  );

  // Convert project stages to StageTracker format for visual progress bar
  const trackerStages = activeProject
    ? activeProject.stages.map((stage) => {
        let status: "completed" | "in-progress" | "upcoming" = "upcoming";
        if (stage.status === "Completed") status = "completed";
        else if (stage.status === "Active") status = "in-progress";

        return {
          id: stage.name.toLowerCase().replace(/\s+/g, "-"),
          name: stage.name,
          label: stage.status,
          status,
        };
      })
    : [];

  // Project delay logs
  const delayCount = activeProject?.delays?.length || 0;

  // Calculate days remaining roughly or from date
  const estHandover = activeProject?.estHandover || "TBD";
  const startDate = activeProject?.startDate || "TBD";

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header Greeting Section */}
      <DashboardHeader
        username={user.username || activeProject?.clientName || "Customer"}
        email={user.email || ""}
        role={user.role}
        percentage={activeProject?.progress || 0}
      />

      {/* 2. Top Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Stat 1: Overall Build Progress */}
        <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
                  Construction Progress
                </span>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
                    {activeProject?.progress ?? 0}%
                  </h2>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold px-2 py-0.5 border ${
                      activeProject?.status === "On Track"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : activeProject?.status === "Delayed"
                        ? "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {activeProject?.status || "On Track"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-truffle-trouble/10 text-truffle-trouble group-hover:rotate-6 transition-all duration-300">
                <Building2 className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-blue-fantastic/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-truffle-trouble to-burning-flame/80 transition-all duration-700"
                  style={{ width: `${activeProject?.progress ?? 0}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-blue-fantastic/65 pt-1">
                <span>Active: <strong className="text-blue-fantastic font-bold">{activeProject?.currentStage || "Foundation"}</strong></span>
                <span>Lot {activeProject?.id.toUpperCase()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat 2: Active Stage & Next Milestone */}
        <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
                  Active Construction Stage
                </span>
                <h2 className="text-2xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
                  {activeProject?.currentStage || "Site Cut"}
                </h2>
                <p className="text-xs text-blue-fantastic/55 font-medium">
                  {delayCount > 0 ? `${delayCount} logged weather/inspection delays` : "All stage checklists proceeding on schedule"}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-burning-flame/15 text-burning-flame group-hover:rotate-6 transition-all duration-300">
                <HardHat className="h-6 w-6 text-truffle-trouble" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-fantastic/5">
              <span className="text-blue-fantastic/60 font-medium">Site Supervisor:</span>
              <span className="font-bold text-blue-fantastic">
                {activeProject?.supervisorName || "Assigned Site Manager"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: Handover & Timeline */}
        <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
                  Projected Handover
                </span>
                <h2 className="text-2xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
                  {estHandover}
                </h2>
                <p className="text-xs text-blue-fantastic/55 font-medium">
                  Site construction initiated on {startDate}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:rotate-6 transition-all duration-300">
                <Calendar className="h-6 w-6" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-fantastic/5">
              <span className="text-blue-fantastic/60 font-medium">Delay extension:</span>
              <span className="font-bold text-truffle-trouble">
                {activeProject?.delayDays ? `${activeProject.delayDays} days total` : "None (On Schedule)"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Horizontal Visual Stage Tracker */}
      {trackerStages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-fantastic/60">
              Current Build Timeline & Milestones
            </h3>
            <Link
              href={`/customer/progress${activeProject ? `?projectId=${activeProject.id}` : ""}`}
              className="text-xs font-bold text-truffle-trouble hover:text-truffle-trouble/80 flex items-center gap-1 transition-colors"
            >
              <span>View full progress breakdown</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <StageTracker stages={trackerStages} />
        </div>
      )}

      {/* 4. Filter & Search Bar for Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-blue-fantastic font-sans">
              Your Construction Lot{projects.length > 1 ? "s" : ""}
            </h3>
            <p className="text-xs text-blue-fantastic/60 font-medium">
              Review property specifications, inspection sign-offs, and track individual build stages.
            </p>
          </div>
          {projects.length > 1 && (
            <span className="text-xs font-bold text-blue-fantastic/70 bg-blue-fantastic/5 px-2.5 py-1 rounded-lg border border-blue-fantastic/10">
              {filteredProjects.length} of {projects.length} Lots
            </span>
          )}
        </div>

        <ProjectsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          stages={allStages}
        />

        {/* 5. Project Cards Grid (Reusing ProjectCard) */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white border border-dashed border-blue-fantastic/20 rounded-2xl">
            <Building2 className="h-10 w-10 text-blue-fantastic/30 mb-2" />
            <p className="text-sm font-bold text-blue-fantastic">No Projects Matching Filter</p>
            <p className="text-xs text-blue-fantastic/60 mt-1">Adjust search keyword or reset status filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`cursor-pointer transition-transform ${
                  selectedProjectId === project.id ? "ring-2 ring-truffle-trouble rounded-2xl" : ""
                }`}
              >
                <ProjectCard
                  project={project}
                  onViewDetails={setSelectedProjectForModal}
                  onTrackProgress={(p) => router.push(`/customer/progress?projectId=${p.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Bottom Section: Left (Recent Activities & Delays) | Right (Site Photos & Supervisor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        {/* Left Column (7 cols): Recent Site Activities & Delays */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {/* Recent Site Activities Card */}
          <Card className="bg-white border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-blue-fantastic/[0.03] pb-4 pt-5 px-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-burning-flame/10 flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 text-burning-flame" />
                </div>
                <div>
                  <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
                    Recent Site Activities
                  </CardTitle>
                  <p className="text-[11px] text-blue-fantastic/50 font-medium">
                    Verified milestone checklists and supervisor field updates
                  </p>
                </div>
              </div>
              <Link
                href="/customer/timeline"
                className="text-xs font-bold text-truffle-trouble hover:text-truffle-trouble/80 flex items-center gap-1 transition-colors group"
              >
                <span>View timeline</span>
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </CardHeader>

            <CardContent className="p-6 space-y-3.5">
              {activities.length === 0 ? (
                <p className="text-xs text-blue-fantastic/50 italic py-4">No recent site activities logged yet.</p>
              ) : (
                activities.slice(0, 4).map((activity) => (
                  <div
                    key={activity.id}
                    className="p-3.5 rounded-xl bg-blue-fantastic/[0.02] border border-blue-fantastic/10 hover:border-blue-fantastic/20 transition-all flex items-start gap-3"
                  >
                    <div className="h-8 w-8 rounded-lg bg-truffle-trouble/10 border border-truffle-trouble/20 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="h-4 w-4 text-truffle-trouble" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-xs font-bold text-blue-fantastic truncate">
                          {activity.title}
                        </p>
                        <Badge className="text-[10px] bg-blue-fantastic/5 text-blue-fantastic/70 border-blue-fantastic/15 font-semibold">
                          {activity.stage_name}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-blue-fantastic/65 mt-1 leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-blue-fantastic/45 font-medium">
                        <Clock className="h-3 w-3" />
                        <span>{activity.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Active Site Delays History Card */}
          {activeProject?.delays && activeProject.delays.length > 0 && (
            <Card className="bg-white border border-burning-flame/20 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-burning-flame/10 pb-3 pt-4 px-6 flex flex-row items-center justify-between bg-burning-flame/5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-truffle-trouble" />
                  <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">
                    Delay Notices & Site Weather Advisories
                  </CardTitle>
                </div>
                <Badge className="bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 text-[10px] font-bold">
                  {activeProject.delays.length} active logs
                </Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {activeProject.delays.map((delay) => (
                  <div
                    key={delay.id}
                    className="p-3 rounded-xl bg-burning-flame/5 border border-burning-flame/15 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-truffle-trouble">{delay.type} Delay</span>
                        <span className="text-[10px] text-blue-fantastic/50 font-medium">({delay.date})</span>
                      </div>
                      <p className="text-xs text-blue-fantastic/75 mt-0.5">{delay.description}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px] font-bold text-truffle-trouble border-truffle-trouble/30">
                      +{delay.durationDays} Days
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (5 cols): Site Photos & Supervisor Contact */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Site Progress Photos Card */}
          <Card className="bg-white border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-blue-fantastic/[0.03] pb-4 pt-5 px-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-fantastic/10 flex items-center justify-center">
                  <Camera className="h-4 w-4 text-blue-fantastic" />
                </div>
                <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
                  Site Progress Photos
                </CardTitle>
              </div>
              <Link
                href={`/customer/progress${activeProject ? `?projectId=${activeProject.id}` : ""}`}
                className="text-xs font-bold text-truffle-trouble hover:text-truffle-trouble/80 flex items-center gap-1 transition-colors"
              >
                <span>All photos</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {photos.length === 0 ? (
                <p className="text-xs text-blue-fantastic/50 italic py-4">No photos uploaded for this stage yet.</p>
              ) : (
                <div className="space-y-3">
                  {photos.slice(0, 3).map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-xl overflow-hidden border border-blue-fantastic/10 bg-surface-inset flex items-center gap-3 p-2 hover:border-truffle-trouble/30 transition-all cursor-pointer"
                      onClick={() => router.push(`/customer/progress${activeProject ? `?projectId=${activeProject.id}` : ""}`)}
                    >
                      <div className="relative h-16 w-20 rounded-lg overflow-hidden shrink-0 bg-blue-fantastic/10">
                        <Image
                          src={photo.url}
                          alt={photo.label}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <Badge className="text-[9px] bg-truffle-trouble/10 text-truffle-trouble border-none px-1.5 py-0 font-bold">
                            {photo.stage_name}
                          </Badge>
                          <span className="text-[10px] text-blue-fantastic/40 font-medium">
                            {photo.timestamp}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-blue-fantastic truncate mt-1">
                          {photo.label}
                        </p>
                        {photo.caption && (
                          <p className="text-[10px] text-blue-fantastic/60 truncate mt-0.5">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Site Supervisor Card */}
          <Card className="bg-white border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-truffle-trouble/10 border border-truffle-trouble/20 flex items-center justify-center text-truffle-trouble font-bold text-base">
                  {activeProject?.supervisorName ? activeProject.supervisorName.slice(0, 2).toUpperCase() : "SP"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-blue-fantastic/50 font-bold uppercase tracking-wider">
                    Site Supervisor
                  </p>
                  <p className="text-sm font-extrabold text-blue-fantastic truncate">
                    {activeProject?.supervisorName || "Unassigned"}
                  </p>
                  <p className="text-[11px] text-blue-fantastic/60 font-medium">
                    Licensed Construction Project Supervisor
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-fantastic/5 flex gap-2">
                <Button
                  onClick={() => router.push("/customer/ask")}
                  className="w-full bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold h-9 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquareQuote className="h-4 w-4" />
                  <span>Ask a Question</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/customer/documents")}
                  className="w-full border-blue-fantastic/15 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-semibold h-9 rounded-xl cursor-pointer"
                >
                  <span>Documents</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 7. Reused ProjectDetailsModal */}
      <ProjectDetailsModal
        project={selectedProjectForModal}
        isOpen={selectedProjectForModal !== null}
        onClose={() => setSelectedProjectForModal(null)}
      />
    </div>
  );
}
