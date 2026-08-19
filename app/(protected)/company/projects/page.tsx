import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyUsers } from "@/lib/users/users";
import { INITIAL_PROJECTS } from "@/lib/db-mock/projectsData";
import CompanyProjectsClient from "@/components/company/projects/company-projects-client";

export default async function CompanyProjectsPage() {
  // 1. Authenticate user and verify they have the 'company' role
  const user = await requireRole(["company"]);

  // 2. Fetch all users from database and filter for supervisor role
  const allUsers = await getCompanyUsers(user.id);
  const supervisors = allUsers
    .filter((u) => u.user.role === "supervisor" && u.companyId === user.id)
    .map((u) => ({
      id: u.user.id,
      username: u.user.username,
    }));

  return (
    <CompanyProjectsClient
      initialProjects={INITIAL_PROJECTS}
      supervisors={supervisors}
      companyId={user.id}
    />
  );
}
