import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getUsers } from "@/lib/users/users";
import WorkloadClient from "@/components/company-management/supervisors/WorkloadClient";
import { fetchCompanyProjectsAction } from "@/lib/company/actions";

export default async function SupervisorsWorkloadPage() {
  // 1. Authenticate user and verify they have the 'company-management' role
  await requireRole(["company-management"]);

  // 2. Fetch supervisors from database
  const allUsers = await getUsers();
  const dbSupervisors = allUsers
    .filter((u) => u.role === "supervisor")
    .map((u) => u.username);

  // 3. Fetch projects from JSON file
  const projects = await fetchCompanyProjectsAction();

  return <WorkloadClient dbSupervisors={dbSupervisors} initialProjects={projects} />;
}
