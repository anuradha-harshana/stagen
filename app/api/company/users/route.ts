import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
  getCompanyUsers,
  createCompanyUser,
  updateCompanyUser,
  deleteCompanyUser,
} from "@/lib/company/organizationUsers";

// GET: Fetch all company users
export async function GET() {
  await requireRole(["company"]);
  const users = await getCompanyUsers();
  return NextResponse.json({ users });
}

// POST: Invite / create new user
export async function POST(req: NextRequest) {
  await requireRole(["company"]);
  const body = await req.json();

  if (!body.name || !body.email || !body.role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newUser = await createCompanyUser(body);
  return NextResponse.json({ user: newUser }, { status: 201 });
}

// PUT: Update status or details
export async function PUT(req: NextRequest) {
  await requireRole(["company"]);
  const { id, updates } = await req.json();

  if (!id || !updates) {
    return NextResponse.json({ error: "id and updates required" }, { status: 400 });
  }

  const updatedUser = await updateCompanyUser(id, updates);
  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: updatedUser });
}

// DELETE: Remove user
export async function DELETE(req: NextRequest) {
  await requireRole(["company"]);
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const deleted = await deleteCompanyUser(id);
  if (!deleted) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
