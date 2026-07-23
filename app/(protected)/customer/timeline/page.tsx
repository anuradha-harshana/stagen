import React from "react";
import { requireRole } from "@/lib/auth/auth";
import TimelinePageClient from "@/components/Customer/Timeline/TimelinePageClient";

export default async function TimelinePage() {
  // Check authorization and fetch current customer
  const user = await requireRole(["customer"]);

  return <TimelinePageClient user={user} />;
}
