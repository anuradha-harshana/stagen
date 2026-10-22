import React from "react";
import { requireRole } from "@/lib/auth/auth";
import {
  getCustomerProjects,
  getCustomerActivities,
  getCustomerPhotos,
} from "@/lib/tenant/projects";
import CustomerProgressClient from "@/components/Customer/Progress/customer-progress-client";

interface ProgressPageProps {
  searchParams?: Promise<{ projectId?: string }> | { projectId?: string };
}

export default async function ProgressPage({ searchParams }: ProgressPageProps) {
  // 1. Authenticate customer user
  const user = await requireRole(["customer"]);

  // 2. Fetch customer's projects from JSON files
  const initialProjects = await getCustomerProjects(user.id, user.companyId);

  // 3. Load activities and photos from JSON files
  const tenantIds = initialProjects.map((p) =>
    p.id.startsWith("tenant-") ? p.id : `tenant-${p.id}`
  );
  const activities = await getCustomerActivities(tenantIds);
  const photos = await getCustomerPhotos(tenantIds);

  const resolvedParams = searchParams ? await searchParams : {};
  const defaultProjectId = resolvedParams.projectId;

  return (
    <CustomerProgressClient
      initialProjects={initialProjects}
      activities={activities}
      photos={photos}
      user={user}
      defaultProjectId={defaultProjectId}
    />
  );
}
