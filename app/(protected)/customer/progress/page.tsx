import React from "react";
import { requireRole } from "@/lib/auth/auth";
import ProgressPageClient from "@/components/Customer/Progress/ProgressPageClient";

export default async function ProgressPage() {
  // Check authorization and fetch current user
  const user = await requireRole(["customer"]);

  return <ProgressPageClient user={user} />;
}
