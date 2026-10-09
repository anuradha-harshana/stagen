import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
	deleteCompanyProject,
	getCompanyProjects,
	ProjectPayload,
	saveCompanyProject,
} from "@/lib/tenant/projects";

export async function GET() {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	return NextResponse.json({ projects: await getCompanyProjects(companyId) });
}

export async function POST(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const payload = (await request.json()) as ProjectPayload;

	if (!payload?.project?.id || !payload.tenant || !payload.stages || !payload.timeline) {
		return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
	}

	const project = await saveCompanyProject(companyId, payload);
	return NextResponse.json({ project }, { status: 201 });
}

export async function PUT(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const payload = (await request.json()) as ProjectPayload;

	if (!payload?.project?.id || !payload.tenant || !payload.stages || !payload.timeline) {
		return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
	}

	const existing = (await getCompanyProjects(companyId)).some(
		(project) => project.id === payload.project.id
	);
	if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });

	const project = await saveCompanyProject(companyId, payload);
	return NextResponse.json({ project });
}

export async function DELETE(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const projectId = new URL(request.url).searchParams.get("projectId");
	if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

	const deleted = await deleteCompanyProject(companyId, projectId);
	if (!deleted) return NextResponse.json({ error: "Project not found" }, { status: 404 });
	return new NextResponse(null, { status: 204 });
}
