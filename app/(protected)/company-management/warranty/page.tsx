import React from "react";
import { requireRole } from "@/lib/auth/auth";
import WarrantyClient from "@/components/company-management/warranty/WarrantyClient";

export default async function WarrantyPage() {
  // 1. Authenticate user and verify they have the 'company-management' role
  await requireRole(["company-management"]);

  return <WarrantyClient />;
}
