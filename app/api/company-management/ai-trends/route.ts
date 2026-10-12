import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
  getAiFaqTrends,
  updateAiFaqTrend,
} from "@/lib/company-management/aiTrends";

// GET: Fetch all AI FAQ trends
export async function GET() {
  try {
    await requireRole(["company-management", "company"]);
    const trends = await getAiFaqTrends();
    return NextResponse.json({ trends });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// PUT: Update an approved answer or status
export async function PUT(req: NextRequest) {
  try {
    await requireRole(["company-management", "company"]);
    const { id, updates } = await req.json();

    if (!id || !updates) {
      return NextResponse.json({ error: "id and updates required" }, { status: 400 });
    }

    const updatedTrend = await updateAiFaqTrend(id, updates);
    if (!updatedTrend) {
      return NextResponse.json({ error: "FAQ trend not found" }, { status: 404 });
    }

    return NextResponse.json({ trend: updatedTrend });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
