import React from "react";
import { requireRole } from "@/lib/auth/auth";
import CustomerInsightsClient from "@/components/company-management/customer-insights/InsightsClient";
import { fetchCompanyProjectsAction } from "@/lib/company/actions";

export default async function CustomerInsightsPage() {
  // 1. Authenticate user and verify they have the 'company-management' role
  await requireRole(["company-management"]);

  const projects = await fetchCompanyProjectsAction();

  return <CustomerInsightsClient initialProjects={projects} />;
}
