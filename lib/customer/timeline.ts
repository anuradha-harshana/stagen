import fs from "node:fs/promises";
import path from "node:path";
import type { CustomerTimelineProject, TimelineStage, TimelineMilestone, TimelinePageData, DelayLogEntry } from "./timelineTypes";

interface ProjectRecord {
  tenant_id: string; client_user_id?: string; display_name?: string; address?: string;
  progress?: number; status?: string; start_date?: string; est_handover?: string;
}
interface StageRecord {
  id?: string; name: string; description?: string; status?: string; progress?: number;
  start_date?: string; end_date?: string; plannedStart?: string; plannedEnd?: string;
  actualStart?: string; actualEnd?: string; milestones?: Partial<TimelineMilestone>[];
}
interface TimelineRecord {
  tenant_id: string; percentage?: number; start_date?: string; original_est_completion?: string;
  current_projected_completion?: string; status_flag?: string; delay_days?: number; stages?: StageRecord[];
}
interface DelayRecord {
  tenant_id: string; id: string | number; date: string; stage_name: string; title: string;
  from_date: string; to_date: string; reason: string; type: string; duration_days?: number; resolved?: boolean;
}
async function readRecords<T>(name: string): Promise<T[]> {
  const value = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "tenants", name), "utf8"));
  return Array.isArray(value) ? value : [value];
}
function date(value?: string): string {
  return value && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString().slice(0, 10) : "";
}
const stageId = (s: StageRecord) => s.id ?? s.name.toLowerCase().replaceAll(" ", "-");
function status(current?: string, saved?: string): TimelineStage["status"] {
  const value = (current ?? saved ?? "").toLowerCase();
  if (["completed", "completed-on-time", "completed-late"].includes(value)) return saved === "completed-late" || value === "completed-late" ? "completed-late" : "completed-on-time";
  if (value === "delayed") return "delayed";
  if (["active", "in-progress"].includes(value)) return saved === "delayed" ? "delayed" : "in-progress";
  return "upcoming";
}
const delayTypes: Record<string, DelayLogEntry["type"]> = {
  weather: "weather", materials: "materials", inspections: "permits", permits: "permits",
  machinery: "machinery", labor: "labor", "trade availability": "labor",
};

/** Read only projects linked by customer identity, never by a supplied user ID or matching name. */
export async function getCustomerTimelines(userId: string): Promise<CustomerTimelineProject[]> {
  const [projects, assignments, timelines, stageRecords, delays] = await Promise.all([
    readRecords<ProjectRecord>("tenants.json"),
    readRecords<{ tenant_id: string; user_id: string; role: string }>("tenant_assignments.json"),
    readRecords<TimelineRecord>("tenant_timelines.json"),
    readRecords<{ tenant_id: string; stages: StageRecord[] }>("tenant_stages.json"),
    readRecords<DelayRecord>("tenant_delays.json"),
  ]);
  const assigned = new Set(assignments.filter(a => a.user_id === userId && a.role === "customer").map(a => a.tenant_id));
  return projects.filter(p => p.client_user_id === userId || assigned.has(p.tenant_id)).map(p => {
    const timeline = timelines.find(t => t.tenant_id === p.tenant_id);
    const saved = timeline?.stages ?? [];
    const current = stageRecords.find(s => s.tenant_id === p.tenant_id)?.stages ?? [];
    const combined = current;
    const stages: TimelineStage[] = combined.map(s => {
      const schedule = saved.find(v => stageId(v) === stageId(s) || v.name === s.name);
      const milestones = (schedule?.milestones ?? s.milestones ?? []).filter(m => m.name && date(m.date)).map(m => ({
        name: m.name!, date: date(m.date), type: m.type ?? "inspection", status: m.status ?? "pending",
      }));
      return {
        id: stageId(s), name: s.name, description: schedule?.description ?? s.description ?? "",
        status: status(s.status, schedule?.status),
        plannedStart: date(schedule?.plannedStart ?? s.start_date ?? s.plannedStart),
        plannedEnd: date(schedule?.plannedEnd ?? s.end_date ?? s.plannedEnd),
        actualStart: date(schedule?.actualStart ?? s.actualStart) || undefined,
        actualEnd: date(schedule?.actualEnd ?? s.actualEnd) || undefined, milestones,
      };
    });
    const projectDelays = delays.filter(d => d.tenant_id === p.tenant_id);
    const percentage = current.length ? Math.round(current.reduce((n, s) => n + Number(s.progress || 0), 0) / current.length) : 0;
    const flag: TimelinePageData["statusFlag"] = p.status?.toLowerCase() === "delayed" ? "delayed" : percentage === 0 ? "not-started" : timeline?.status_flag === "ahead" ? "ahead" : "on-track";
    return {
      id: p.tenant_id, name: p.display_name ?? p.tenant_id, address: p.address ?? "",
      timeline: {
        percentage, startDate: date(timeline?.start_date ?? p.start_date),
        originalEstCompletion: date(timeline?.original_est_completion ?? p.est_handover),
        currentProjectedCompletion: date(timeline?.current_projected_completion ?? p.est_handover),
        statusFlag: flag, delayDays: timeline?.delay_days ?? projectDelays.reduce((sum, d) => sum + (d.resolved ? 0 : d.duration_days ?? 0), 0),
        stages, delayLog: projectDelays.map(d => ({ id: d.id, date: d.date, stageName: d.stage_name, title: d.title,
          fromDate: d.from_date, toDate: d.to_date, reason: d.reason, type: delayTypes[d.type.toLowerCase()] ?? "other" })),
      },
    };
  });
}
