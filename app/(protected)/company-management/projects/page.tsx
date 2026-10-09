import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyUsers } from "@/lib/users/users";
import { getCompanyProjects } from "@/lib/tenant/projects";
import CompanyProjectsClient from "@/components/company/projects/company-projects-client";

export default async function CompanyManagementProjectsPage() {
  // 1. Authenticate user and verify they have the 'company-management' role
  const user = await requireRole(["company-management"]);
  const companyId = user.companyId || user.id;

  // 2. Fetch projects directly from JSON records for this company
  const initialProjects = await getCompanyProjects(companyId);

  // 3. Fetch supervisors from users.json for assignment options
  const allUsers = await getCompanyUsers(companyId);
  const supervisors = allUsers
    .filter((u) => u.user.role === "supervisor" && u.companyId === companyId)
    .map((u) => ({
      id: u.user.id,
      username: u.user.username,
    }));

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
