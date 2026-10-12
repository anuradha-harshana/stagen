import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
  getCompanyLocalisationData,
  createTranslationKey,
  updateTranslationKey,
  deleteTranslationKey,
  updateLocalisationSettings,
  TranslationKey,
} from "@/lib/company/localisation";

export async function GET() {
  const company = await requireRole(["company"]);
  const data = await getCompanyLocalisationData(company.id);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const company = await requireRole(["company"]);
  const body = (await request.json()) as any;

  // Handle settings update if sent in POST
  if (body?.settings) {
    const updatedSettings = await updateLocalisationSettings(company.id, body.settings);
    return NextResponse.json({ settings: updatedSettings });
  }

  // Handle new translation key creation
  if (!body?.key || !body?.enAU) {
    return NextResponse.json(
      { error: "Key and English (enAU) translation are required" },
      { status: 400 }
    );
  }

  const newKey = await createTranslationKey(company.id, {
    key: body.key,
    category: body.category || "General",
    enAU: body.enAU,
    zhCN: body.zhCN,
    viVN: body.viVN,
    esES: body.esES,
    status: body.status || "Translated",
  });

  return NextResponse.json({ key: newKey }, { status: 201 });
}

export async function PUT(request: Request) {
  const company = await requireRole(["company"]);
  const body = (await request.json()) as TranslationKey;

  if (!body?.id || !body?.key || !body?.enAU) {
    return NextResponse.json(
      { error: "Valid translation key with id, key, and enAU is required" },
      { status: 400 }
    );
  }

  const updatedKey = await updateTranslationKey(company.id, body);
  if (!updatedKey) {
    return NextResponse.json({ error: "Translation key not found" }, { status: 404 });
  }

  return NextResponse.json({ key: updatedKey });
}

export async function DELETE(request: Request) {
  const company = await requireRole(["company"]);
  const searchParams = new URL(request.url).searchParams;
  const keyId = searchParams.get("id");

  if (!keyId) {
    return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
  }

  const deleted = await deleteTranslationKey(company.id, keyId);
  if (!deleted) {
    return NextResponse.json({ error: "Translation key not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
