import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getCompanyDashboard } from "@/lib/company/company";
import { exclusive } from "@/lib/supervisor/store";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
	deleteCompanyProject,
	getCompanyProjects,
	ProjectPayload,
	saveCompanyProject,
} from "@/lib/tenant/projects";

const payloadSchema = z.object({
  project: z.object({ id: z.string().trim().min(1) }).passthrough(),
  tenant: z.object({ client_name: z.string().trim().min(1), address: z.string().trim().min(1), start_date: z.string().refine(v => Number.isFinite(Date.parse(v))), est_handover: z.string().refine(v => Number.isFinite(Date.parse(v))) }).passthrough(),
  stages: z.object({ stages: z.array(z.object({ name: z.string().trim().min(1), status: z.enum(["Completed", "Active", "Pending"]), progress: z.number().min(0).max(100), checklist: z.array(z.object({ id: z.string(), label: z.string(), completed: z.boolean() })) })).min(1) }).passthrough(),
  timeline: z.object({}).passthrough(), assignment: z.object({ user_id: z.string().min(1), role: z.literal("supervisor") }).passthrough().nullable()
}).refine(p => Date.parse(p.tenant.est_handover) >= Date.parse(p.tenant.start_date), "Handover must follow start date")
.refine(p => new Set(p.stages.stages.map(s => s.name)).size === p.stages.stages.length, "Duplicate stages");

export async function GET(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	if (new URL(request.url).searchParams.get("view") === "dashboard") return NextResponse.json(await getCompanyDashboard(companyId));
	return NextResponse.json({ projects: await getCompanyProjects(companyId) });
}

export async function POST(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const payload = (await request.json()) as ProjectPayload;
  if (payload?.project && payload.tenant && payload.stages && payload.timeline) {
    const id = "lot-" + randomUUID();
    payload.project.id = id;
    payload.tenant.tenant_id = id;
    payload.stages.tenant_id = id;
    payload.timeline.tenant_id = id;
    if (payload.assignment) { payload.assignment.tenant_id = id; payload.assignment.id = "assign-" + randomUUID(); }
  }

	if (!payloadSchema.safeParse(payload).success) {
		return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
	}

	try {
    const project = await exclusive(async () => {
      if ((await getCompanyProjects(companyId)).some(p => p.id === payload.project.id.replace(/^tenant-/, ""))) throw new Error("Project ID already exists");
      return saveCompanyProject(companyId, payload);
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save project" }, { status: 400 }); }
}

export async function PUT(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const payload = (await request.json()) as ProjectPayload;

	if (!payloadSchema.safeParse(payload).success) {
		return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
	}

	const existing = (await getCompanyProjects(companyId)).some(
		(project) => project.id === payload.project.id
	);
	if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });

	try {
    const project = await exclusive(() => saveCompanyProject(companyId, payload));
    return NextResponse.json({ project });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save project" }, { status: 400 }); }
}

export async function DELETE(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const projectId = new URL(request.url).searchParams.get("projectId");
	if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

	const deleted = await exclusive(() => deleteCompanyProject(companyId, projectId));
	if (!deleted) return NextResponse.json({ error: "Project not found" }, { status: 404 });
	return new NextResponse(null, { status: 204 });
}
