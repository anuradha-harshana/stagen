import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
  getGovernanceSettings,
  saveGovernanceSettings,
} from "@/lib/company-management/governanceSettings";

import { getCompanyPortalSection, saveCompanyPortalSection } from "@/lib/company/companySettings";
import { exclusive } from "@/lib/supervisor/store";

// GET: Fetch governance settings
export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(["company-management", "company"]);
    const section = req.nextUrl.searchParams.get("section");
    if (section && !["profile", "billing", "notifications"].includes(section)) return NextResponse.json({ error: "Unknown section" }, { status: 400 });
    if (section) return NextResponse.json({ data: await getCompanyPortalSection(user.companyId || user.id, section) });
    const settings = await getGovernanceSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// PUT: Save updated settings
export async function PUT(req: NextRequest) {
  try {
    const user = await requireRole(["company-management", "company"]);
    const section = req.nextUrl.searchParams.get("section");
    if (section && !["profile", "billing", "notifications"].includes(section)) return NextResponse.json({ error: "Unknown section" }, { status: 400 });
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }

    if (section) return NextResponse.json({ data: await exclusive(() => saveCompanyPortalSection(user.companyId || user.id, section, body)) });
    const updated = await saveGovernanceSettings(body);
    return NextResponse.json({ settings: updated, message: "Settings saved successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
