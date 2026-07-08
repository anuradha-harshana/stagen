import { createUser } from "@/lib/register/register";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const user = await createUser(
            body.username,
            body.email,
            body.password,
            body.role
        );

        return NextResponse.json(user, {
            status: 201,
        });
    } catch (err) {
        return NextResponse.json(
            { message: (err as Error).message },
            { status: 400 }
        );
    }
}