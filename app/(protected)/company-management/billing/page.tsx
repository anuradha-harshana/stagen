import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { BillingOverview } from "@/components/company-management/billing/BillingOverview";

export default async function CompanyBillingPage() {
  await requireRole(["company-management"]);

  return <BillingOverview />;
}
