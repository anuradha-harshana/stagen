"use client";

import React from "react";
import CompanyProjectsClient from "@/components/company/projects/company-projects-client";
import { Project } from "@/lib/types/project";

interface ProjectsOverviewClientProps {
  initialProjects?: Project[];
  supervisors?: { id: string; username: string }[];
  companyId?: string;
}

export default function ProjectsOverviewClient({
  initialProjects = [],
  supervisors = [],
  companyId = "",
}: ProjectsOverviewClientProps) {
  return (
    <CompanyProjectsClient
      initialProjects={initialProjects}
      supervisors={supervisors}
      companyId={companyId}
      pageTitle="Projects Overview"
      pageSubtitle="Track active construction sites, manage stage progression, update timelines, and assign site supervisors."
    />
  );
}
