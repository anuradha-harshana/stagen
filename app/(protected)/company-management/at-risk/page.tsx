import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyProjects } from "@/lib/tenant/projects";
import AtRiskClient from "@/components/company-management/at-risk/AtRiskClient";

export default async function AtRiskProjectsPage() {
  const user = await requireRole(["company-management"]);
  const companyId = user.companyId || user.id;

  // 1. Fetch all projects directly from JSON records for this company
  const allProjects = await getCompanyProjects(companyId);

  // 2. Filter projects that are at-risk, delayed, or have active delay logs
  const atRiskProjects = allProjects.filter(
    (p) =>
      p.status === "Delayed" ||
      p.status === "Action Required" ||
      (p.delayDays !== undefined && p.delayDays > 0) ||
      (p.delays && p.delays.length > 0)
  );

  return (
    <AtRiskClient
      initialProjects={atRiskProjects}
      allProjectsCount={allProjects.length}
    />
  );
}
