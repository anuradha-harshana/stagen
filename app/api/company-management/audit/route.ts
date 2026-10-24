import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
  getCompanyAuditData,
  createAuditLog,
  updateAuditLog,
  deleteAuditLog,
  updateComplianceStats,
  updateComplianceCategory,
} from "@/lib/company-management/audit";

// GET: Fetch company audit logs, stats, and compliance readiness
export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(["company-management", "company"]);
    const { searchParams } = new URL(request.url);

    const companyId =
      searchParams.get("companyId") ||
      (user as { companyId?: string }).companyId ||
      user.id;

    const data = await getCompanyAuditData(companyId);

    // Optional query filtering
    const search = searchParams.get("search");
    const moduleFilter = searchParams.get("module");
    const severityFilter = searchParams.get("severity");

    let logs = data.logs ?? [];

    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.user.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      );
    }

    if (moduleFilter && moduleFilter !== "All") {
      logs = logs.filter((l) => l.module === moduleFilter);
    }

    if (severityFilter && severityFilter !== "All") {
      logs = logs.filter((l) => l.severity === severityFilter);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        logs,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve audit data:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unable to retrieve audit data" },
      { status: 500 }
    );
  }
}

// POST: Create a new audit log record
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["company-management", "company"]);
    const body = await request.json();

    const companyId =
      body.companyId ||
      (user as { companyId?: string }).companyId ||
      user.id;

    if (!body.action || !body.module || !body.details) {
      return NextResponse.json(
        { error: "action, module, and details are required fields" },
        { status: 400 }
      );
    }

    const newLog = await createAuditLog(companyId, {
      user: body.user || user.username || "Management Admin",
      role: body.role || "Company Management",
      action: body.action,
      module: body.module,
      details: body.details,
      ipAddress: body.ipAddress,
      severity: body.severity || "Info",
    });

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unable to create audit log" },
      { status: 500 }
    );
  }
}

// PUT: Update an audit log or compliance stats
export async function PUT(request: NextRequest) {
  try {
    const user = await requireRole(["company-management", "company"]);
    const body = await request.json();

    const companyId =
      body.companyId ||
      (user as { companyId?: string }).companyId ||
      user.id;

    if (body.type === "category" && body.categoryId && typeof body.score === "number") {
      const updated = await updateComplianceCategory(
        companyId,
        body.categoryId,
        body.score
      );
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.type === "stats" && body.stats) {
      const updated = await updateComplianceStats(companyId, body.stats);
      return NextResponse.json({ success: true, data: updated });
    }

    if (!body.id || !body.updates) {
      return NextResponse.json(
        { error: "Log id and updates payload are required" },
        { status: 400 }
      );
    }

    const updatedLog = await updateAuditLog(companyId, body.id, body.updates);
    if (!updatedLog) {
      return NextResponse.json(
        { error: `Audit log with id ${body.id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, log: updatedLog });
  } catch (error) {
    console.error("Failed to update audit log:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unable to update audit log" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an audit log record
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireRole(["company-management", "company"]);
    const { searchParams } = new URL(request.url);

    let id = searchParams.get("id");
    let companyId =
      searchParams.get("companyId") ||
      (user as { companyId?: string }).companyId ||
      user.id;

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
        if (body.companyId) companyId = body.companyId;
      } catch {
        // No body provided
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Audit log ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteAuditLog(companyId, id);
    if (!deleted) {
      return NextResponse.json(
        { error: `Audit log with id ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Audit log ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Failed to delete audit log:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unable to delete audit log" },
      { status: 500 }
    );
  }
}
