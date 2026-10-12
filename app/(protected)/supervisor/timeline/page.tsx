import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { SupervisorTimelineClient } from "@/components/supervisor/timeline/SupervisorTimelineClient";

export default async function SupervisorTimelinePage() {
  // Enforce supervisor role requirement
  const user = await requireRole(["supervisor"]);

  return <SupervisorTimelineClient />;
}
