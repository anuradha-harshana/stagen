import { supervisorApi } from "@/lib/supervisor/api";
export const runtime = "nodejs";
export async function GET(request: Request) { return supervisorApi(request, "dashboard"); }
