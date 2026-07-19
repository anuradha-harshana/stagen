import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSessions } from "@/lib/sessions/sessions";
import { getUsers } from "@/lib/users/users";
import { User } from "@/lib/types/types";

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionId = cookieStore
        .get("session_id")
        ?.value;

    if (!sessionId) {
        return null;
    }

    const sessions = await getSessions();

    const session = sessions.find(
        session => session.id === sessionId
    );

    if (!session) {
        return null;
    }

    const isExpired =
        new Date(session.expiresAt) < new Date();

    if (isExpired) {
        return null;
    }

    const users = await getUsers();

    const user = users.find(
        user => user.id === session.userId
    );

    return user ?? null;
}

export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return user;
}

export async function requireRole(
    allowedRoles: string[]
): Promise<User> {
    const user = await requireAuth();

    if (!allowedRoles.includes(user.role)) {
        redirect("/redirect");
    }

    return user;
}