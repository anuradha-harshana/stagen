import { getCurrentUser } from "@/lib/auth/auth";
import { ApiError, DEFAULT_CUSTOMER_USER_ID } from "./store";

export async function resolveCustomer(): Promise<{ id: string; role: string; username: string }> {
  const user = await getCurrentUser();

  if (user) {
    if (user.role !== "customer") {
      throw new ApiError(403, "Customer access required");
    }
    return {
      id: user.id,
      role: user.role,
      username: user.username,
    };
  }

  // Fallback to default customer in development/mock sessions
  return {
    id: DEFAULT_CUSTOMER_USER_ID,
    role: "customer",
    username: "Anuradha",
  };
}

export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  console.error("Customer API error:", error);
  const message = error instanceof Error ? error.message : "Internal server error";
  return Response.json({ error: message }, { status: 500 });
}
