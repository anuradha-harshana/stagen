import {
    getSessions,
    saveSessions
} from "@/lib/sessions/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const sessionId = req.cookies.get(
        "session_id"
    )?.value;

    if (sessionId) {
        const sessions = await getSessions();

        const updatedSessions = sessions.filter(
            session => session.id !== sessionId
        );

        await saveSessions(updatedSessions);
    }

    const response = NextResponse.json({
        message: "Logged out successfully"
    });

    response.cookies.set(
        "session_id",
        "",
        {
            httpOnly: true,
            expires: new Date(0),
            path: "/"
        }
    );

    return response;
}