import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getUsers } from "@/lib/users/users";
import WarrantyClient from "@/components/company-management/warranty/WarrantyClient";
import { fetchCompanyDefectsAction } from "@/lib/company/actions";

export default async function WarrantyPage() {
  // 1. Authenticate user and verify they have the 'company-management' role
  await requireRole(["company-management"]);

  // 2. Fetch defects from JSON file
  const defects = await fetchCompanyDefectsAction();

  // 3. Fetch supervisors from database
  const allUsers = await getUsers();
  const dbSupervisors = allUsers
    .filter((u) => u.role === "supervisor")
    .map((u) => u.username);

  return <WarrantyClient initialDefects={defects} supervisors={dbSupervisors} />;
}
