import React from "react";
import { requireRole } from "@/lib/auth/auth";
import TimelinePageClient from "@/components/Customer/Timeline/TimelinePageClient";

export default async function TimelinePage() {
  // Check authorization and fetch current customer
  await requireRole(["customer"]);

  return <TimelinePageClient />;
}
