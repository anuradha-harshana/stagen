import React from "react";
import { requireRole } from "@/lib/auth/auth";
import ProjectsOverviewClient from "@/components/company-management/projects/ProjectsClient";

export default async function ProjectsOverviewPage() {
  await requireRole(["company-management"]);

  return <ProjectsOverviewClient />;
}
