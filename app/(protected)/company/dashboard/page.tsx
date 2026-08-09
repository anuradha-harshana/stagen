import React from "react";
import { requireRole } from "@/lib/auth/auth";
import CompanyDashboardClient from "@/components/company/dashboard/CompanyDashboardClient";

export default async function CompanyDashboardPage() {
  await requireRole(["company"]);

  return <CompanyDashboardClient />;
}
