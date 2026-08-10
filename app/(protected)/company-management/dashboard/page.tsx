import React from "react";
import { requireRole } from "@/lib/auth/auth";
import DashboardClient from "@/components/company-management/dashboard/dashboard-client";

export default async function ExecutiveDashboardPage() {
  await requireRole(["company-management"]);

  return <DashboardClient />;
}
