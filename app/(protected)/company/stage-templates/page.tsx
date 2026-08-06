import React from "react";
import { requireRole } from "@/lib/auth/auth";
import StageTemplatesClient from "@/components/company/stage-templates/stage-templates-client";

export default async function StageTemplatesPage() {
  // 1. Authenticate user and verify they have the 'company' role
  await requireRole(["company"]);

  return <StageTemplatesClient />;
}
