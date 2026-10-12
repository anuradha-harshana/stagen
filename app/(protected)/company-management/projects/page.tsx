import React from "react";
import { requireRole } from "@/lib/auth/auth";
import ProjectsOverviewClient from "@/components/company-management/projects/ProjectsClient";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";

export default async function ProjectsOverviewPage() {
  await requireRole(["company-management"]);

  return (
    <div className={PAGE_SHELL_CLASS}>
      <ProjectsOverviewClient />
    </div>
  );
}
