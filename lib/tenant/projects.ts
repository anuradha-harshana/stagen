import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { Project, Stage } from "../types/project";

const dataRoot = path.join(process.cwd(), "data", "tenants");
const usersFile = path.join(process.cwd(), "data", "users", "users.json");

type RecordValue = Record<string, any>;

const files = {
  tenants: "tenants.json",
  stages: "tenant_stages.json",
  timelines: "tenant_timelines.json",
  assignments: "tenant_assignments.json",
  delays: "tenant_delays.json",
  questions: "tenant_questions.json",
};

async function readRecords(fileName: string): Promise<RecordValue[]> {
  const value = JSON.parse(
    await fs.readFile(path.join(dataRoot, fileName), "utf8")
  ) as RecordValue | RecordValue[];
  return Array.isArray(value) ? value : [value];
}

async function writeRecords(fileName: string, records: RecordValue[]) {
  await fs.writeFile(
    path.join(dataRoot, fileName),
    JSON.stringify(records, null, 2)
  );
}

function tenantIdFromProjectId(projectId: string) {
  return projectId.startsWith("tenant-") ? projectId : `tenant-${projectId}`;
}

function projectIdFromTenantId(tenantId: string) {
  return tenantId.startsWith("tenant-") ? tenantId.slice(7) : tenantId;
}

function toStatus(value: string): Project["status"] {
  if (value === "Delayed" || value.toLowerCase() === "delayed") return "Delayed";
  if (value === "Action Required" || value.toLowerCase() === "action required") return "Action Required";
  if (value === "Completed" || value.toLowerCase() === "completed") return "Completed";
  return "On Track";
}

function toStageStatus(value: string): Stage["status"] {
  if (value.toLowerCase() === "completed") return "Completed";
  if (value.toLowerCase() === "active" || value.toLowerCase() === "in-progress") return "Active";
  return "Pending";
}

function toProject(
  tenant: RecordValue,
  stageRecord: RecordValue | undefined,
  timeline: RecordValue | undefined,
  assignment: RecordValue | undefined,
  delays: RecordValue[],
  questions: RecordValue[]
): Project {
  const stages = ((stageRecord?.stages ?? []) as RecordValue[]).map((stage) => ({
    name: stage.name as Stage["name"],
    status: toStageStatus(String(stage.status ?? stage.supervisor_status ?? "Pending")),
    progress: Number(stage.progress ?? 0),
    checklist: Array.isArray(stage.checklist)
      ? stage.checklist.map((item) => ({
          id: String(item.id),
          label: String(item.label),
          completed: Boolean(item.completed),
        }))
      : [],
  }));

  return {
    id: projectIdFromTenantId(String(tenant.tenant_id)),
    clientName: String(tenant.client_name ?? ""),
    address: String(tenant.address ?? ""),
    status: toStatus(String(tenant.status ?? "On Track")),
    progress: Number(tenant.progress ?? timeline?.percentage ?? 0),
    currentStage: tenant.current_stage as Stage["name"],
    startDate: String(tenant.start_date ?? ""),
    estHandover: String(tenant.est_handover ?? ""),
    imageGradient: String(tenant.image_gradient ?? "from-blue-fantastic/40 to-abyssal-blue/80"),
    stages,
    delays: delays.map((delay) => ({
      id: String(delay.id),
      type: String(delay.type ?? "Weather") as Project["delays"][number]["type"],
      durationDays: Number(delay.duration_days ?? 0),
      description: String(delay.reason ?? delay.description ?? delay.title ?? ""),
      date: String(delay.date ?? delay.from_date ?? ""),
    })),
    questions: questions.map((question) => ({
      id: String(question.id),
      customerName: String(question.customer_name ?? ""),
      questionText: String(question.question_details ?? question.question_title ?? ""),
      date: String(question.date_asked ?? ""),
      replied: String(question.status).toUpperCase() === "ANSWERED",
      replyText: question.answer_text ?? undefined,
    })),
    supervisorName: assignment?.user_name,
    delayDays: Number(timeline?.delay_days ?? 0),
  };
}

export async function getCompanyProjects(companyId: string): Promise<Project[]> {
  const [tenants, stageRecords, timelines, assignments, delays, questions] = await Promise.all(
    Object.values(files).map((fileName) => readRecords(fileName))
  );
  const users = JSON.parse(await fs.readFile(usersFile, "utf8")) as RecordValue[];

  return tenants
    .filter((tenant) => tenant.company_id === companyId)
    .map((tenant) => {
      const tenantId = tenant.tenant_id;
      const assignment = assignments.find((item) => item.tenant_id === tenantId);
      const supervisor = assignment
        ? {
            ...assignment,
            user_name: users.find((user) => user.id === assignment.user_id)?.username,
          }
        : undefined;
      return toProject(
        tenant,
        stageRecords.find((item) => item.tenant_id === tenantId),
        timelines.find((item) => item.tenant_id === tenantId),
        supervisor,
        delays.filter((item) => item.tenant_id === tenantId),
        questions.filter((item) => item.tenant_id === tenantId)
      );
    });
}

export interface ProjectPayload {
  tenant: RecordValue;
  stages: RecordValue;
  timeline: RecordValue;
  assignment: RecordValue | null;
  project: Project;
}

export async function saveCompanyProject(
  companyId: string,
  payload: ProjectPayload
): Promise<Project> {
  const tenantId = tenantIdFromProjectId(payload.project.id);
  const [tenants, stageRecords, timelines, assignments, delays, questions] = await Promise.all(
    Object.values(files).map((fileName) => readRecords(fileName))
  );
  const now = new Date().toISOString();
  const tenant = {
    ...payload.tenant,
    tenant_id: tenantId,
    company_id: companyId,
    updated_at: now,
  };

  const replace = (records: RecordValue[], record: RecordValue) => {
    const index = records.findIndex((item) => item.tenant_id === tenantId);
    if (index === -1) records.push(record);
    else records[index] = { ...records[index], ...record };
  };

  replace(tenants, tenant);
  replace(stageRecords, { ...payload.stages, tenant_id: tenantId });
  replace(timelines, { ...payload.timeline, tenant_id: tenantId });

  const assignmentIndex = assignments.findIndex((item) => item.tenant_id === tenantId);
  if (payload.assignment) {
    const assignment = {
      ...payload.assignment,
      id: payload.assignment.id || `assign-${crypto.randomUUID()}`,
      tenant_id: tenantId,
    };
    if (assignmentIndex === -1) assignments.push(assignment);
    else assignments[assignmentIndex] = assignment;
  } else if (assignmentIndex !== -1) {
    assignments.splice(assignmentIndex, 1);
  }

  await Promise.all([
    writeRecords(files.tenants, tenants),
    writeRecords(files.stages, stageRecords),
    writeRecords(files.timelines, timelines),
    writeRecords(files.assignments, assignments),
  ]);

  return toProject(
    tenant,
    stageRecords.find((item) => item.tenant_id === tenantId),
    timelines.find((item) => item.tenant_id === tenantId),
    assignments.find((item) => item.tenant_id === tenantId),
    delays.filter((item) => item.tenant_id === tenantId),
    questions.filter((item) => item.tenant_id === tenantId)
  );
}

export async function deleteCompanyProject(companyId: string, projectId: string) {
  const tenantId = tenantIdFromProjectId(projectId);
  const [tenants, stageRecords, timelines, assignments, delays, questions] = await Promise.all(
    Object.values(files).map((fileName) => readRecords(fileName))
  );
  const activities = await readRecords("tenant_activities.json");
  const tenant = tenants.find((item) => item.tenant_id === tenantId && item.company_id === companyId);
  if (!tenant) return false;

  const remove = (records: RecordValue[]) => records.filter((item) => item.tenant_id !== tenantId);
  await Promise.all([
    writeRecords(files.tenants, remove(tenants)),
    writeRecords(files.stages, remove(stageRecords)),
    writeRecords(files.timelines, remove(timelines)),
    writeRecords(files.assignments, remove(assignments)),
    writeRecords(files.delays, remove(delays)),
    writeRecords(files.questions, remove(questions)),
    writeRecords("tenant_activities.json", remove(activities)),
  ]);
  return true;
}

export interface ProjectActivity {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  date: string;
  stage_id: string;
  stage_name: string;
  type: "success" | "warning" | "info";
  created_by?: string;
}

export interface ProjectPhoto {
  id: string;
  tenant_id: string;
  stage_name: string;
  url: string;
  file_name?: string;
  file_size?: number;
  label: string;
  caption?: string;
  uploader_name?: string;
  timestamp: string;
}

export async function getCustomerProjects(
  userId: string,
  companyId?: string
): Promise<Project[]> {
  const [tenants, stageRecords, timelines, assignments, delays, questions] = await Promise.all(
    Object.values(files).map((fileName) => readRecords(fileName))
  );
  const users = JSON.parse(await fs.readFile(usersFile, "utf8")) as RecordValue[];
  const currentUser = users.find((user) => user.id === userId);

  // Match by client_user_id or by customer username/client_name
  let customerTenants = tenants.filter(
    (tenant) =>
      tenant.client_user_id === userId ||
      (currentUser?.username &&
        tenant.client_name?.toLowerCase().includes(currentUser.username.toLowerCase()))
  );

  // Fallback: If no lots specifically assigned to this user ID, return all lots belonging to their company
  if (customerTenants.length === 0) {
    customerTenants = companyId
      ? tenants.filter((tenant) => tenant.company_id === companyId)
      : tenants;
  }

  // Final fallback for local development/testing: return the first tenant lot
  if (customerTenants.length === 0 && tenants.length > 0) {
    customerTenants = [tenants[0]];
  }

  return customerTenants.map((tenant) => {
    const tenantId = tenant.tenant_id;
    const assignment = assignments.find((item) => item.tenant_id === tenantId);
    const supervisor = assignment
      ? {
          ...assignment,
          user_name: users.find((user) => user.id === assignment.user_id)?.username,
        }
      : undefined;
    return toProject(
      tenant,
      stageRecords.find((item) => item.tenant_id === tenantId),
      timelines.find((item) => item.tenant_id === tenantId),
      supervisor,
      delays.filter((item) => item.tenant_id === tenantId),
      questions.filter((item) => item.tenant_id === tenantId)
    );
  });
}

export async function getCustomerActivities(tenantIds: string[]): Promise<ProjectActivity[]> {
  try {
    const activities = (await readRecords("tenant_activities.json")) as ProjectActivity[];
    if (tenantIds.length === 0) return activities;
    const matched = activities.filter((act) => tenantIds.includes(act.tenant_id));
    return matched.length > 0 ? matched : activities;
  } catch (error) {
    console.error("Failed to load customer activities", error);
    return [];
  }
}

export async function getCustomerPhotos(tenantIds: string[]): Promise<ProjectPhoto[]> {
  try {
    const photos = (await readRecords("tenant_photos.json")) as ProjectPhoto[];
    if (tenantIds.length === 0) return photos;
    const matched = photos.filter((photo) => tenantIds.includes(photo.tenant_id));
    return matched.length > 0 ? matched : photos;
  } catch (error) {
    console.error("Failed to load customer photos", error);
    return [];
  }
}