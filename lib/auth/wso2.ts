import crypto from "crypto";

export interface Wso2Config {
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export function getWso2Config(): Wso2Config {
    return {
        baseUrl: process.env.WSO2_BASE_URL || "https://localhost:9443",
        clientId: process.env.WSO2_CLIENT_ID || "stagen_app_client_id",
        clientSecret: process.env.WSO2_CLIENT_SECRET || "stagen_app_client_secret",
        redirectUri: process.env.WSO2_REDIRECT_URI || "http://localhost:3000/api/auth/callback",
    };
}

// Generate PKCE code verifier and S256 code challenge
export function generatePkcePair() {
    const verifier = crypto.randomBytes(32).toString("base64url");
    const challenge = crypto
        .createHash("sha256")
        .update(verifier)
        .digest("base64url");
    return { verifier, challenge };
}

// Build WSO2 Authorization URL
export function getWso2AuthorizationUrl(state: string, codeChallenge: string): string {
    const config = getWso2Config();
    const params = new URLSearchParams({
        response_type: "code",
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: "openid profile email roles groups",
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
    });

    return `${config.baseUrl}/oauth2/authorize?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string, codeVerifier: string) {
    const config = getWso2Config();
    const tokenEndpoint = `${config.baseUrl}/oauth2/token`;

    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code_verifier: codeVerifier,
    });

    // In node.js dev environments with self-signed SSL certs on WSO2 IS
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev && process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to exchange authorization code: ${response.status} - ${errorText}`);
    }

    return await response.json() as {
        access_token: string;
        id_token: string;
        token_type: string;
        expires_in: number;
    };
}

// Parse base64 JWT payload from ID Token
export function parseJwtPayload(token: string) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = Buffer.from(payloadBase64, "base64").toString("utf-8");
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

// Normalize role from WSO2 token payload
export function extractRoleFromClaims(payload: any): string {
    if (!payload) return "customer";

    const rolesRaw = payload.roles || payload.role || payload.groups || payload["http://wso2.org/claims/role"];
    
    let rolesList: string[] = [];
    if (Array.isArray(rolesRaw)) {
        rolesList = rolesRaw.map(r => String(r).toLowerCase());
    } else if (typeof rolesRaw === "string") {
        rolesList = rolesRaw.split(",").map(r => r.trim().toLowerCase());
    }

    if (rolesList.includes("company-management")) return "company-management";
    if (rolesList.includes("company")) return "company";
    if (rolesList.includes("supervisor")) return "supervisor";
    if (rolesList.includes("customer")) return "customer";

    return "customer";
}

// Build WSO2 Logout URL
export function getWso2LogoutUrl(idToken?: string): string {
    const config = getWso2Config();
    const logoutEndpoint = `${config.baseUrl}/oidc/logout`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const postLogoutUri = `${appUrl.replace(/\/+$/, "")}/login`;

    const params = new URLSearchParams({
        post_logout_redirect_uri: postLogoutUri,
    });

    if (idToken) {
        params.append("id_token_hint", idToken);
    }

    return `${logoutEndpoint}?${params.toString()}`;
}
