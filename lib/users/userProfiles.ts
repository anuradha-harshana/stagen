import fs from "fs/promises";
import path from "path";

export interface UserProfile {
  user_id: string;
  role: string;
  avatar_url?: string;
  avatarBg?: string;
  full_name: string;
  email?: string;
  phone: string;
  home_address?: string;
  account_created: string;
  language: string;
  timezone: string;
  linked_accounts: Array<{ provider: string; connected: boolean }>;
  password_updated_at?: string;
  status?: "Active" | "Pending" | "Suspended";
  assigned_projects?: string[];
  assigned_projects_count?: number;
  last_active?: string;
}

const userProfilesFile = path.join(process.cwd(), "data", "users", "user_profiles.json");
const userProfilesCamelFile = path.join(process.cwd(), "data", "users", "userProfiles.json");

// Map Organization User role string to standard profile role
export function mapOrgRoleToProfileRole(role: string): string {
  const normalized = role.toLowerCase().trim();
  if (normalized.includes("supervisor")) return "supervisor";
  if (normalized.includes("management")) return "company-management";
  if (normalized.includes("admin")) return "company";
  if (normalized.includes("trade")) return "trade";
  if (normalized.includes("customer")) return "customer";
  return normalized;
}

// Helper: Read user profiles from disk
export async function getUserProfiles(): Promise<UserProfile[]> {
  try {
    let rawData = "";
    try {
      rawData = await fs.readFile(userProfilesFile, "utf8");
    } catch {
      rawData = await fs.readFile(userProfilesCamelFile, "utf8");
    }

    if (!rawData.trim()) return [];
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed as UserProfile[];
    }
    // If legacy file contained a single object, wrap it in an array
    if (parsed && typeof parsed === "object" && parsed.user_id) {
      return [parsed as UserProfile];
    }
    return [];
  } catch (err) {
    return [];
  }
}

// Helper: Save user profiles to both user_profiles.json and userProfiles.json
export async function saveUserProfiles(profiles: UserProfile[]): Promise<void> {
  const jsonContent = JSON.stringify(profiles, null, 2);
  await fs.writeFile(userProfilesFile, jsonContent, "utf8");
}

// Get single user profile by user_id
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  const profiles = await getUserProfiles();
  return profiles.find((p) => p.user_id === userId) || null;
}

// Convert Organization User record to UserProfile record
export function mapOrgUserToProfile(orgUser: {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  status?: "Active" | "Pending" | "Suspended";
  assignedProjectsCount?: number;
  assignedProjects?: string[];
  lastActive?: string;
  avatarBg?: string;
}): UserProfile {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const projects = orgUser.assignedProjects || [];
  const validProjects = projects.filter((p) => p && p.toLowerCase() !== "unassigned");
  const homeAddress = validProjects.length > 0 ? validProjects.join(", ") : "";

  return {
    user_id: orgUser.id,
    role: mapOrgRoleToProfileRole(orgUser.role),
    avatar_url: "/profile-avatar.png",
    avatarBg: orgUser.avatarBg || "bg-blue-fantastic",
    full_name: orgUser.name,
    email: orgUser.email,
    phone: orgUser.phone,
    home_address: homeAddress,
    account_created: today,
    language: "English",
    timezone: "Australia/Melbourne",
    linked_accounts: [{ provider: "google", connected: false }],
    password_updated_at: new Date().toISOString().split("T")[0],
    status: orgUser.status || "Pending",
    assigned_projects: projects,
    assigned_projects_count: orgUser.assignedProjectsCount ?? projects.length,
    last_active: orgUser.lastActive || "Invite Sent (Just now)"
  };
}

// Add or update user profile from Organization User
export async function syncOrgUserToProfile(orgUser: {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  status?: "Active" | "Pending" | "Suspended";
  assignedProjectsCount?: number;
  assignedProjects?: string[];
  lastActive?: string;
  avatarBg?: string;
}): Promise<UserProfile> {
  const profiles = await getUserProfiles();
  const existingIndex = profiles.findIndex((p) => p.user_id === orgUser.id || (orgUser.email && p.email?.toLowerCase() === orgUser.email.toLowerCase()));

  const newProfile = mapOrgUserToProfile(orgUser);

  if (existingIndex >= 0) {
    profiles[existingIndex] = {
      ...profiles[existingIndex],
      ...newProfile,
      // Retain existing user_id if already established
      user_id: profiles[existingIndex].user_id || newProfile.user_id,
      account_created: profiles[existingIndex].account_created || newProfile.account_created,
      linked_accounts: profiles[existingIndex].linked_accounts || newProfile.linked_accounts
    };
    await saveUserProfiles(profiles);
    return profiles[existingIndex];
  } else {
    profiles.unshift(newProfile);
    await saveUserProfiles(profiles);
    return newProfile;
  }
}

// Update existing profile with partial changes
export async function updateOrgUserProfile(
  id: string,
  updates: {
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    status?: "Active" | "Pending" | "Suspended";
    assignedProjectsCount?: number;
    assignedProjects?: string[];
    lastActive?: string;
    avatarBg?: string;
  }
): Promise<UserProfile | null> {
  const profiles = await getUserProfiles();
  const index = profiles.findIndex((p) => p.user_id === id);
  if (index === -1) return null;

  const current = profiles[index];
  const role = updates.role ? mapOrgRoleToProfileRole(updates.role) : current.role;
  const projects = updates.assignedProjects ?? current.assigned_projects ?? [];
  const validProjects = projects.filter((p) => p && p.toLowerCase() !== "unassigned");

  profiles[index] = {
    ...current,
    full_name: updates.name ?? current.full_name,
    email: updates.email ?? current.email,
    role,
    phone: updates.phone ?? current.phone,
    status: updates.status ?? current.status,
    assigned_projects: projects,
    assigned_projects_count: updates.assignedProjectsCount ?? projects.length,
    home_address: validProjects.length > 0 ? validProjects.join(", ") : current.home_address,
    last_active: updates.lastActive ?? current.last_active,
    avatarBg: updates.avatarBg ?? current.avatarBg
  };

  await saveUserProfiles(profiles);
  return profiles[index];
}

// Delete user profile by ID
export async function deleteOrgUserProfile(id: string): Promise<boolean> {
  const profiles = await getUserProfiles();
  const filtered = profiles.filter((p) => p.user_id !== id);
  if (filtered.length === profiles.length) return false;

  await saveUserProfiles(filtered);
  return true;
}
