"use client";

import React, { useState } from "react";
import { INITIAL_PROJECTS, Project } from "@/lib/db-mock/projectsData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search, ShieldAlert, ArrowUpRight, Wrench, ShieldCheck, CheckCircle } from "lucide-react";
import { MitigationModal } from "./MitigationModal";

export default function AtRiskProjectsClient() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Filter only Delayed or Action Required projects
  const atRiskProjects = projects.filter(
    (p) => p.status === "Delayed" || p.status === "Action Required" || (p.delayDays && p.delayDays > 0)
  );

  const filteredProjects = atRiskProjects.filter((p) => {
    const matchesSearch =
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.supervisorName && p.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = severityFilter === "all" || p.riskSeverity === severityFilter;
    const matchesRegion = regionFilter === "all" || p.region === regionFilter;

    return matchesSearch && matchesSeverity && matchesRegion;
  });

  const criticalCount = atRiskProjects.filter((p) => (p.delayDays || 0) >= 5).length;
  const weatherDelayCount = atRiskProjects.filter((p) => p.delays?.some((d) => d.type === "Weather")).length;
  const materialDelayCount = atRiskProjects.filter((p) => p.delays?.some((d) => d.type === "Materials")).length;

  const handleSaveAction = (projectId: string, actionNote: string, newSeverity: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              riskSeverity: newSeverity as any,
              lastUpdate: "Just Now",
            }
          : p
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full p-6 md:p-8 font-cream bg-[#eee9df] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="h-7 w-7 text-truffle-trouble" />
            At-Risk & Delayed Projects
          </h1>
          <p className="text-xs text-blue-fantastic/70 font-medium">
            Priority monitoring, risk severity alerts, and delay mitigation workflow
          </p>
        </div>
      </div>

      {/* Risk Alert KPI Banner (4 Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-l-4 border-l-red-500 border border-oatmeal/40 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
            Total At-Risk / Delayed
          </span>
          <div className="text-4xl font-extrabold text-red-600 font-bebas-neue tracking-tight mt-1">
            {atRiskProjects.length}
          </div>
          <span className="text-xs text-blue-fantastic/60 font-medium mt-1 block">Active sites flagged</span>
        </Card>

        <Card className="bg-white border-l-4 border-l-truffle-trouble border border-oatmeal/40 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-bold text-truffle-trouble uppercase tracking-wider block">
            Critical Delays (&gt;= 5 Days)
          </span>
          <div className="text-4xl font-extrabold text-truffle-trouble font-bebas-neue tracking-tight mt-1">
            {criticalCount}
          </div>
          <span className="text-xs text-blue-fantastic/60 font-medium mt-1 block">Requires immediate action</span>
        </Card>

        <Card className="bg-white border-l-4 border-l-amber-500 border border-oatmeal/40 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
            Weather Induced Delays
          </span>
          <div className="text-4xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight mt-1">
            {weatherDelayCount}
          </div>
          <span className="text-xs text-blue-fantastic/60 font-medium mt-1 block">Torrential rainfall / site cut holds</span>
        </Card>

        <Card className="bg-white border-l-4 border-l-blue-500 border border-oatmeal/40 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Material & Trade Delays
          </span>
          <div className="text-4xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight mt-1">
            {materialDelayCount}
          </div>
          <span className="text-xs text-blue-fantastic/60 font-medium mt-1 block">Plasterboard / steel delays</span>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-oatmeal/40 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-fantastic/40" />
          <Input
            placeholder="Search at-risk project by ID, client, or supervisor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-palladian/30 border-oatmeal/40 rounded-xl text-xs text-blue-fantastic placeholder:text-blue-fantastic/40 font-medium h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Severity Filter */}
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40 bg-palladian/30 border-oatmeal/40 rounded-xl text-xs font-bold text-blue-fantastic h-9">
              <SelectValue placeholder="Severity: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Region Filter */}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
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
        </div>
      </div>

      {/* At-Risk Table */}
      <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl overflow-hidden font-cream">
        <CardHeader className="pb-3 pt-5 px-6 border-b border-oatmeal/20 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
            Flagged Build Sites Requiring Attention ({filteredProjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-palladian/40 text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider border-b border-oatmeal/20">
                <th className="py-3.5 px-6">Project ID</th>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4">Delay Impact</th>
                <th className="py-3.5 px-4">Risk Severity</th>
                <th className="py-3.5 px-4">% Complete</th>
                <th className="py-3.5 px-4">Supervisor</th>
                <th className="py-3.5 px-4">Region</th>
                <th className="py-3.5 px-4">Last Update</th>
                <th className="py-3.5 px-6 text-right">Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-oatmeal/15 text-xs text-blue-fantastic font-medium">
              {filteredProjects.map((p) => {
                const days = p.delayDays || 4;
                const isCritical = days >= 5;

                return (
                  <tr key={p.id} className="hover:bg-palladian/20 transition-colors">
                    <td className="py-4 px-6 font-bold">{p.id}</td>
                    <td className="py-4 px-4 font-bold">{p.clientName}</td>
                    <td className="py-4 px-4 font-semibold">{p.currentStage}</td>
                    <td className="py-4 px-4">
                      <span className={`font-extrabold ${isCritical ? "text-red-600" : "text-amber-600"}`}>
                        {days} Days
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={`font-bold text-[10px] ${
                          p.riskSeverity === "Critical" || isCritical
                            ? "bg-red-100 text-red-700"
                            : p.riskSeverity === "High"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {p.riskSeverity || (isCritical ? "Critical" : "High")}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-bold">{p.progress}%</td>
                    <td className="py-4 px-4">{p.supervisorName || "Unassigned"}</td>
                    <td className="py-4 px-4 font-bold">{p.region || "VIC"}</td>
                    <td className="py-4 px-4 text-blue-fantastic/60">{p.lastUpdate || "May 12, 2024"}</td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        onClick={() => setActiveModalProject(p)}
                        className="bg-truffle-trouble hover:bg-truffle-trouble/90 text-white font-bold text-xs h-8 px-3 rounded-xl cursor-pointer"
                      >
                        Log Action
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Mitigation Action Logger Modal */}
      <MitigationModal
        project={activeModalProject}
        isOpen={activeModalProject !== null}
        onClose={() => setActiveModalProject(null)}
        onSaveAction={handleSaveAction}
      />
    </div>
  );
}
