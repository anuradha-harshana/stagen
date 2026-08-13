"use client";

import React, { useState, useEffect } from "react";
import { INITIAL_PROJECTS, Project } from "@/lib/db-mock/projectsData";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import WorkloadHeader from "./WorkloadHeader";
import WorkloadStats from "./WorloadStats";
import SupervisorsGrid from "./SupervisorsGrid";
import ReassignModal from "./ReassignModal";

interface WorkloadClientProps {
  dbSupervisors: string[];
}

export default function WorkloadClient({ dbSupervisors }: WorkloadClientProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const supervisors = Array.from(new Set([...dbSupervisors, "Eric", "John"]));

  useEffect(() => {
    const saved = localStorage.getItem("stagen_company_projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse projects from localStorage", e);
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("stagen_company_projects", JSON.stringify(projects));
    }
  }, [projects, isHydrated]);

  const handleReassign = (projectId: string, supervisorName: string) => {
    const nextProjects = projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            supervisorName: supervisorName === "Unassigned" ? undefined : supervisorName,
          }
        : p
    );
    setProjects(nextProjects);
    setSelectedProject(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <WorkloadHeader />

      {/* Stats Summary */}
      <WorkloadStats projects={projects} supervisorCount={supervisors.length} />

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Grid: Supervisors Cards */}
        <div className="lg:col-span-8 w-full">
          <SupervisorsGrid
            supervisors={supervisors}
            projects={projects}
            onReassignClick={setSelectedProject}
          />
        </div>

        {/* Right Sidebar: All Lots Workload Status */}
        <div className="lg:col-span-4 w-full bg-palladian p-6 rounded-2xl border border-blue-fantastic/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-blue-fantastic/5">
            <Building2 className="h-4.5 w-4.5 text-truffle-trouble" />
            <h3 className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">
              All Lot Allocations
            </h3>
          </div>

          <p className="text-[11px] text-blue-fantastic/60 font-semibold leading-relaxed">
            Consolidated overview of all building sites and their assigned construction coordinator.
          </p>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-blue-fantastic/4 border border-blue-fantastic/5 rounded-xl text-xs font-bold text-blue-fantastic/80"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-fantastic">Lot {p.id}</span>
                    <Badge variant="outline" className="text-[9px] bg-blue-fantastic/5 font-bold px-1.5 py-0">
                      {p.currentStage}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-blue-fantastic/50 font-medium">
                    {p.clientName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-fantastic/70">
                    {p.supervisorName ? `Supervisor: ${p.supervisorName}` : "Unassigned"}
                  </span>
                  <Button
                    onClick={() => setSelectedProject(p)}
                    className="bg-blue-fantastic/10 hover:bg-blue-fantastic/20 text-blue-fantastic text-[9px] font-bold h-6 rounded-lg px-2 cursor-pointer"
                  >
                    Change
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reassignment Modal */}
      <ReassignModal
        project={selectedProject}
        supervisors={supervisors}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        onConfirm={handleReassign}
      />
    </div>
  );
}
