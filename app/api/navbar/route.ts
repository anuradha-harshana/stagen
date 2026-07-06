import { NextResponse, NextRequest } from "next/server";
import { getNavbarItemsToRole } from "@/lib/db-mock/db";

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role");

  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  const NavbarItems = await getNavbarItemsToRole(role);

  return NextResponse.json(NavbarItems);
}