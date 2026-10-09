import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
	createStageTemplate,
	deleteStageTemplate,
	getStageTemplates,
	reorderStageTemplates,
	updateStageTemplate,
} from "@/lib/company/company";

type StageInput = {
	id?: string;
	name: string;
	weight: number;
	description?: string;
	checklist?: { id: string; label: string }[];
};

function isValidStageInput(value: unknown): value is StageInput {
	if (!value || typeof value !== "object") return false;
	const stage = value as Partial<StageInput>;
	return (
		typeof stage.name === "string" &&
		stage.name.trim().length > 0 &&
		typeof stage.weight === "number" &&
		stage.weight >= 0 &&
		stage.weight <= 100 &&
		(stage.checklist === undefined || Array.isArray(stage.checklist))
	);
}

export async function GET(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const searchCompanyId = new URL(request.url).searchParams.get("companyId");
	const companyId = searchCompanyId || user.companyId || user.id;
	const stages = await getStageTemplates(companyId);

	return NextResponse.json({ stages });
}

export async function POST(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const body = (await request.json()) as unknown;

	if (!isValidStageInput(body)) {
		return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
	}

	const stage = await createStageTemplate(companyId, {
		name: body.name.trim(),
		weight: body.weight,
		description: body.description?.trim(),
		checklist: body.checklist ?? [],
	});

	return NextResponse.json({ stage }, { status: 201 });
}

export async function PUT(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const body = (await request.json()) as unknown;

	if (
		body &&
		typeof body === "object" &&
		Array.isArray((body as { order?: unknown }).order)
	) {
		const order = (body as { order: unknown[] }).order;
		if (!order.every((stageId) => typeof stageId === "string")) {
			return NextResponse.json({ error: "Invalid stage order" }, { status: 400 });
		}

		const stages = await reorderStageTemplates(companyId, order as string[]);
		if (!stages) return NextResponse.json({ error: "Invalid stage order" }, { status: 400 });
		return NextResponse.json({ stages });
	}

	if (
		!body ||
		typeof body !== "object" ||
		typeof (body as { stageId?: unknown }).stageId !== "string" ||
		!isValidStageInput((body as { stage?: unknown }).stage)
	) {
		return NextResponse.json({ error: "Invalid stage update" }, { status: 400 });
	}

	const update = body as { stageId: string; stage: StageInput };
	const stage = await updateStageTemplate(companyId, update.stageId, {
		name: update.stage.name.trim(),
		weight: update.stage.weight,
		description: update.stage.description?.trim(),
		checklist: update.stage.checklist ?? [],
	});

	if (!stage) return NextResponse.json({ error: "Stage not found" }, { status: 404 });
	return NextResponse.json({ stage });
}

export async function DELETE(request: Request) {
	const user = await requireRole(["company", "company-management"]);
	const companyId = user.companyId || user.id;
	const searchParams = new URL(request.url).searchParams;
	const stageId = searchParams.get("stageId");
	const checklistId = searchParams.get("checklistId") ?? undefined;

	if (!stageId) return NextResponse.json({ error: "stageId is required" }, { status: 400 });

	const deleted = await deleteStageTemplate(companyId, stageId, checklistId);
	if (!deleted) return NextResponse.json({ error: "Template not found" }, { status: 404 });

	return new NextResponse(null, { status: 204 });
}
