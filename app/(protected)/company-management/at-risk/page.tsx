import React from "react";
import { requireRole } from "@/lib/auth/auth";
import AtRiskProjectsClient from "@/components/company-management/at-risk/AtRiskClient";

export default async function AtRiskProjectsPage() {
  await requireRole(["company-management"]);

  return <AtRiskProjectsClient />;
}
