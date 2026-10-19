import { getCurrentUser } from "@/lib/auth/auth";
import { getCustomerTimelines } from "@/lib/customer/timeline";

export const runtime = "nodejs";
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ message: "Please sign in" }, { status: 401 });
    if (user.role !== "customer") return Response.json({ message: "Customer access required" }, { status: 403 });
    return Response.json({ projects: await getCustomerTimelines(user.id) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Unable to load customer timeline", error);
    return Response.json({ message: "Unable to load your timeline. Please try again." }, { status: 500 });
  }
}
