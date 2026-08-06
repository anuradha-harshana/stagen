import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getUsers } from "@/lib/users/users";
import { INITIAL_PROJECTS } from "@/lib/db-mock/projectsData";
import CompanyProjectsClient from "@/components/company/projects/company-projects-client";

export default async function CompanyProjectsPage() {
  // 1. Authenticate user and verify they have the 'company' role
  await requireRole(["company"]);

  // 2. Fetch all users from database and filter for supervisor role
  const allUsers = await getUsers();
  const supervisors = allUsers
    .filter((u) => u.role === "supervisor")
    .map((u) => ({
      id: u.id,
      username: u.username,
    }));

  return (
    <CompanyProjectsClient
      initialProjects={INITIAL_PROJECTS}
      supervisors={supervisors}
    />
  );
}
