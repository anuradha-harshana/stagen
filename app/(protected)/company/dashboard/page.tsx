import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyProjects } from "@/lib/tenant/projects";
import CompanyDashboardClient from "@/components/company/dashboard/CompanyDashboardClient";

export default async function CompanyDashboardPage() {
  const user = await requireRole(["company"]);



  return <CompanyDashboardClient user={user} />;
}
