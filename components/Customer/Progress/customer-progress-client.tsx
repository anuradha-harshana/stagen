"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Camera,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  ExternalLink,
  Search,
  ArrowLeft,
  X,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Project, Stage } from "@/lib/types/project";
import { User as UserType } from "@/lib/types/types";
import { ProjectActivity, ProjectPhoto } from "@/lib/tenant/projects";
import ProjectDetailsModal from "@/components/company/projects/project-details-modal";
import PageHeader from "@/components/shared/PageHeader";

interface CustomerProgressClientProps {
  initialProjects: Project[];
  activities: ProjectActivity[];
  photos: ProjectPhoto[];
  user: UserType;
  defaultProjectId?: string;
}

export default function CustomerProgressClient({
  initialProjects,
  activities,
  photos,
  user,
  defaultProjectId,
}: CustomerProgressClientProps) {
  const projects = initialProjects;
  const router = useRouter();
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") router.refresh(); };
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [router]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    defaultProjectId || initialProjects[0]?.id || ""
  );
  const [stageStatusFilter, setStageStatusFilter] = useState<"All" | "Completed" | "Active" | "Pending">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    Frame: true,
    Slab: true,
  });
  const [previewPhoto, setPreviewPhoto] = useState<ProjectPhoto | null>(null);

  // Active project
  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // Toggle stage expansion
  const toggleStageExpand = (stageName: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageName]: !prev[stageName],
    }));
  };

  // If no projects exist
  if (!currentProject) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto font-sans">
        <div className="text-center py-16 bg-white border border-dashed border-blue-fantastic/20 rounded-2xl">
          <Building2 className="h-10 w-10 text-blue-fantastic/30 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-blue-fantastic">No Construction Projects Found</h2>
          <p className="text-xs text-blue-fantastic/60 mt-1">
            Please contact your construction builder to link your lot.
          </p>
        </div>
      </div>
    );
  }

  // Calculate total checklists across project
  const allChecklistItems = currentProject.stages.flatMap((s) => s.checklist || []);
  const completedChecklistItems = allChecklistItems.filter((i) => i.completed);
  const checklistPercentage = allChecklistItems.length > 0
    ? Math.round((completedChecklistItems.length / allChecklistItems.length) * 100)
    : 0;

  // Filter stages based on search & status filter
  const filteredStages = currentProject.stages.filter((stage) => {
    const matchesStatus =
      stageStatusFilter === "All" || stage.status === stageStatusFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      stage.name.toLowerCase().includes(query) ||
      (stage.checklist &&
        stage.checklist.some((item) => item.label.toLowerCase().includes(query)));
    return matchesStatus && matchesSearch;
  });

  // Filter photos for current project
  const projectPhotos = photos.filter(
    (photo) =>
      photo.tenant_id === currentProject.id ||
      photo.tenant_id === `tenant-${currentProject.id}`
  );

  // Filter activities for current project
  const projectActivities = activities.filter(
    (act) =>
      act.tenant_id === currentProject.id ||
      act.tenant_id === `tenant-${currentProject.id}`
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header with Title & Project Switcher */}
      <PageHeader
        icon={<TrendingUp className="h-5 w-5 text-burning-flame" />}
        title="Construction Progress & Milestones"
        subtitle={`Track certified engineering sign-offs, stage progression, and inspection reports for Lot ${currentProject.id.toUpperCase()}.`}
        rightContent={
          <div className="flex items-center gap-3 flex-wrap">
            {/* If customer has multiple lots, allow switching */}
            {projects.length > 1 && (
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-48 bg-white border-blue-fantastic/20 text-blue-fantastic font-bold text-xs h-9 rounded-xl focus:ring-truffle-trouble">
                  <SelectValue placeholder="Select Lot" />
                </SelectTrigger>
                <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/15 font-sans">
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id} className="text-xs font-bold">
                      Lot {proj.id.toUpperCase()} - {proj.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={() => setIsDetailsModalOpen(true)}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold px-4 h-9 shadow-sm rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="h-4 w-4" />
              <span>View Full Project Details</span>
            </Button>
          </div>
        }
      />

      {/* 2. Top Metric Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Metric 1: Overall Progress */}
        <Card className="bg-white border border-blue-fantastic/5 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
              Overall Progress
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] font-bold px-2 py-0.2 border ${
                currentProject.status === "On Track"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
              }`}
            >
              {currentProject.status}
            </Badge>
          </div>
          <div className="my-2">
            <h3 className="text-3xl font-extrabold text-blue-fantastic">
              {currentProject.progress}%
            </h3>
          </div>
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-blue-fantastic/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-truffle-trouble to-burning-flame/75 transition-all duration-700"
                style={{ width: `${currentProject.progress}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-fantastic/50 font-medium pt-0.5">
              Current Active: <strong className="text-blue-fantastic">{currentProject.currentStage}</strong>
            </p>
          </div>
        </Card>

        {/* Metric 2: Active Stage */}
        <Card className="bg-white border border-blue-fantastic/5 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
              Active Stage
            </span>
            <div className="h-8 w-8 rounded-xl bg-burning-flame/15 flex items-center justify-center text-truffle-trouble">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <h3 className="text-2xl font-extrabold text-blue-fantastic">
              {currentProject.currentStage}
            </h3>
          </div>
          <p className="text-[11px] text-blue-fantastic/60 font-medium">
            Supervisor: <strong className="text-blue-fantastic">{currentProject.supervisorName || "Assigned"}</strong>
          </p>
        </Card>

        {/* Metric 3: Milestone Sign-offs */}
        <Card className="bg-white border border-blue-fantastic/5 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
              Checklist Sign-offs
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <h3 className="text-3xl font-extrabold text-blue-fantastic">
              {completedChecklistItems.length}
              <span className="text-lg font-semibold text-blue-fantastic/40"> / {allChecklistItems.length}</span>
            </h3>
          </div>
          <p className="text-[11px] text-blue-fantastic/60 font-medium">
            {checklistPercentage}% inspection items certified
          </p>
        </Card>

        {/* Metric 4: Estimated Handover */}
        <Card className="bg-white border border-blue-fantastic/5 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
              Est. Handover
            </span>
            <div className="h-8 w-8 rounded-xl bg-blue-fantastic/10 text-blue-fantastic flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <h3 className="text-xl font-extrabold text-blue-fantastic">
              {currentProject.estHandover}
            </h3>
          </div>
          <p className="text-[11px] text-blue-fantastic/60 font-medium">
            Started: {currentProject.startDate}
          </p>
        </Card>
      </div>

      {/* 3. Filters & Search for Stages */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full bg-white p-4 rounded-2xl border border-blue-fantastic/5 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-fantastic/40 pointer-events-none" />
          <Input
            placeholder="Search stage or checklist task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-xs font-sans w-full focus-visible:ring-truffle-trouble"
          />
        </div>

        <div className="flex items-center gap-1 bg-blue-fantastic/5 p-0.5 rounded-xl border border-blue-fantastic/10">
          {(["All", "Completed", "Active", "Pending"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStageStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                stageStatusFilter === status
                  ? "bg-blue-fantastic text-palladian shadow-sm"
                  : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
              }`}
            >
              {status} Stages
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Content: Left Column (Stage Cards & Checklists) | Right Column (Activities & Photos) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Stages List & Checklists */}
        <div className="lg:col-span-8 space-y-4">
          {filteredStages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white border border-dashed border-blue-fantastic/20 rounded-2xl">
              <Building2 className="h-8 w-8 text-blue-fantastic/30 mb-2" />
              <p className="text-xs font-bold text-blue-fantastic">No stages match your filter</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStageStatusFilter("All");
                  setSearchTerm("");
                }}
                className="mt-2 text-xs text-truffle-trouble font-bold"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            filteredStages.map((stage, idx) => {
              const isExpanded = expandedStages[stage.name] ?? (stage.status === "Active" || stage.status === "Completed");
              const isCompleted = stage.status === "Completed";
              const isActive = stage.status === "Active";
              const isPending = stage.status === "Pending";

              // Check if photos exist for this stage
              const stagePhotos = projectPhotos.filter(
                (p) => p.stage_name.toLowerCase() === stage.name.toLowerCase()
              );

              return (
                <Card
                  key={stage.name}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-sm ${
                    isActive
                      ? "border-burning-flame/40 ring-1 ring-burning-flame/20"
                      : "border-blue-fantastic/10 hover:border-blue-fantastic/20"
                  }`}
                >
                  {/* Stage Card Header */}
                  <div
                    onClick={() => toggleStageExpand(stage.name)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none bg-blue-fantastic/[0.01] hover:bg-blue-fantastic/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                      {/* Step Number Badge */}
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isActive
                            ? "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                            : "bg-blue-fantastic/5 text-blue-fantastic/40 border-blue-fantastic/10"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <span>0{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-blue-fantastic font-sans">
                            {stage.name} Stage
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0 border ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isActive
                                ? "bg-burning-flame/20 text-truffle-trouble border-burning-flame/30 animate-pulse"
                                : "bg-blue-fantastic/5 text-blue-fantastic/40 border-blue-fantastic/15"
                            }`}
                          >
                            {stage.status}
                          </Badge>
                        </div>

                        {/* Progress Bar under title */}
                        <div className="flex items-center gap-2 mt-1.5 max-w-xs">
                          <div className="h-1.5 flex-1 rounded-full bg-blue-fantastic/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted
                                  ? "bg-emerald-600"
                                  : "bg-gradient-to-r from-truffle-trouble to-burning-flame/80"
                              }`}
                              style={{ width: `${stage.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-blue-fantastic/60">
                            {stage.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-blue-fantastic/50 font-medium hidden sm:inline">
                        {stage.checklist?.filter((c) => c.completed).length || 0} /{" "}
                        {stage.checklist?.length || 0} completed
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-blue-fantastic/40" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-blue-fantastic/40" />
                      )}
                    </div>
                  </div>

                  {/* Stage Card Body (Expanded) */}
                  {isExpanded && (
                    <div className="p-5 border-t border-blue-fantastic/5 bg-white space-y-4">
                      {/* Checklists Section */}
                      <div>
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 mb-2.5 flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-truffle-trouble" />
                          <span>Inspection & Building Tasks</span>
                        </h5>

                        {(!stage.checklist || stage.checklist.length === 0) ? (
                          <p className="text-xs text-blue-fantastic/45 italic py-1 pl-1">
                            Checklist schedule will be populated once this stage commences.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {stage.checklist.map((item) => (
                              <div
                                key={item.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                                  item.completed
                                    ? "bg-emerald-50/40 border-emerald-100 text-blue-fantastic"
                                    : "bg-surface-inset border-blue-fantastic/5 text-blue-fantastic/70"
                                }`}
                              >
                                {item.completed ? (
                                  <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="h-3 w-3" />
                                  </div>
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-blue-fantastic/30 shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <span className={item.completed ? "font-semibold" : ""}>
                                    {item.label}
                                  </span>
                                  {item.completed && (
                                    <p className="text-[10px] text-emerald-700/80 mt-0.5 font-medium">
                                      Certified & signed off by site supervisor
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Stage Photos Section (if any uploaded) */}
                      {stagePhotos.length > 0 && (
                        <div className="pt-2 border-t border-blue-fantastic/5">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 mb-2 flex items-center gap-1.5">
                            <Camera className="h-3.5 w-3.5 text-blue-fantastic" />
                            <span>Stage Verification Photos</span>
                          </h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {stagePhotos.map((photo) => (
                              <div
                                key={photo.id}
                                onClick={() => setPreviewPhoto(photo)}
                                className="group relative rounded-xl overflow-hidden border border-blue-fantastic/15 bg-blue-fantastic/5 aspect-video cursor-pointer hover:border-truffle-trouble/50 transition-all shadow-xs"
                              >
                                <Image
                                  src={photo.url}
                                  alt={photo.label}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                                  <p className="text-[11px] text-white font-bold truncate">
                                    {photo.label}
                                  </p>
                                  <p className="text-[9px] text-white/70">{photo.timestamp}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Right Column (4 cols): Project Overview, Activities & Delays */}
        <div className="lg:col-span-4 space-y-6">
          {/* Lot Summary Card */}
          <Card className="bg-white border border-blue-fantastic/10 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-blue-fantastic/5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-truffle-trouble/10 flex items-center justify-center text-truffle-trouble">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-blue-fantastic">
                    Lot {currentProject.id.toUpperCase()} Summary
                  </CardTitle>
                  <p className="text-[11px] text-blue-fantastic/60 font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-blue-fantastic/40 shrink-0" />
                    <span className="truncate">{currentProject.address}</span>
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-blue-fantastic/5">
                <span className="text-blue-fantastic/50 font-medium">Client</span>
                <span className="font-bold text-blue-fantastic">{currentProject.clientName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-blue-fantastic/5">
                <span className="text-blue-fantastic/50 font-medium">Site Supervisor</span>
                <span className="font-bold text-blue-fantastic">{currentProject.supervisorName || "Assigned"}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-blue-fantastic/5">
                <span className="text-blue-fantastic/50 font-medium">Start Date</span>
                <span className="font-bold text-blue-fantastic">{currentProject.startDate}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-blue-fantastic/5">
                <span className="text-blue-fantastic/50 font-medium">Est. Handover</span>
                <span className="font-bold text-blue-fantastic">{currentProject.estHandover}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-blue-fantastic/50 font-medium">Delay Logs</span>
                <span className="font-bold text-truffle-trouble">
                  {currentProject.delays?.length || 0} incidents
                </span>
              </div>

              <Button
                onClick={() => setIsDetailsModalOpen(true)}
                variant="outline"
                className="w-full mt-2 border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-semibold h-9 rounded-xl cursor-pointer"
              >
                <span>View Full Milestone & Delay Log</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Timeline Activities */}
          <Card className="bg-white border border-blue-fantastic/10 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-blue-fantastic/5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-burning-flame/10 flex items-center justify-center text-burning-flame">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-sm font-bold text-blue-fantastic">
                  Recent Milestone Updates
                </CardTitle>
              </div>
              <Link
                href="/customer/timeline"
                className="text-[11px] font-bold text-truffle-trouble hover:text-truffle-trouble/80"
              >
                Full timeline
              </Link>
            </CardHeader>

            <CardContent className="p-5 space-y-3">
              {projectActivities.length === 0 ? (
                <p className="text-xs text-blue-fantastic/50 italic py-2">No activity records logged.</p>
              ) : (
                projectActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="p-2.5 rounded-xl bg-blue-fantastic/[0.02] border border-blue-fantastic/5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-fantastic truncate">
                        {activity.title}
                      </span>
                      <Badge className="text-[9px] bg-blue-fantastic/5 text-blue-fantastic/60 border-none font-semibold">
                        {activity.stage_name}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-blue-fantastic/65 leading-tight">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-blue-fantastic/40 font-medium pt-1">
                      {activity.date}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Help Link */}
          <div className="p-4 rounded-2xl bg-truffle-trouble/5 border border-truffle-trouble/20 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-truffle-trouble" />
              <h5 className="text-xs font-bold text-blue-fantastic">
                Have questions about your progress?
              </h5>
            </div>
            <p className="text-xs text-blue-fantastic/70">
              Message your site supervisor directly or request an on-site walkthrough.
            </p>
            <Button
              asChild
              className="w-full bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-8 rounded-xl mt-1"
            >
              <Link href="/customer/ask">Message Site Supervisor</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Reusable Project Details Modal */}
      <ProjectDetailsModal
        project={currentProject}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* 6. Photo Preview Modal */}
      <Dialog open={previewPhoto !== null} onOpenChange={(open) => !open && setPreviewPhoto(null)}>
        <DialogContent className="max-w-2xl bg-white p-4 font-sans rounded-2xl border border-blue-fantastic/20">
          {previewPhoto && (
            <div className="space-y-3">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/10">
                <Image
                  src={previewPhoto.url}
                  alt={previewPhoto.label}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex justify-between items-start gap-4 pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-truffle-trouble/10 text-truffle-trouble border-none font-bold">
                      {previewPhoto.stage_name}
                    </Badge>
                    <span className="text-xs text-blue-fantastic/50 font-medium">
                      {previewPhoto.timestamp}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-blue-fantastic mt-1">
                    {previewPhoto.label}
                  </h4>
                  {previewPhoto.caption && (
                    <p className="text-xs text-blue-fantastic/70 mt-0.5">
                      {previewPhoto.caption}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewPhoto(null)}
                  className="text-xs font-semibold rounded-xl h-8"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
