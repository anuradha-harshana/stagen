import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyReports, saveCompanyReports } from "@/lib/reports/reports";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["company-management", "company"]);
    const { searchParams } = new URL(request.url);
    const companyId =
      searchParams.get("companyId") ||
      (user as { companyId?: string }).companyId ||
      user.id;
    const timeframe = searchParams.get("timeframe") || "Q2 2026";
    const region = searchParams.get("region") || "All";

    const reports = await getCompanyReports(companyId, timeframe, region);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Failed to retrieve company reports:", error);
    return NextResponse.json(
      { error: "Unable to retrieve company reports data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["company-management", "company"]);
    const body = await request.json();
    const companyId =
      body.companyId ||
      (user as { companyId?: string }).companyId ||
      user.id;
    const timeframe = body.timeframe || "Q2 2026";

    if (!body.data) {
      return NextResponse.json(
        { error: "Missing data payload" },
        { status: 400 }
      );
    }

    const updated = await saveCompanyReports(companyId, body.data, timeframe);
    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error("Failed to update company reports:", error);
    return NextResponse.json(
      { error: "Unable to update reports data" },
      { status: 500 }
    );
  }
}
