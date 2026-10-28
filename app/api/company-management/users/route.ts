import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import { getCompanyUsers, createCompanyUser, updateCompanyUser, deleteCompanyUser } from "@/lib/company/organizationUsers";
import { ApiError } from "@/lib/supervisor/store";
async function handle(req: Request, method: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new ApiError(401, "Please sign in");
    if (!["company", "company-management"].includes(user.role)) throw new ApiError(403, "Company access required");
    const companyId = user.companyId || user.id;
    if (method === "GET") return NextResponse.json({users: await getCompanyUsers(companyId)});
    if (method === "DELETE") {
      const id = new URL(req.url).searchParams.get("id");
      if (!id) throw new ApiError(400, "User ID required");
      if (!await deleteCompanyUser(companyId,id)) throw new ApiError(404,"User not found");
      return new NextResponse(null,{status:204});
    }
    const body = await req.json();
    if (method === "PUT" && (!body.id || !body.updates)) throw new ApiError(400,"User ID and updates required");
    const result = method === "POST" ? await createCompanyUser(companyId,body) : await updateCompanyUser(companyId,body.id,body.updates);
    return NextResponse.json({user:result},{status:method === "POST" ? 201 : 200});
  } catch (e) { return NextResponse.json({error:e instanceof Error?e.message:"Request failed"},{status:e instanceof ApiError?e.status:400}); }
}
export const GET = (req: NextRequest) => handle(req,"GET");
export const POST = (req: NextRequest) => handle(req,"POST");
export const PUT = (req: NextRequest) => handle(req,"PUT");
export const DELETE = (req: NextRequest) => handle(req,"DELETE");
