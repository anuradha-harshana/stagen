import { generatePkcePair, getWso2AuthorizationUrl } from "@/lib/auth/wso2";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
    const state = crypto.randomUUID();
    const { verifier, challenge } = generatePkcePair();

    const authUrl = getWso2AuthorizationUrl(state, challenge);

    const response = NextResponse.redirect(authUrl);

    // Save PKCE verifier and state in temporary short-lived HTTP-only cookies
    response.cookies.set("wso2_auth_state", state, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 600, // 10 minutes
        path: "/",
    });

    response.cookies.set("wso2_code_verifier", verifier, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 600, // 10 minutes
        path: "/",
    });

    return response;
}
