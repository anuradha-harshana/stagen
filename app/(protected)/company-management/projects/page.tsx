import React from "react";
import { requireRole } from "@/lib/auth/auth";
import ProjectsOverviewClient from "@/components/company-management/projects/projects-client";

export default async function ProjectsOverviewPage() {
  await requireRole(["company-management"]);

  return <ProjectsOverviewClient />;
}
