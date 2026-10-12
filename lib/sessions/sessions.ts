import fs from "fs/promises";
import path from "path";
import { Session } from "../types/types";

const sessionsPath = path.join(
    process.cwd(),
    "data",
    "sessions",
    "sessions.json"
);

export async function getSessions(): Promise<Session[]> {
    try {
        const data = await fs.readFile(sessionsPath, "utf-8");

        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function saveSessions(
    sessions: Session[]
): Promise<void> {
    await fs.writeFile(
        sessionsPath,
        JSON.stringify(sessions, null, 2)
    );
}

export function generateSessionId(): string {
    return crypto.randomUUID();
}