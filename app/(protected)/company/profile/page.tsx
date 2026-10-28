import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyProfile } from "@/lib/company/companyProfile";
import CompanyProfileClient from "@/components/company/profile/CompanyProfileClient";

export default async function CompanyProfilePage() {
  const user = await requireRole(["company"]);
  const companyId = user.companyId || user.id;
  const initialProfile = await getCompanyProfile(companyId);

  return <CompanyProfileClient initialProfile={initialProfile} />;
}
