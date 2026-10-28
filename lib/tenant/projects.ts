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
    clientUserId: tenant.client_user_id,
    clientName: String(tenant.client_name ?? ""),
    address: String(tenant.address ?? ""),
    status: stages.length && stages.every(s => s.status === "Completed") ? "Completed" : tenant.status === "Completed" ? "On Track" : toStatus(String(tenant.status ?? "On Track")),
    progress: stages.length ? Math.round(stages.reduce((n, s) => n + s.progress, 0) / stages.length) : 0,
    currentStage: (stages.find(s => s.status === "Active") ?? stages.find(s => s.status === "Pending") ?? stages.at(-1))?.name ?? "",
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
    supervisorId: assignment?.user_id,
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
      const assignment = assignments.find((item) => item.tenant_id === tenantId && item.role === "supervisor");
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
  const existing = tenants.find(item => item.tenant_id === tenantId);
  if (existing && existing.company_id !== companyId) throw new Error("Project ID is already in use");
  const users = JSON.parse(await fs.readFile(usersFile, "utf8")) as RecordValue[];
  if (payload.assignment && !users.some(u => u.id === payload.assignment!.user_id && u.role === "supervisor" && u.companyId === companyId)) throw new Error("Invalid supervisor");
  if (payload.tenant.client_user_id && !users.some(u => u.id === payload.tenant.client_user_id && u.role === "customer" && u.companyId === companyId)) throw new Error("Invalid customer");
  const previousStages = stageRecords.find(item => item.tenant_id === tenantId)?.stages ?? [];
  payload.stages.stages = payload.stages.stages.map((stage: RecordValue) => ({ ...previousStages.find((old: RecordValue) => old.name === stage.name), ...stage }));
  const previousTimeline = timelines.find(item => item.tenant_id === tenantId);
  if (previousTimeline) payload.timeline = { ...previousTimeline, ...payload.timeline, original_est_completion: previousTimeline.original_est_completion, stages: previousTimeline.stages };
  const now = new Date().toISOString();
  const tenant: RecordValue = {
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

  const normalizedStages = payload.stages.stages as RecordValue[];
  tenant.progress = normalizedStages.length ? Math.round(normalizedStages.reduce((n, s) => n + Number(s.progress || 0), 0) / normalizedStages.length) : 0;
  tenant.current_stage = (normalizedStages.find(s => s.status === "Active") ?? normalizedStages.find(s => s.status === "Pending") ?? normalizedStages.at(-1))?.name ?? "";
  tenant.status = normalizedStages.length && normalizedStages.every(s => s.status === "Completed") ? "Completed" : tenant.status === "Completed" ? "On Track" : tenant.status;
  payload.timeline.percentage = tenant.progress;
  replace(tenants, tenant);
  replace(stageRecords, { ...payload.stages, tenant_id: tenantId });
  replace(timelines, { ...payload.timeline, tenant_id: tenantId });

  const assignmentIndex = assignments.findIndex((item) => item.tenant_id === tenantId && item.role === "supervisor");
  if (payload.assignment) {
    const assignment = {
      ...payload.assignment,
      id: payload.assignment.id || `assign-${crypto.randomUUID()}`,
      tenant_id: tenantId,
      role: "supervisor",
    };
    if (assignmentIndex === -1) assignments.push(assignment);
    else assignments[assignmentIndex] = assignment;
  } else if (assignmentIndex !== -1) {
    assignments.splice(assignmentIndex, 1);
  }

  if (Object.hasOwn(payload.tenant, "client_user_id")) {
    for (let i = assignments.length - 1; i >= 0; i--) if (assignments[i].tenant_id === tenantId && assignments[i].role === "customer") assignments.splice(i, 1);
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
    { ...assignments.find((item) => item.tenant_id === tenantId && item.role === "supervisor"), user_name: users.find(u => u.id === payload.assignment?.user_id)?.username },
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

  const customerAssignments = new Set(assignments.filter(a => a.user_id === userId && a.role === "customer").map(a => a.tenant_id));
  const customerTenants = tenants.filter(t => (t.client_user_id === userId || customerAssignments.has(t.tenant_id)) && (!companyId || t.company_id === companyId));

  return customerTenants.map((tenant) => {
    const tenantId = tenant.tenant_id;
    const assignment = assignments.find((item) => item.tenant_id === tenantId && item.role === "supervisor");
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
    if (tenantIds.length === 0) return [];
    const matched = activities.filter((act) => tenantIds.includes(act.tenant_id));
    return matched;
  } catch (error) {
    console.error("Failed to load customer activities", error);
    return [];
  }
}

export async function getCustomerPhotos(tenantIds: string[]): Promise<ProjectPhoto[]> {
  try {
    const photos = (await readRecords("tenant_photos.json")) as ProjectPhoto[];
    if (tenantIds.length === 0) return [];
    const matched = photos.filter((photo) => tenantIds.includes(photo.tenant_id));
    return matched;
  } catch (error) {
    console.error("Failed to load customer photos", error);
    return [];
  }
}
export async function getCustomerDocuments(userId: string, companyId?: string) {
  const projects = await getCustomerProjects(userId, companyId);
  const ids = new Set(projects.map(p => tenantIdFromProjectId(p.id)));
  return (await readRecords("tenant_documents.json")).filter(d => ids.has(d.tenant_id) && ["customer", "all"].includes(String(d.visibility).toLowerCase())).map(d => ({ id: String(d.id), name: String(d.title ?? d.file_name), type: String(d.file_type ?? ""), size: String(d.file_size ?? ""), date: String(d.date_of_update ?? ""), category: String(d.category ?? "Document"), url: String(d.url ?? d.file_url ?? "") }));
}
