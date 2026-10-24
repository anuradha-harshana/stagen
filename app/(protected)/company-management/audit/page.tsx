import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyAuditData } from "@/lib/company-management/audit";
import { AuditOverview } from "@/components/company-management/audit/AuditOverview";

export default async function CompanyAuditPage() {
  // 1. Authenticate user and verify they have the 'company-management' or 'company' role
  const user = await requireRole(["company-management", "company"]);
  const companyId =
    (user as { companyId?: string }).companyId || user.id;

  // 2. Fetch initial audit and compliance reporting data from JSON storage
  const initialData = await getCompanyAuditData(companyId);

  return <AuditOverview initialData={initialData} companyId={companyId} />;
}
