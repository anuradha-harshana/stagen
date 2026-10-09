"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Search,
  LayoutGrid,
  List,
  Building2,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldAlert,
  CloudRain,
  Wrench,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import { Project } from "@/lib/types/project";
import ProjectDetailsModal from "@/components/company/projects/project-details-modal";
import { MitigationModal } from "./MitigationModal";

interface AtRiskClientProps {
  initialProjects: Project[];
  allProjectsCount?: number;
}

export default function AtRiskClient({
  initialProjects,
  allProjectsCount = initialProjects.length,
}: AtRiskClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [selectedDetailsProject, setSelectedDetailsProject] = useState<Project | null>(null);
  const [selectedMitigationProject, setSelectedMitigationProject] = useState<Project | null>(null);

  // Filter logic
  const filteredProjects = projects.filter((p) => {
    const query = searchTerm.toLowerCase();
    const delayDescriptions = (p.delays || []).map((d) => d.description.toLowerCase()).join(" ");
    const delayTypes = (p.delays || []).map((d) => d.type.toLowerCase()).join(" ");

    const matchesSearch =
      p.clientName.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      (p.supervisorName && p.supervisorName.toLowerCase().includes(query)) ||
      delayDescriptions.includes(query) ||
      delayTypes.includes(query);

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesStage = stageFilter === "all" || p.currentStage === stageFilter;
    const matchesType =
      typeFilter === "all" ||
      (p.delays && p.delays.some((d) => d.type.toLowerCase() === typeFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesStage && matchesType;
  });

  // KPI calculations
  const totalAtRisk = projects.length;
  const criticalCount = projects.filter((p) => (p.delayDays || 0) >= 5).length;
  const weatherCount = projects.filter(
    (p) => p.delays && p.delays.some((d) => d.type === "Weather")
  ).length;
  const materialsAndTradeCount = projects.filter(
    (p) =>
      p.delays &&
      p.delays.some(
        (d) =>
          d.type === "Materials" ||
          d.type === "Trade Availability" ||
          d.type === "Inspections"
      )
  ).length;

  return (
    <div className={PAGE_SHELL_CLASS}>
      <PageHeader
        icon={<AlertTriangle className="h-5 w-5 text-burning-flame" />}
        title="At-Risk & Delayed Projects"
        subtitle="Priority monitoring, schedule variance alerts, and management mitigation workflow"
        rightContent={
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/company-management/projects">
              <Button
                variant="outline"
                className="bg-white border-blue-fantastic/15 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-bold h-9 px-3.5 rounded-xl shadow-xs"
              >
                <FolderKanban className="h-3.5 w-3.5 mr-1.5 text-truffle-trouble" />
                All Projects ({allProjectsCount})
              </Button>
            </Link>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-blue-fantastic/15 shadow-xs">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className={`h-7 px-2.5 rounded-lg text-xs font-bold cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-blue-fantastic text-palladian"
                    : "text-blue-fantastic/70 hover:bg-surface-muted"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5 mr-1" />
                Grid
              </Button>
              <Button
                size="sm"
                variant={viewMode === "table" ? "default" : "ghost"}
                onClick={() => setViewMode("table")}
                className={`h-7 px-2.5 rounded-lg text-xs font-bold cursor-pointer ${
                  viewMode === "table"
                    ? "bg-blue-fantastic text-palladian"
                    : "text-blue-fantastic/70 hover:bg-surface-muted"
                }`}
              >
                <List className="h-3.5 w-3.5 mr-1" />
                Table
              </Button>
            </div>
          </div>
        }
      />

      {/* Metric Stats Banner (Matching /company/projects & /company-management/dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Total At-Risk */}
        <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-truffle-trouble font-sans">
                Flagged Sites
              </span>
              <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors">
                {totalAtRisk}
              </h2>
              <p className="text-xs text-blue-fantastic/50 font-medium">
                Active build delays logged
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-burning-flame/15 text-truffle-trouble group-hover:rotate-6 transition-all duration-300">
              <AlertTriangle className="h-6 w-6 text-truffle-trouble" />
            </div>
          </CardContent>
        </Card>

        {/* Critical Delays (>= 5 Days) */}
        <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-truffle-trouble font-sans">
                Critical (≥ 5 Days)
              </span>
              <h2 className="text-3xl font-extrabold text-truffle-trouble font-sans tracking-tight transition-colors">
                {criticalCount}
              </h2>
              <p className="text-xs text-blue-fantastic/50 font-medium">
                Immediate intervention needed
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 text-red-600 group-hover:rotate-6 transition-all duration-300">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Weather Delays */}
        <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
                Weather Holds
              </span>
              <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors">
                {weatherCount}
              </h2>
              <p className="text-xs text-blue-fantastic/50 font-medium">
                Severe storm & site conditions
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-fantastic/10 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
              <CloudRain className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Material & Trade Holds */}
        <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
                Trade & Materials
              </span>
              <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors">
                {materialsAndTradeCount}
              </h2>
              <p className="text-xs text-blue-fantastic/50 font-medium">
                Supply chain & certifier holds
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-oatmeal/20 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
              <Wrench className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-blue-fantastic/15 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-fantastic/40" />
          <Input
            placeholder="Search by lot ID, client, address, supervisor, or delay cause..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-surface-inset border-blue-fantastic/15 rounded-xl text-xs text-blue-fantastic placeholder:text-blue-fantastic/40 font-medium h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-surface-inset border-blue-fantastic/15 rounded-xl text-xs font-bold text-blue-fantastic h-9">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
              <SelectItem value="Action Required">Action Required</SelectItem>
            </SelectContent>
          </Select>

          {/* Delay Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-surface-inset border-blue-fantastic/15 rounded-xl text-xs font-bold text-blue-fantastic h-9">
              <SelectValue placeholder="Delay Type: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Delay Type: All</SelectItem>
              <SelectItem value="Weather">Weather</SelectItem>
              <SelectItem value="Materials">Materials</SelectItem>
              <SelectItem value="Inspections">Inspections</SelectItem>
              <SelectItem value="Trade Availability">Trade Availability</SelectItem>
            </SelectContent>
          </Select>

          {/* Stage Filter */}
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-36 bg-surface-inset border-blue-fantastic/15 rounded-xl text-xs font-bold text-blue-fantastic h-9">
              <SelectValue placeholder="Stage: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Stage: All</SelectItem>
              <SelectItem value="Site Cut">Site Cut</SelectItem>
              <SelectItem value="Slab">Slab</SelectItem>
              <SelectItem value="Frame">Frame</SelectItem>
              <SelectItem value="Lockup">Lockup</SelectItem>
              <SelectItem value="Fixing">Fixing</SelectItem>
              <SelectItem value="Completion">Completion</SelectItem>
              <SelectItem value="Handover">Handover</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content: Grid or Table View */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface-inset border border-dashed border-blue-fantastic/20 rounded-2xl text-center">
          <Building2 className="h-10 w-10 text-blue-fantastic/30 mb-2" />
          <p className="text-sm font-bold text-blue-fantastic">No At-Risk Projects Found</p>
          <p className="text-xs text-blue-fantastic/60 mt-1">
            No projects match the selected filters or search terms.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid of At-Risk Project Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const topDelay = project.delays?.[0];
            const delayDays = project.delayDays || topDelay?.durationDays || 4;
            const isCritical = delayDays >= 5;

            return (
              <Card
                key={project.id}
                className="group relative overflow-hidden bg-white border border-blue-fantastic/15 shadow-sm hover:shadow-md hover:border-blue-fantastic/30 transition-all duration-200 flex flex-col justify-between h-full font-sans rounded-2xl"
              >
                {/* Top accent strip */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isCritical
                      ? "bg-gradient-to-r from-red-500 via-truffle-trouble to-burning-flame"
                      : "bg-gradient-to-r from-burning-flame to-truffle-trouble"
                  }`}
                />

                <div>
                  <CardHeader className="pb-2 pt-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-truffle-trouble" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">
                            {project.clientName}
                          </CardTitle>
                          <Badge
                            className={`text-[10px] border-none font-bold px-2 py-0.5 rounded-full ${
                              project.status === "Delayed"
                                ? "bg-burning-flame/15 text-truffle-trouble"
                                : "bg-burning-flame/20 text-blue-fantastic"
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

                    {/* Delay Impact & Reason Box */}
                    <div className="p-3 rounded-xl bg-burning-flame/10 border border-burning-flame/20 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-truffle-trouble flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {delayDays} Days Delay Impact
                        </span>
                        {topDelay?.type && (
                          <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-blue-fantastic border border-burning-flame/20">
                            {topDelay.type}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-fantastic/80 font-medium">
                        {topDelay?.description || "Schedule hold requiring supervisor inspection sign-off."}
                      </p>
                    </div>

                    {/* Stage & Progress Indicator */}
                    <div className="bg-blue-fantastic/4 p-2.5 rounded-xl border border-blue-fantastic/5">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-blue-fantastic/60 font-bold uppercase tracking-wider">
                          Active Stage
                        </span>
                        <span className="text-xs text-blue-fantastic font-bold">
                          {project.currentStage}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                          <span className="text-blue-fantastic/60">Construction Progress</span>
                          <span className="text-truffle-trouble font-bold">{project.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-blue-fantastic/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-truffle-trouble to-burning-flame/70 transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
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
                        <span>Target: <strong>{project.estHandover}</strong></span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-2 border-t border-blue-fantastic/5 flex items-center justify-between mt-2 bg-blue-fantastic/[0.01]">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMitigationProject(project)}
                    className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold h-8 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Log Action</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => setSelectedDetailsProject(project)}
                    className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold h-8 rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View of At-Risk Projects */
        <Card className="bg-white border border-blue-fantastic/15 shadow-sm rounded-2xl overflow-hidden font-sans">
          <CardHeader className="pb-3 pt-5 px-6 border-b border-blue-fantastic/15 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
              Flagged Build Sites Requiring Attention ({filteredProjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-inset text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider border-b border-blue-fantastic/15">
                  <th className="py-3.5 px-6">Lot / ID</th>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Current Stage</th>
                  <th className="py-3.5 px-4">Delay Impact</th>
                  <th className="py-3.5 px-4">Risk Reason</th>
                  <th className="py-3.5 px-4">% Complete</th>
                  <th className="py-3.5 px-4">Supervisor</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-fantastic/5 text-xs text-blue-fantastic font-medium">
                {filteredProjects.map((p) => {
                  const topDelay = p.delays?.[0];
                  const delayDays = p.delayDays || topDelay?.durationDays || 4;
                  const isCritical = delayDays >= 5;

                  return (
                    <tr key={p.id} className="hover:bg-surface-inset/70 transition-colors group">
                      <td className="py-4 px-6 font-bold text-blue-fantastic">
                        LOT {p.id.toUpperCase()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-blue-fantastic group-hover:text-truffle-trouble transition-colors">
                          {p.clientName}
                        </div>
                        <div className="text-[11px] text-blue-fantastic/50 truncate max-w-[200px]">
                          {p.address}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-blue-fantastic">
                        {p.currentStage}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-extrabold ${
                            isCritical ? "text-red-600" : "text-amber-600"
                          }`}
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {delayDays} Days
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs font-semibold text-blue-fantastic truncate max-w-[220px]">
                          {topDelay?.description || "Schedule variance under review"}
                        </div>
                        {topDelay?.type && (
                          <span className="text-[10px] text-blue-fantastic/50 font-bold">
                            Type: {topDelay.type}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-oatmeal/20 rounded-full h-1.5 overflow-hidden">
                            <div
                              style={{ width: `${p.progress}%` }}
                              className="bg-burning-flame h-full rounded-full"
                            />
                          </div>
                          <span className="font-bold text-[11px] text-blue-fantastic">
                            {p.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-blue-fantastic/80 font-medium">
                        {p.supervisorName || "Unassigned"}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={`font-bold text-[10px] border-none px-2.5 py-0.5 rounded-full ${
                            p.status === "Delayed"
                              ? "bg-burning-flame/15 text-truffle-trouble"
                              : "bg-burning-flame/20 text-blue-fantastic"
                          }`}
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedMitigationProject(p)}
                            className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-bold h-7 px-2.5 rounded-lg cursor-pointer"
                          >
                            Action
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setSelectedDetailsProject(p)}
                            className="bg-truffle-trouble hover:bg-truffle-trouble/90 text-white font-bold text-xs h-7 px-2.5 rounded-lg cursor-pointer shadow-xs"
                          >
                            Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Project Details Modal (Reused from /company/projects) */}
      <ProjectDetailsModal
        project={selectedDetailsProject}
        isOpen={selectedDetailsProject !== null}
        onClose={() => setSelectedDetailsProject(null)}
      />

      {/* Mitigation Action Modal */}
      <MitigationModal
        project={selectedMitigationProject}
        isOpen={selectedMitigationProject !== null}
        onClose={() => setSelectedMitigationProject(null)}
        onSaveAction={(projectId, note, severity) => {
          setProjects((prev) =>
            prev.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    lastUpdate: "Just Now",
                  }
                : p
            )
          );
        }}
      />
    </div>
  );
}
