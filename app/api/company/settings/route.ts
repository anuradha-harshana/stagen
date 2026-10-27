import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import { getCompanySettings, updateCompanySettings } from "@/lib/company/companySettings";

export async function GET() {
  try {
    const user = await requireRole(["company"]);
    const companyId = user.companyId || user.id;
    const settings = await getCompanySettings(companyId);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/company/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch company settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireRole(["company"]);
    const companyId = user.companyId || user.id;
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    const updatedSettings = await updateCompanySettings(companyId, body);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("PUT /api/company/settings error:", error);
    return NextResponse.json({ error: "Failed to update company settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return PUT(request);
}
