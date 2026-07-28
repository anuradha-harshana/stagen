import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { SupervisorDelaysClient } from "@/components/supervisor/delays/SupervisorDelaysClient";

export const metadata = {
  title: "Delay Management | Supervisor Portal",
  description: "Log schedule delays, update target dates, and notify clients.",
};

export default async function SupervisorDelaysPage() {
  await requireRole(["supervisor"]);

  return <SupervisorDelaysClient />;
}
