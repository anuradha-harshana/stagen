"use client";

import React, { useState } from "react";
import { INITIAL_PROJECTS, Project } from "@/lib/db-mock/projectsData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, LayoutGrid, List, MapPin, Calendar, Clock, AlertTriangle, Eye, Building2 } from "lucide-react";
import { ProjectDetailModal } from "./ProjectDetailModal";

export default function ProjectsOverviewClient() {
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Filter logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.supervisorName && p.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStage = selectedStage === "all" || p.currentStage === selectedStage;
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchesRegion = selectedRegion === "all" || p.region === selectedRegion;

    return matchesSearch && matchesStage && matchesStatus && matchesRegion;
  });

  const totalCount = projects.length;
  const delayedCount = projects.filter((p) => p.status === "Delayed" || p.status === "Action Required").length;
  const activeCount = projects.filter((p) => p.status === "On Track" || p.status === "Delayed" || p.status === "Action Required").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;

  return (
    <div className="flex flex-col gap-6 w-full p-6 md:p-8 font-cream bg-[#eee9df] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight">
            Projects Overview
          </h1>
          <p className="text-xs text-blue-fantastic/70 font-medium">
            Real-time tracking and stage progression across all active construction sites
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-oatmeal/40 shadow-xs">
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "ghost"}
            onClick={() => setViewMode("grid")}
            className={`h-8 px-3 rounded-lg text-xs font-bold ${
              viewMode === "grid" ? "bg-blue-fantastic text-white" : "text-blue-fantastic/70"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5 mr-1" />
            Grid
          </Button>
          <Button
            size="sm"
            variant={viewMode === "table" ? "default" : "ghost"}
            onClick={() => setViewMode("table")}
            className={`h-8 px-3 rounded-lg text-xs font-bold ${
              viewMode === "table" ? "bg-blue-fantastic text-white" : "text-blue-fantastic/70"
            }`}
          >
            <List className="h-3.5 w-3.5 mr-1" />
            Table
          </Button>
        </div>
      </div>

      {/* Metric Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl p-4">
          <span className="text-[10px] font-bold text-blue-fantastic/50 uppercase tracking-wider">Total Sites</span>
          <div className="text-2xl font-black text-blue-fantastic font-bebas-neue">{totalCount}</div>
        </Card>
        <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl p-4">
          <span className="text-[10px] font-bold text-blue-fantastic/50 uppercase tracking-wider">Active</span>
          <div className="text-2xl font-black text-blue-fantastic font-bebas-neue">{activeCount}</div>
        </Card>
        <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl p-4">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Delayed / At-Risk</span>
          <div className="text-2xl font-black text-red-600 font-bebas-neue">{delayedCount}</div>
        </Card>
        <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl p-4">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-black text-emerald-700 font-bebas-neue">{completedCount}</div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-oatmeal/40 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-fantastic/40" />
          <Input
            placeholder="Search by client, lot ID, address or supervisor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-palladian/30 border-oatmeal/40 rounded-xl text-xs text-blue-fantastic placeholder:text-blue-fantastic/40 font-medium h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Stage Filter */}
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-36 bg-palladian/30 border-oatmeal/40 rounded-xl text-xs font-bold text-blue-fantastic h-9">
              <SelectValue placeholder="Stage: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Site Cut">Site Cut</SelectItem>
              <SelectItem value="Slab">Slab</SelectItem>
              <SelectItem value="Frame">Frame</SelectItem>
              <SelectItem value="Lockup">Lockup</SelectItem>
              <SelectItem value="Fixing">Fixing</SelectItem>
              <SelectItem value="Completion">Completion</SelectItem>
              <SelectItem value="Handover">Handover</SelectItem>
            </SelectContent>
          </Select>

          {/* Region Filter */}
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-32 bg-palladian/30 border-oatmeal/40 rounded-xl text-xs font-bold text-blue-fantastic h-9">
              <SelectValue placeholder="Region: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="NSW">NSW</SelectItem>
              <SelectItem value="VIC">VIC</SelectItem>
              <SelectItem value="QLD">QLD</SelectItem>
              <SelectItem value="WA">WA</SelectItem>
              <SelectItem value="SA">SA</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-36 bg-palladian/30 border-oatmeal/40 rounded-xl text-xs font-bold text-blue-fantastic h-9">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="On Track">On Track</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
              <SelectItem value="Action Required">Action Required</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-fantastic/30 transition-all flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                {/* Top Badge row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="font-bold text-xs bg-blue-fantastic/5 text-blue-fantastic">
                      {project.id}
                    </Badge>
                    {project.region && (
                      <Badge className="bg-palladian text-blue-fantastic font-bold text-[10px] border-none">
                        {project.region}
                      </Badge>
                    )}
                  </div>
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

                {/* Client Name & Address */}
                <div>
                  <h3 className="font-bold text-base text-blue-fantastic font-sans">
                    {project.clientName}
                  </h3>
                  <p className="text-xs text-blue-fantastic/60 font-medium flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="h-3 w-3 shrink-0 text-truffle-trouble" />
                    {project.address}
                  </p>
                </div>

                {/* Progress & Stage */}
                <div className="space-y-1.5 bg-palladian/30 p-3 rounded-xl border border-oatmeal/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-fantastic">Stage: {project.currentStage}</span>
                    <span className="font-extrabold text-blue-fantastic">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-oatmeal/20 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${project.progress}%` }}
                      className={`h-full rounded-full transition-all ${
                        project.status === "Delayed"
                          ? "bg-red-500"
                          : project.status === "Action Required"
                          ? "bg-amber-500"
                          : "bg-burning-flame"
                      }`}
                    />
                  </div>
                </div>

                {/* Supervisor & Est Handover */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-oatmeal/15 text-blue-fantastic/70">
                  <span>Supervisor: <strong className="text-blue-fantastic">{project.supervisorName || "Unassigned"}</strong></span>
                  <span>Handover: <strong className="text-blue-fantastic">{project.estHandover}</strong></span>
                </div>
              </CardContent>

              <div className="px-5 pb-5 pt-0">
                <Button
                  onClick={() => setActiveModalProject(project)}
                  className="w-full bg-blue-fantastic hover:bg-blue-fantastic/90 text-white font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Stage Breakdown
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl overflow-hidden font-cream">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-palladian/40 text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider border-b border-oatmeal/20">
                  <th className="py-3 px-6">Lot / ID</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">% Complete</th>
                  <th className="py-3 px-4">Supervisor</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Est. Handover</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oatmeal/15 text-xs text-blue-fantastic font-medium">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-palladian/20 transition-colors">
                    <td className="py-3.5 px-6 font-bold">{project.id}</td>
                    <td className="py-3.5 px-4 font-bold">{project.clientName}</td>
                    <td className="py-3.5 px-4">{project.currentStage}</td>
                    <td className="py-3.5 px-4">{project.progress}%</td>
                    <td className="py-3.5 px-4">{project.supervisorName || "Unassigned"}</td>
                    <td className="py-3.5 px-4 font-bold">{project.region || "VIC"}</td>
                    <td className="py-3.5 px-4 text-blue-fantastic/70">{project.estHandover}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        className={`font-bold text-[10px] ${
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
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Button
                        size="sm"
                        onClick={() => setActiveModalProject(project)}
                        className="bg-palladian hover:bg-oatmeal/40 text-blue-fantastic font-bold text-xs h-7 px-3 rounded-lg cursor-pointer"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeModalProject}
        isOpen={activeModalProject !== null}
        onClose={() => setActiveModalProject(null)}
      />
    </div>
  );
}
