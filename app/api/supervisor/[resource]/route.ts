import { supervisorApi } from "@/lib/supervisor/api";
export const runtime = "nodejs";
type Context = { params: Promise<{ resource: string }> };
async function handle(request: Request, context: Context) {
  return supervisorApi(request, (await context.params).resource);
}
export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
