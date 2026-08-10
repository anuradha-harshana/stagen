import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { AuditOverview } from "@/components/company-management/audit/AuditOverview";

export default async function CompanyAuditPage() {
  await requireRole(["company-management"]);

  return <AuditOverview />;
}
