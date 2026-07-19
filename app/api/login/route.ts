import { loginUser } from "@/lib/login/login";
import {
    generateSessionId,
    getSessions,
    saveSessions
} from "@/lib/sessions/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const user = await loginUser(
        body.email,
        body.password
    );

    if (!user) {
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        );
    }

    const sessions = await getSessions();

    const sessionId = generateSessionId();

    const expiresAt = new Date();

    // Session expires after 7 days
    expiresAt.setDate(expiresAt.getDate() + 7);

    sessions.push({
        id: sessionId,
        userId: user.id,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString()
    });

    await saveSessions(sessions);

    const response = NextResponse.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });

    response.cookies.set(
        "session_id",
        sessionId,
        {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
            path: "/"
        }
    );

    return response;
}