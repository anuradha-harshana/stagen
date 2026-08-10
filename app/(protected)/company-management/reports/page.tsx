import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { ReportsOverview } from "@/components/company-management/reports/ReportsOverview";

export default async function CompanyReportsPage() {
  await requireRole(["company-management"]);

  return <ReportsOverview />;
}
