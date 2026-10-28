import { NextRequest, NextResponse } from "next/server";
import { getCustomerProjects } from "@/lib/tenant/projects";
import { ApiError } from "@/lib/customer/store";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getTenantWarranty,
  createTenantDefect,
  updateTenantDefect,
  deleteTenantDefect,
  createTenantWarranty,
  updateTenantWarranty,
  deleteTenantWarranty,
  createTenantMaintenance,
  updateTenantMaintenance,
  deleteTenantMaintenance,
} from "@/lib/customer/warranty";

// Helper: Resolve tenantId for current user or default
async function resolveTenantId(req: NextRequest, requestedId?: string): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new ApiError(401, "Sign in required");
  if (user.role !== "customer") throw new ApiError(403, "Customer access required");
  const projects = await getCustomerProjects(user.id, user.companyId);
  const tenantIds = projects.map(p => "tenant-" + p.id);
  const id = requestedId || req.nextUrl.searchParams.get("tenantId") || tenantIds[0];
  if (!id || !tenantIds.includes(id)) throw new ApiError(404, "Assigned project not found");
  return id;
}

// GET: Fetch tenant warranties, maintenance schedule, and defects
export async function GET(req: NextRequest) {
  try {
    const tenantId = await resolveTenantId(req);
    const warrantyData = await getTenantWarranty(tenantId);
    return NextResponse.json({ warrantyData });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: err instanceof ApiError ? err.status : 500 }
    );
  }
}

// POST: Report a defect, or add a warranty/maintenance entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = await resolveTenantId(req, body.tenantId);
    const user = await getCurrentUser();
    const type = body.type || "defect";

    if (type === "defect") {
      const defectPayload = body.data || body;
      if (!defectPayload.title || !defectPayload.area) {
        return NextResponse.json(
          { error: "Title and Area are required to report a defect" },
          { status: 400 }
        );
      }

      const newDefect = await createTenantDefect(tenantId, {
        title: defectPayload.title,
        area: defectPayload.area,
        status: defectPayload.status || "open",
        reported: defectPayload.reported,
        reported_by: user?.id || defectPayload.reported_by,
      });

      const warrantyData = await getTenantWarranty(tenantId);
      return NextResponse.json({ defect: newDefect, warrantyData }, { status: 201 });
    }

    if (type === "warranty") {
      const warrantyPayload = body.data || body;
      const newWarranty = await createTenantWarranty(tenantId, warrantyPayload);
      const warrantyData = await getTenantWarranty(tenantId);
      return NextResponse.json({ warranty: newWarranty, warrantyData }, { status: 201 });
    }

    if (type === "maintenance") {
      const maintenancePayload = body.data || body;
      const newMaintenance = await createTenantMaintenance(tenantId, maintenancePayload);
      const warrantyData = await getTenantWarranty(tenantId);
      return NextResponse.json({ maintenance: newMaintenance, warrantyData }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: err instanceof ApiError ? err.status : 500 }
    );
  }
}

// PUT: Update a defect, warranty item, or maintenance item
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = await resolveTenantId(req, body.tenantId);
    const type = body.type || "defect";
    const id = body.id;
    const updates = body.updates || {};

    if (!id) {
      return NextResponse.json({ error: "id is required for update" }, { status: 400 });
    }

    if (type === "defect") {
      const updated = await updateTenantDefect(tenantId, id, updates);
      if (!updated) {
        return NextResponse.json({ error: "Defect not found" }, { status: 404 });
      }
      const warrantyData = await getTenantWarranty(tenantId);
      return NextResponse.json({ defect: updated, warrantyData });
    }

    if (type === "warranty") {
      const updated = await updateTenantWarranty(tenantId, id, updates);
      if (!updated) {
        return NextResponse.json({ error: "Warranty item not found" }, { status: 404 });
      }
      const warrantyData = await getTenantWarranty(tenantId);
      return NextResponse.json({ warranty: updated, warrantyData });
    }

    if (type === "maintenance") {
      const updated = await updateTenantMaintenance(tenantId, id, updates);
      if (!updated) {
        return NextResponse.json({ error: "Maintenance item not found" }, { status: 404 });
      }
      const warrantyData = await getTenantWarranty(tenantId);
      return NextResponse.json({ maintenance: updated, warrantyData });
    }

    return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: err instanceof ApiError ? err.status : 500 }
    );
  }
}

// DELETE: Remove a defect, warranty, or maintenance item
export async function DELETE(req: NextRequest) {
  try {
    const tenantId = await resolveTenantId(req);
    const id = req.nextUrl.searchParams.get("id");
    const type = req.nextUrl.searchParams.get("type") || "defect";

    if (!id) {
      return NextResponse.json({ error: "ID query parameter required" }, { status: 400 });
    }

    let deleted = false;
    if (type === "defect") {
      deleted = await deleteTenantDefect(tenantId, id);
    } else if (type === "warranty") {
      deleted = await deleteTenantWarranty(tenantId, id);
    } else if (type === "maintenance") {
      deleted = await deleteTenantMaintenance(tenantId, id);
    }

    if (!deleted) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: err instanceof ApiError ? err.status : 500 }
    );
  }
}
