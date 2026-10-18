import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyReports } from "@/lib/reports/reports";
import { ReportsOverview } from "@/components/company-management/reports/ReportsOverview";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";

export default async function CompanyReportsPage() {
  // 1. Authenticate user and verify they have the 'company-management' role
  const user = await requireRole(["company-management"]);
  const companyId =
    (user as { companyId?: string }).companyId || user.id;

  // 2. Fetch initial reports & analytics data from JSON storage
  const initialReports = await getCompanyReports(companyId);

  return (
    <div className={PAGE_SHELL_CLASS}>
      <ReportsOverview
        initialData={initialReports}
        companyId={companyId}
      />
    </div>
  );
}
