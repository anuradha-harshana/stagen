import { z } from "zod";
import { randomUUID } from "node:crypto";
import { activity, ApiError, assignedProjects, findRecord, read, requireProject, Row, scopedRows, write } from "./store";

const text = z.string().trim().min(1).max(10000);
const date = z.string().refine(v => Number.isFinite(Date.parse(v)), "Invalid date");
export async function projects(userId: string) {
  const [tenants, stages, delays, questions, users] = await Promise.all([assignedProjects(userId), read("stages"), read("delays"), read("questions"), read("users")]);
  return tenants.map(p => ({ customerEmail: users.find(u => u.id === p.client_user_id)?.email ?? "", id: p.tenant_id, lot: p.display_name, clientName: p.client_name, address: p.address, status: p.status, progress: p.progress, currentStage: p.current_stage, startDate: p.start_date, estHandover: p.est_handover, imageGradient: "from-blue-fantastic/40 to-abyssal-blue/80",
    stages: stages.find(s => s.tenant_id === p.tenant_id)?.stages ?? [],
    delays: delays.filter(d => d.tenant_id === p.tenant_id).map(d => ({ id: d.id, type: d.type, durationDays: d.duration_days, description: d.reason, date: d.date })),
    questions: questions.filter(q => q.tenant_id === p.tenant_id).map(q => ({ id: q.id, customerName: q.customer_name, questionText: q.question_title, date: q.date_asked, replied: q.status === "ANSWERED", replyText: q.answer_text })) }));
}
export const delayView = (d: Row) => ({ id: d.id, date: d.date, stageName: d.stage_name, title: d.title, fromDate: d.from_date, toDate: d.to_date, reason: d.reason, type: ({ weather: "weather", materials: "materials", inspections: "permits", "trade availability": "labor" } as Record<string, string>)[String(d.type).toLowerCase()] ?? String(d.type).toLowerCase() });
const stageId = (s: Row) => s.id ?? s.name.toLowerCase().replaceAll(" ", "-");
export async function timelines(userId: string) {
  const [ps, ts, ss, ds] = await Promise.all([assignedProjects(userId), read("timeline"), read("stages"), read("delays")]);
  return Object.fromEntries(ps.map(p => {
    const t = ts.find(t => t.tenant_id === p.tenant_id) ?? {};
    const stages = ss.find(s => s.tenant_id === p.tenant_id)?.stages ?? [];
    const saved = t.stages ?? [];
    return [p.tenant_id, { percentage: p.progress, startDate: t.start_date ?? p.start_date, originalEstCompletion: t.original_est_completion ?? p.est_handover, currentProjectedCompletion: t.current_projected_completion ?? p.est_handover, statusFlag: p.status === "Delayed" ? "delayed" : p.progress === 0 ? "not-started" : "on-track", delayDays: t.delay_days ?? 0,
      stages: stages.map((s: Row) => ({ id: stageId(s), name: s.name, description: s.description ?? "", plannedStart: s.start_date ?? new Date(p.start_date).toISOString().slice(0, 10), plannedEnd: s.end_date ?? new Date(p.est_handover).toISOString().slice(0, 10), milestones: s.milestones ?? [], ...saved.find((v: Row) => v.id === stageId(s)), status: s.status === "Completed" ? (saved.find((v: Row) => v.id === stageId(s))?.status === "completed-late" ? "completed-late" : "completed-on-time") : s.status === "Active" ? (saved.find((v: Row) => v.id === stageId(s))?.status === "delayed" ? "delayed" : "in-progress") : "upcoming" })),
      delayLog: ds.filter(d => d.tenant_id === p.tenant_id).map(delayView) }];
  }));
}
async function syncProgress(tenantId: string, stages: Row[]) {
  const ps = await read("projects");
  const p = ps.find(p => p.tenant_id === tenantId)!;
  p.progress = stages.length ? Math.round(stages.reduce((n, s) => n + s.progress, 0) / stages.length) : 0;
  p.current_stage = (stages.find(s => s.status === "Active") ?? stages.at(-1))?.name ?? p.current_stage;
  if (p.progress === 100) p.status = "Completed";
  else if (p.status === "Completed") p.status = "On Track";
  await write("projects", ps);
  const ts = await read("timeline");
  const t = ts.find(t => t.tenant_id === tenantId);
  if (t) { t.percentage = p.progress; t.status_flag = p.status === "Delayed" ? "delayed" : "on-track"; await write("timeline", ts); }
}
export async function updateStage(userId: string, body: unknown) {
  const b = z.object({ tenantId: text, stageName: text, checklist: z.array(z.object({ id: text, completed: z.boolean() })).optional(), progress: z.number().min(0).max(100).optional(), complete: z.boolean().optional() }).parse(body);
  await requireProject(userId, b.tenantId);
  const rows = await read("stages");
  const stages: Row[] = rows.find(r => r.tenant_id === b.tenantId)?.stages ?? [];
  const s = stages.find(s => s.name === b.stageName);
  if (!s) throw new ApiError(404, "Stage not found");
  if (b.checklist) {
    if (b.checklist.length !== s.checklist.length || new Set(b.checklist.map(c => c.id)).size !== b.checklist.length || b.checklist.some(c => !s.checklist.some((v: Row) => v.id === c.id))) throw new ApiError(400, "Checklist does not match the stage");
    s.checklist = s.checklist.map((c: Row) => ({ ...c, completed: b.checklist!.find(v => v.id === c.id)!.completed }));
    s.progress = s.checklist.length ? Math.round(s.checklist.filter((c: Row) => c.completed).length / s.checklist.length * 100) : b.progress ?? s.progress;
  } else if (b.progress !== undefined && !s.checklist.length) s.progress = b.progress;
  if (b.complete) {
    if (s.status !== "Active" || s.progress !== 100) throw new ApiError(400, "Complete the active stage checklist first");
    s.status = "Completed";
    const next = stages[stages.indexOf(s) + 1];
    if (next && next.status !== "Completed") next.status = "Active";
  }
  await write("stages", rows);
  await syncProgress(b.tenantId, stages);
  await activity(userId, b.tenantId, `Updated ${s.name} stage`);
}
export async function updateTimeline(userId: string, body: unknown) {
  const milestone = z.object({ name: text, date, type: z.enum(["inspection", "approval", "delivery", "delay"]), status: z.enum(["completed", "pending", "scheduled"]) });
  const b = z.object({ tenantId: text, stages: z.array(z.object({ id: text, name: text, description: z.string(), plannedStart: date, plannedEnd: date, actualStart: date.optional(), actualEnd: date.optional(), status: z.enum(["completed-on-time", "completed-late", "in-progress", "upcoming", "delayed"]), milestones: z.array(milestone) })) }).parse(body);
  const p = await requireProject(userId, b.tenantId);
  const ss = await read("stages");
  const stages: Row[] = ss.find(s => s.tenant_id === b.tenantId)?.stages ?? [];
  if (b.stages.length !== stages.length || new Set(b.stages.map(s => s.id)).size !== stages.length) throw new ApiError(400, "Stage list does not match the project");
  for (const v of b.stages) {
    const s = stages.find(s => stageId(s) === v.id && s.name === v.name);
    if (!s) throw new ApiError(400, "Unknown stage");
    if (Date.parse(v.plannedEnd) < Date.parse(v.plannedStart) || (v.actualStart && v.actualEnd && Date.parse(v.actualEnd) < Date.parse(v.actualStart))) throw new ApiError(400, "End date must follow start date");
    s.status = v.status.startsWith("completed") ? "Completed" : ["in-progress", "delayed"].includes(v.status) ? "Active" : "Pending";
    s.progress = s.status === "Completed" ? 100 : s.status === "Pending" ? 0 : Math.min(s.progress, 99);
    if (s.status === "Completed") s.checklist = s.checklist.map((c: Row) => ({ ...c, completed: true }));
    s.start_date = v.plannedStart; s.end_date = v.plannedEnd; s.milestones = v.milestones;
  }
  const ts = await read("timeline");
  let t = ts.find(t => t.tenant_id === b.tenantId);
  if (!t) { t = { tenant_id: b.tenantId, start_date: p.start_date, original_est_completion: p.est_handover, delay_days: 0 }; ts.push(t); }
  t.stages = b.stages;
  t.current_projected_completion = b.stages.at(-1)?.actualEnd ?? b.stages.at(-1)?.plannedEnd ?? p.est_handover;
  await write("timeline", ts); await write("stages", ss);
  await syncProgress(b.tenantId, stages);
  const ps = await read("projects");
  ps.find(p => p.tenant_id === b.tenantId)!.est_handover = t.current_projected_completion;
  await write("projects", ps);
  await activity(userId, b.tenantId, "Updated project timeline");
}
export async function syncDelays(tenantId: string) {
  const ds = (await read("delays")).filter(d => d.tenant_id === tenantId);
  const days = ds.reduce((n, d) => n + (d.duration_days ?? 0), 0);
  const ts = await read("timeline");
  const ps = await read("projects");
  const p = ps.find(p => p.tenant_id === tenantId)!;
  const t = ts.find(t => t.tenant_id === tenantId);
  p.status = p.progress === 100 ? "Completed" : days ? "Delayed" : "On Track";
  if (t) {
    t.delay_days = days; t.status_flag = days ? "delayed" : "on-track";
    const original = new Date(t.original_est_completion);
    if (Number.isFinite(original.getTime())) { original.setUTCDate(original.getUTCDate() + days); t.current_projected_completion = original.toISOString().slice(0, 10); p.est_handover = t.current_projected_completion; }
    await write("timeline", ts);
  }
  await write("projects", ps);
}
export async function mutateDelay(userId: string, method: string, body: unknown) {
  if (method === "DELETE") {
    const { id } = z.object({ id: text }).parse(body);
    const { rows, record } = await findRecord("delays", userId, id);
    await write("delays", rows.filter(r => r !== record)); await syncDelays(record.tenant_id); return;
  }
  const b = z.object({ id: z.union([z.string(), z.number()]).optional(), tenantId: text, stageName: text, title: text, fromDate: date, toDate: date, reason: text, type: z.enum(["weather", "materials", "permits", "machinery", "labor"]) }).parse(body);
  await requireProject(userId, b.tenantId);
  const stageRows = await read("stages");
  if (!stageRows.find(r => r.tenant_id === b.tenantId)?.stages.some((s: Row) => s.name === b.stageName) && !(method !== "POST" && (await read("delays")).some(d => String(d.id) === String(b.id) && d.tenant_id === b.tenantId && d.stage_name === b.stageName))) throw new ApiError(400, "Unknown stage");
  const duration = Math.ceil((Date.parse(b.toDate) - Date.parse(b.fromDate)) / 86400000);
  if (duration < 0) throw new ApiError(400, "End date must follow start date");
  const rows = await read("delays");
  let record: Row;
  if (method === "POST") { record = { id: randomUUID(), tenant_id: b.tenantId, date: new Date().toISOString(), created_by: userId }; rows.unshift(record); }
  else { record = rows.find(r => String(r.id) === String(b.id) && r.tenant_id === b.tenantId)!; if (!record) throw new ApiError(404, "Delay not found"); }
  Object.assign(record, { stage_name: b.stageName, title: b.title, from_date: b.fromDate, to_date: b.toDate, reason: b.reason, type: b.type, duration_days: duration });
  await write("delays", rows); await syncDelays(b.tenantId);
  await activity(userId, b.tenantId, `Delay: ${b.title}`, b.reason);
  return delayView(record);
}
export async function postNote(userId: string, body: unknown) {
  const b = z.object({ tenantId: text, text }).parse(body);
  await requireProject(userId, b.tenantId); await activity(userId, b.tenantId, "Progress note", b.text);
}
export async function getDelays(userId: string) { return (await scopedRows("delays", userId)).map(d => ({ ...delayView(d), tenantId: d.tenant_id })); }
