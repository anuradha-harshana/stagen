import { loginUser } from "@/lib/login/login";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {

    const body = await req.json();

    const user = await loginUser(
        body.email,
        body.password
    );

    if(!user) {
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        );
    }

    return NextResponse.json(user);

}