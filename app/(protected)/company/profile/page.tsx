import React from "react";
import { requireRole } from "@/lib/auth/auth";
import CompanyProfileClient from "@/components/company/profile/CompanyProfileClient";

export default async function CompanyProfilePage() {
  await requireRole(["company"]);

  return <CompanyProfileClient />;
}
