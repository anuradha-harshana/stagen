import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { User } from "../types/types";


const filePath = path.join(process.cwd(), "data", "users", "users.json");

export async function getUsers(): Promise<User[]> {
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
}

export async function saveUsers(users: User[]) {
    await fs.writeFile(
        filePath,
        JSON.stringify(users, null, 2)
    )
}


export function generateId() {
    return crypto.randomUUID();
}