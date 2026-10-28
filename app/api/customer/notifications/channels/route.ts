import { NextRequest, NextResponse } from "next/server";
import { resolveCustomer, handleApiError } from "@/lib/customer/api";
import {
  getCustomerChannels,
  updateCustomerChannels,
  ChannelState,
} from "@/lib/customer/notifications";

export const runtime = "nodejs";

// GET: Fetch notification channel settings (inApp, email, push)
export async function GET() {
  try {
    const customer = await resolveCustomer();
    const channels = await getCustomerChannels(customer.id);
    return NextResponse.json({ channels }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT / PATCH / POST: Update notification channels
async function handleUpdateChannels(request: NextRequest) {
  try {
    const customer = await resolveCustomer();
    const body = (await request.json().catch(() => ({}))) as Partial<ChannelState>;

    const updated = await updateCustomerChannels(customer.id, body);
    return NextResponse.json({ channels: updated, message: "Channels updated successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

export { handleUpdateChannels as PUT, handleUpdateChannels as PATCH, handleUpdateChannels as POST };
