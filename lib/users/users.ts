import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { CompanyUser, User } from "../types/types";


const filePath = path.join(process.cwd(), "data", "users", "users.json");

export async function getUsers(): Promise<User[]> {
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
}

export async function getCompanyUsers(companyId: string): Promise<CompanyUser[]> {
    const fileContents = await fs.readFile(filePath, "utf8");
    const users: (User & { companyId?: string })[] = JSON.parse(fileContents);
    return users
        .filter((u) => u.companyId === companyId)
        .map(({ companyId: matchedCompanyId, ...user }) => ({
            user,
            companyId: matchedCompanyId as string,
        }));
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