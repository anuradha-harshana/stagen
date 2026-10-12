"use client";

import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Project, Stage } from "@/lib/types/project";
import { StageTemplate } from "@/lib/types/types";

import ProjectsHeader from "./projects-header";
import ProjectsStats from "./projects-stats";
import ProjectsFilters from "./projects-filters";
import ProjectCard from "./project-card";
import ProjectDetailsModal from "./project-details-modal";
import ProjectFormModal, { ProjectFormPayload } from "./project-form-modal";

interface CompanyProjectsClientProps {
  initialProjects: Project[];
  supervisors: { id: string; username: string }[];
  companyId: string;
}

export default function CompanyProjectsClient({
  initialProjects,
  supervisors,
  companyId,
}: CompanyProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [stageTemplates, setStageTemplates] = useState<Stage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "On Track" | "Delayed" | "Action Required">("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const loadStageTemplates = async () => {
      try {
        const response = await fetch(`/api/company/stages?companyId=${encodeURIComponent(companyId)}`);
        if (!response.ok) throw new Error("Failed to load stage templates");
        const data: { stages: StageTemplate[] } = await response.json();
        setStageTemplates(data.stages.map((stage) => ({
          name: stage.name as Stage["name"],
          status: "Pending",
          progress: 0,
          checklist: stage.checklist.map((item) => ({ ...item, completed: false })),
        })));
      } catch (error) {
        console.error("Failed to load company stage templates", error);
      }
    };

    void loadStageTemplates();
  }, [companyId]);

  const handleSaveProject = async (payload: ProjectFormPayload) => {
    const response = await fetch("/api/company/projects", {
      method: editingProject ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to save project");

    const data: { project: Project } = await response.json();
    setProjects((current) => {
      const exists = current.some((project) => project.id === data.project.id);
      return exists
        ? current.map((project) => project.id === data.project.id ? data.project : project)
        : [data.project, ...current];
    });
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (project: Project) => {
    const response = await fetch(`/api/company/projects?projectId=${encodeURIComponent(project.id)}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete project");
    setProjects((current) => current.filter((item) => item.id !== project.id));
  };

  const filteredProjects = projects.filter((project) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = project.clientName.toLowerCase().includes(query) ||
      project.address.toLowerCase().includes(query) ||
      project.id.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    const matchesStage = stageFilter === "All" || project.currentStage === stageFilter;
    return matchesSearch && matchesStatus && matchesStage;
  });

  return (
    <div className="flex flex-col gap-0.5 w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <ProjectsHeader onCreateClick={() => { setEditingProject(null); setIsFormOpen(true); }} />
      <ProjectsStats projects={projects} />
      <ProjectsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
        stages={stageTemplates.map((stage) => stage.name)}
      />

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface-inset border border-dashed border-blue-fantastic/20 rounded-2xl">
          <Building2 className="h-10 w-10 text-blue-fantastic/30 mb-2" />
          <p className="text-sm font-bold text-blue-fantastic">No Projects Found</p>
          <p className="text-xs text-blue-fantastic/60 mt-1">Try tweaking your search or filter selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetails={setSelectedProject}
              onEdit={(item) => { setEditingProject(item); setIsFormOpen(true); }}
              onDelete={(item) => void handleDeleteProject(item).catch(console.error)}
            />
          ))}
        </div>
      )}

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
      <ProjectFormModal
        project={editingProject}
        supervisors={supervisors}
        stageTemplates={stageTemplates}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingProject(null); }}
        onSave={(payload) => void handleSaveProject(payload).catch(console.error)}
      />
    </div>
  );
}
