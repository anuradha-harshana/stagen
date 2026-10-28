import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyProfile, updateCompanyProfile } from "@/lib/company/companyProfile";

export async function GET() {
  try {
    const user = await requireRole(["company"]);
    const companyId = user.companyId || user.id;
    const profile = await getCompanyProfile(companyId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/company/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch company profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireRole(["company"]);
    const companyId = user.companyId || user.id;
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
    }

    const updatedProfile = await updateCompanyProfile(companyId, body);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("PUT /api/company/profile error:", error);
    return NextResponse.json({ error: "Failed to update company profile" }, { status: 500 });
  }
}
