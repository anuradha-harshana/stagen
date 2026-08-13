"use client";

import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { Project } from "@/lib/db-mock/projectsData";

import ProjectsHeader from "./projects-header";
import ProjectsStats from "./projects-stats";
import ProjectsFilters from "./projects-filters";
import ProjectCard from "./project-card";
import ProjectDetailsModal from "./project-details-modal";
import ProjectFormModal from "./project-form-modal";

interface CompanyProjectsClientProps {
  initialProjects: Project[];
  supervisors: { id: string; username: string }[];
}

export default function CompanyProjectsClient({
  initialProjects,
  supervisors,
}: CompanyProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isHydrated, setIsHydrated] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "On Track" | "Delayed" | "Action Required">("All");
  const [stageFilter, setStageFilter] = useState<string>("All");

  // Modal States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync state with localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem("stagen_company_projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse projects from localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("stagen_company_projects", JSON.stringify(projects));
    }
  }, [projects, isHydrated]);

  // Handle Save (Create / Update)
  const handleSaveProject = (savedProject: Project) => {
    const exists = projects.some((p) => p.id === savedProject.id);
    if (exists) {
      setProjects(projects.map((p) => (p.id === savedProject.id ? savedProject : p)));
    } else {
      setProjects([savedProject, ...projects]);
    }
    setIsFormOpen(false);
    setEditingProject(null);
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    const matchesStage =
      stageFilter === "All" || project.currentStage === stageFilter;

    return matchesSearch && matchesStatus && matchesStage;
  });

  const handleCreateNewClick = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <ProjectsHeader onCreateClick={handleCreateNewClick} />

      {/* Overview Stats */}
      <ProjectsStats projects={projects} />

      {/* Filter and Search controls */}
      <ProjectsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
      />

      {/* Project Card Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-palladian/40 border border-dashed border-blue-fantastic/20 rounded-2xl">
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
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />

      <ProjectFormModal
        project={editingProject}
        supervisors={supervisors}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
      />
    </div>
  );
}
