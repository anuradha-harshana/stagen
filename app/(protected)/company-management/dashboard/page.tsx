import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyManagementDashboardData } from "@/lib/company-management/dashboardData";
import DashboardClient from "@/components/company-management/dashboard/DashboardClient";

export default async function ExecutiveDashboardPage() {
  const user = await requireRole(["company-management"]);
  const companyId = user.companyId || user.id;
  const dashboardData = await getCompanyManagementDashboardData(companyId);

  return <DashboardClient data={dashboardData} />;
}
