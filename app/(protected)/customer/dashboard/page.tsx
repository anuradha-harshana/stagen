import React from "react";
import { requireRole } from "@/lib/auth/auth";
import {
  getCustomerProjects,
  getCustomerActivities,
  getCustomerPhotos,
} from "@/lib/tenant/projects";
import CustomerDashboardClient from "@/components/Customer/Dashboard/customer-dashboard-client";

export default async function CustomerDashboardPage() {
  // 1. Authenticate user and verify role
  const user = await requireRole(["customer"]);

  // 2. Fetch customer's projects from JSON records
  const initialProjects = await getCustomerProjects(user.id, user.companyId);

  // 3. Load activities and photos for the customer's projects
  const tenantIds = initialProjects.map((p) =>
    p.id.startsWith("tenant-") ? p.id : `tenant-${p.id}`
  );
  const activities = await getCustomerActivities(tenantIds);
  const photos = await getCustomerPhotos(tenantIds);

  return (
    <CustomerDashboardClient
      initialProjects={initialProjects}
      activities={activities}
      photos={photos}
      user={user}
    />
  );
}
