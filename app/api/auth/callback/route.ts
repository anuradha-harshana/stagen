import { exchangeCodeForTokens, extractRoleFromClaims, parseJwtPayload } from "@/lib/auth/wso2";
import { generateSessionId, getSessions, saveSessions } from "@/lib/sessions/sessions";
import { getUsers, saveUsers } from "@/lib/users/users";
import { getRedirectPath } from "@/hooks/Auth/redirection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (error) {
        console.error("WSO2 Auth Error:", error, errorDescription);
        return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(errorDescription || error)}`);
    }

    const savedState = req.cookies.get("wso2_auth_state")?.value;
    const codeVerifier = req.cookies.get("wso2_code_verifier")?.value;

    if (!code || !state || !savedState || state !== savedState || !codeVerifier) {
        console.error("Invalid state or missing code/verifier");
        return NextResponse.redirect(`${appUrl}/login?error=invalid_session`);
    }

    try {
        const tokenResponse = await exchangeCodeForTokens(code, codeVerifier);
        const payload = parseJwtPayload(tokenResponse.id_token);

        if (!payload) {
            throw new Error("Failed to parse WSO2 ID token payload");
        }

        const email = payload.email || payload.sub || "user@stagen.com";
        const username = payload.preferred_username || payload.given_name || payload.name || email.split("@")[0];
        const role = extractRoleFromClaims(payload);
        const userId = payload.sub || crypto.randomUUID();

        // Sync user with users store
        const users = await getUsers();
        let existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.id === userId);

        if (!existingUser) {
            existingUser = {
                id: userId,
                username: username,
                email: email,
                password: "",
                role: role,
            };
            users.push(existingUser);
            await saveUsers(users);
        } else if (existingUser.role !== role) {
            // Update role if changed in WSO2
            existingUser.role = role;
            await saveUsers(users);
        }

        // Create Session
        const sessions = await getSessions();
        const sessionId = generateSessionId();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        sessions.push({
            id: sessionId,
            userId: existingUser.id,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
        });

        await saveSessions(sessions);

        const redirectPath = getRedirectPath(role);
        const response = NextResponse.redirect(`${appUrl}${redirectPath}`);

        // Set session_id cookie
        response.cookies.set("session_id", sessionId, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
            path: "/",
        });

        // Store id_token in cookie for logout if needed
        response.cookies.set("wso2_id_token", tokenResponse.id_token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
            path: "/",
        });

        // Clear temporary PKCE cookies
        response.cookies.delete("wso2_auth_state");
        response.cookies.delete("wso2_code_verifier");

        return response;
    } catch (err: any) {
        console.error("WSO2 Callback Processing Error:", err);
        return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(err.message || "authentication_failed")}`);
    }
}
