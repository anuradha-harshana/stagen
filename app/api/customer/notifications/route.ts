import { NextRequest, NextResponse } from "next/server";
import { resolveCustomer, handleApiError } from "@/lib/customer/api";
import {
  getCustomerNotifications,
  createCustomerNotification,
  updateCustomerNotification,
  markAllNotificationsAsRead,
  deleteCustomerNotification,
} from "@/lib/customer/notifications";

export const runtime = "nodejs";

// GET: Fetch all notifications for the authenticated customer
export async function GET() {
  try {
    const customer = await resolveCustomer();
    const notifications = await getCustomerNotifications(customer.id);
    return NextResponse.json({ notifications }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST: Create a notification or perform batch operations like markAllRead
export async function POST(request: NextRequest) {
  try {
    const customer = await resolveCustomer();
    const body = await request.json().catch(() => ({}));

    // Handle mark all read action via POST
    if (body.action === "markAllRead" || body.all === true) {
      const result = await markAllNotificationsAsRead(customer.id);
      return NextResponse.json(result);
    }

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const notification = await createCustomerNotification(customer.id, {
      title: body.title,
      description: body.description,
      category: body.category,
      time: body.time,
      tenantId: body.tenantId,
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT / PATCH: Update read state, content, or mark all as read
async function handleUpdate(request: NextRequest) {
  try {
    const customer = await resolveCustomer();
    const body = await request.json().catch(() => ({}));

    if (body.all === true || body.action === "markAllRead") {
      const result = await markAllNotificationsAsRead(customer.id);
      return NextResponse.json(result);
    }

    const id = body.id;
    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const updates = body.updates || {
      read: body.read,
      title: body.title,
      description: body.description,
      category: body.category,
    };

    const updated = await updateCustomerNotification(customer.id, id, updates);
    return NextResponse.json({ notification: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export { handleUpdate as PUT, handleUpdate as PATCH };

// DELETE: Remove a notification by ID
export async function DELETE(request: NextRequest) {
  try {
    const customer = await resolveCustomer();
    const url = new URL(request.url);
    let id = url.searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required for deletion" },
        { status: 400 }
      );
    }

    await deleteCustomerNotification(customer.id, id);
    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
