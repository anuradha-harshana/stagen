import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
  getGovernanceSettings,
  saveGovernanceSettings,
} from "@/lib/company-management/governanceSettings";

// GET: Fetch governance settings
export async function GET() {
  try {
    await requireRole(["company-management", "company"]);
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
    await requireRole(["company-management", "company"]);
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }

    const updated = await saveGovernanceSettings(body);
    return NextResponse.json({ settings: updated, message: "Settings saved successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
