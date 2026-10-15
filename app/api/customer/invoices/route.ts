import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getTenantInvoices,
  createTenantInvoice,
  updateTenantInvoice,
  payTenantInvoice,
  deleteTenantInvoice,
  updateTenantMilestone,
} from "@/lib/customer/invoices";

// Helper: Resolve tenantId for current user or default
async function resolveTenantId(req: NextRequest): Promise<string> {
  const urlTenantId = req.nextUrl.searchParams.get("tenantId");
  if (urlTenantId) return urlTenantId;

  const user = await getCurrentUser();
  // If user is customer Anuradha, her lot is tenant-lot-104
  if (user && user.role === "customer") {
    return "tenant-lot-104";
  }

  return "tenant-lot-104";
}

// GET: Fetch tenant invoices, milestones, and summary data
export async function GET(req: NextRequest) {
  try {
    const tenantId = await resolveTenantId(req);
    const invoicesData = await getTenantInvoices(tenantId);
    return NextResponse.json({ invoicesData });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// POST: Create a new invoice or process an invoice payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = body.tenantId || (await resolveTenantId(req));

    if (body.action === "pay") {
      if (!body.invoiceId) {
        return NextResponse.json({ error: "invoiceId is required for payment" }, { status: 400 });
      }
      const updatedData = await payTenantInvoice(tenantId, body.invoiceId);
      if (!updatedData) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }
      return NextResponse.json({ invoicesData: updatedData, message: "Invoice paid successfully" });
    }

    if (!body.description || body.amount === undefined || !body.due) {
      return NextResponse.json({ error: "Missing required invoice fields (description, amount, due)" }, { status: 400 });
    }

    const newInvoice = await createTenantInvoice(tenantId, {
      description: body.description,
      amount: body.amount,
      due: body.due,
      date: body.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: body.status || "Upcoming",
    });

    return NextResponse.json({ invoice: newInvoice }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// PUT: Update an invoice or milestone
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = body.tenantId || (await resolveTenantId(req));

    // Handle pay action via PUT as well
    if (body.action === "pay") {
      const invoiceId = body.id || body.invoiceId;
      if (!invoiceId) {
        return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });
      }
      const updatedData = await payTenantInvoice(tenantId, invoiceId);
      if (!updatedData) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }
      return NextResponse.json({ invoicesData: updatedData, message: "Invoice paid successfully" });
    }

    // Handle milestone update
    if (body.milestoneId) {
      const updatedMilestone = await updateTenantMilestone(tenantId, body.milestoneId, body.updates || {});
      if (!updatedMilestone) {
        return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
      }
      const invoicesData = await getTenantInvoices(tenantId);
      return NextResponse.json({ milestone: updatedMilestone, invoicesData });
    }

    // Handle standard invoice update
    if (!body.id || !body.updates) {
      return NextResponse.json({ error: "id and updates required" }, { status: 400 });
    }

    const updatedInvoice = await updateTenantInvoice(tenantId, body.id, body.updates);
    if (!updatedInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const invoicesData = await getTenantInvoices(tenantId);
    return NextResponse.json({ invoice: updatedInvoice, invoicesData });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: Delete an invoice
export async function DELETE(req: NextRequest) {
  try {
    const tenantId = await resolveTenantId(req);
    const invoiceId = req.nextUrl.searchParams.get("id");

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });
    }

    const deleted = await deleteTenantInvoice(tenantId, invoiceId);
    if (!deleted) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
