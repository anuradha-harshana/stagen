import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyLocalisationData } from "@/lib/company/localisation";
import CompanyLocalisationClient from "@/components/company/localisation/CompanyLocalisationClient";

export default async function CompanyLocalisationPage() {
  // 1. Authenticate user and verify they have the 'company' role
  const user = await requireRole(["company"]);

  // 2. Fetch initial localisation data directly from JSON storage
  const data = await getCompanyLocalisationData(user.id);

  return (
    <CompanyLocalisationClient
      initialKeys={data.translationKeys}
      initialSettings={data.settings}
      companyId={user.id}
    />
  );
}
