import React from "react";
import { requireRole } from "@/lib/auth/auth";
import AtRiskProjectsClient from "@/components/company-management/at-risk/AtRiskClient";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";

export default async function AtRiskProjectsPage() {
  await requireRole(["company-management"]);

  return (
    <div className={PAGE_SHELL_CLASS}>
      <AtRiskProjectsClient />
    </div>
  );
}
