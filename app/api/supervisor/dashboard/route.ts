import { NextRequest, NextResponse } from "next/server";
import { getSupervisorDashboardData } from "@/lib/tenant/tenantData";

export async function GET(req: NextRequest) {
  const supervisorId = req.nextUrl.searchParams.get("supervisorId");

  if (!supervisorId) {
    return NextResponse.json(
      { message: "Missing supervisorId query parameter" },
      { status: 400 }
    );
  }

  try {
    const dashboardData = await getSupervisorDashboardData(supervisorId);
    return NextResponse.json(dashboardData);
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to load supervisor dashboard data" },
      { status: 500 }
    );
  }
}
