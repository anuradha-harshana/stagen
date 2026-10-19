import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import {
  syncOrgUserToProfile,
  updateOrgUserProfile,
  deleteOrgUserProfile
} from "../users/userProfiles";

export type OrganizationUserRole =
  | "Company Admin"
  | "Executive Management"
  | "Site Supervisor"
  | "Trade Contractor"
  | "Customer";

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: OrganizationUserRole;
  phone: string;
  status: "Active" | "Pending" | "Suspended";
  assignedProjectsCount: number;
  assignedProjects: string[];
  lastActive: string;
  avatarBg: string;
}

const usersFile = path.join(process.cwd(), "data", "company", "organizationUsers.json");

// Helper: Read records from disk
async function readUsers(): Promise<OrganizationUser[]> {
  try {
    const data = await fs.readFile(usersFile, "utf8");
    return JSON.parse(data) as OrganizationUser[];
  } catch (err) {
    return [];
  }
}

// Helper: Save records to disk
async function writeUsers(users: OrganizationUser[]) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
}

// ── 1. READ (GET) ──
export async function getCompanyUsers(): Promise<OrganizationUser[]> {
  return await readUsers();
}

// ── 2. CREATE (POST) ──
export async function createCompanyUser(
  data: Omit<OrganizationUser, "id" | "lastActive">
): Promise<OrganizationUser> {
  const users = await readUsers();
  const newUser: OrganizationUser = {
    ...data,
    id: `USR-${Date.now().toString().slice(-4)}`,
    lastActive: "Invite Sent (Just now)"
  };
  users.unshift(newUser); // Add to the top of list
  await writeUsers(users);

  // Sync user record to userProfiles.json / user_profiles.json
  try {
    await syncOrgUserToProfile(newUser);
  } catch (err) {
    console.error("Failed to sync created user with user profile:", err);
  }

  return newUser;
}

// ── 3. UPDATE (PUT) ──
export async function updateCompanyUser(
  id: string,
  updates: Partial<OrganizationUser>
): Promise<OrganizationUser | null> {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  await writeUsers(users);

  // Sync updates with userProfiles.json / user_profiles.json
  try {
    await updateOrgUserProfile(id, updates);
  } catch (err) {
    console.error("Failed to sync updated user with user profile:", err);
  }

  return users[index];
}

// ── 4. DELETE (DELETE) ──
export async function deleteCompanyUser(id: string): Promise<boolean> {
  const users = await readUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;

  await writeUsers(filtered);

  // Sync deletion with userProfiles.json / user_profiles.json
  try {
    await deleteOrgUserProfile(id);
  } catch (err) {
    console.error("Failed to sync deleted user with user profile:", err);
  }

  return true;
}
