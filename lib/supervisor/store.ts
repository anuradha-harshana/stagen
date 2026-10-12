import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Existing seed files have heterogeneous records and may contain a singleton.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;
export const files = {
  projects: "tenants/tenants.json", assignments: "tenants/tenant_assignments.json",
  stages: "tenants/tenant_stages.json", timeline: "tenants/tenant_timelines.json",
  delays: "tenants/tenant_delays.json", messages: "tenants/tenant_delay_messages.json",
  questions: "tenants/tenant_questions.json", documents: "tenants/tenant_documents.json",
  photos: "tenants/tenant_photos.json", activities: "tenants/tenant_activities.json",
  notifications: "notifications/notiffications.json", profile: "users/user_profiles.json",
  settings: "users/user_settings.json", users: "users/users.json", sessions: "sessions/sessions.json",
} as const;
export type Table = keyof typeof files;
const filename = (table: Table) => path.join(process.cwd(), "data", files[table]);
export async function read(table: Table): Promise<Row[]> {
  const value = JSON.parse(await fs.readFile(filename(table), "utf8"));
  return Array.isArray(value) ? value : [value];
}
export async function write(table: Table, rows: Row[]) {
  const target = filename(table);
  const previous = JSON.parse(await fs.readFile(target, "utf8"));
  const temp = `${target}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temp, JSON.stringify(!Array.isArray(previous) && rows.length === 1 ? rows[0] : rows, null, 2) + "\n");
    await fs.rename(temp, target);
  } finally {
    await fs.rm(temp, { force: true });
  }
}

// Serialize read/modify/write operations across supervisor routes in this process.
const state = globalThis as typeof globalThis & { supervisorWrites?: Promise<unknown> };
export function exclusive<T>(operation: () => Promise<T>): Promise<T> {
  const next = (state.supervisorWrites ?? Promise.resolve()).then(operation);
  state.supervisorWrites = next.catch(() => undefined);
  return next;
}
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function assignedProjects(userId: string) {
  const [assignments, projects] = await Promise.all([read("assignments"), read("projects")]);
  const ids = new Set(assignments.filter(a => a.user_id === userId && a.role === "supervisor").map(a => a.tenant_id));
  return projects.filter(p => ids.has(p.tenant_id));
}
export async function requireProject(userId: string, tenantId: string) {
  const project = (await assignedProjects(userId)).find(p => p.tenant_id === tenantId);
  if (!project) throw new ApiError(404, "Assigned project not found");
  return project;
}
export async function scopedRows(table: Table, userId: string) {
  const ids = new Set((await assignedProjects(userId)).map(p => p.tenant_id));
  return (await read(table)).filter(r => ids.has(r.tenant_id));
}
export async function findRecord(table: Table, userId: string, id: string) {
  const rows = await read(table);
  const record = rows.find(r => String(r.id) === id);
  if (!record) throw new ApiError(404, "Record not found");
  await requireProject(userId, record.tenant_id);
  return { rows, record };
}
export async function activity(userId: string, tenantId: string, title: string, description = "") {
  const rows = await read("activities");
  rows.unshift({ id: randomUUID(), tenant_id: tenantId, title, description, date: new Date().toISOString(), stage_id: "", stage_name: "", type: "supervisor", created_by: userId });
  await write("activities", rows);
}
export async function notify(userId: string, tenantId: string, title: string, description: string, category: string, entityType: string, entityId: string) {
  if (!userId) return;
  const rows = await read("notifications");
  rows.unshift({ id: randomUUID(), user_id: userId, tenant_id: tenantId, title, description, time: new Date().toISOString(), created_at: new Date().toISOString(), category, read: false, source_entity_type: entityType, source_entity_id: entityId });
  await write("notifications", rows);
}
