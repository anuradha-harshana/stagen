import {
    getSessions,
    saveSessions
} from "@/lib/sessions/sessions";
import { getWso2LogoutUrl } from "@/lib/auth/wso2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const sessionId = req.cookies.get("session_id")?.value;
    const idToken = req.cookies.get("wso2_id_token")?.value;

    if (sessionId) {
        const sessions = await getSessions();

        const updatedSessions = sessions.filter(
            session => session.id !== sessionId
        );

        await saveSessions(updatedSessions);
    }

    const logoutUrl = getWso2LogoutUrl(idToken);

    const response = NextResponse.json({
        message: "Logged out successfully",
        logoutUrl: logoutUrl,
    });

    response.cookies.set("session_id", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/"
    });

    response.cookies.set("wso2_id_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/"
    });

    return response;
}