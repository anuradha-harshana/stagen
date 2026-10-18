import fs from "fs/promises";
import path from "path";
import { CustomerProfile, User } from "@/lib/types/types";
import { getUsers, saveUsers } from "@/lib/users/users";

const customerFilePath = path.join(
  process.cwd(),
  "data",
  "customer",
  "customerProfiles.json"
);

/**
 * 1. Read all customer profiles from the JSON file.
 * Automatically creates directory and file if they do not exist.
 */
export async function readCustomerProfiles(): Promise<CustomerProfile[]> {
  try {
    const fileContents = await fs.readFile(customerFilePath, "utf8");
    return JSON.parse(fileContents) as CustomerProfile[];
  } catch (error: any) {
    // If file doesn't exist yet, create empty array
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(customerFilePath), { recursive: true });
      await fs.writeFile(customerFilePath, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    console.error("Failed to read customerProfiles.json:", error);
    return [];
  }
}

/**
 * 2. Write customer profiles back to JSON file.
 */
export async function writeCustomerProfiles(
  profiles: CustomerProfile[]
): Promise<void> {
  await fs.mkdir(path.dirname(customerFilePath), { recursive: true });
  await fs.writeFile(customerFilePath, JSON.stringify(profiles, null, 2), "utf8");
}

/**
 * 3. Retrieve profile by userId.
 * If no profile is found, automatically creates and saves a default profile
 * using existing account data from users.json.
 */
export async function getCustomerProfile(
  userId: string
): Promise<CustomerProfile | null> {
  const profiles = await readCustomerProfiles();
  const profile = profiles.find((p) => p.userId === userId);

  if (profile) {
    return profile;
  }

  // Fallback: check if user exists in users.json
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return null;
  }

  // Create default customer profile
  const newProfile: CustomerProfile = {
    userId: user.id,
    fullName: user.username || "Customer",
    email: user.email || "",
    phone: "",
    avatarUrl: "",
    homeAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Australia",
    preferredLanguage: "English",
    timeZone: "(AEST) Australia/Sydney",
    accountCreatedAt: new Date().toISOString(),
    passwordUpdatedAt: new Date().toISOString(),
    linkedAccounts: [
      {
        provider: "Google",
        connected: false,
        email: user.email,
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  profiles.push(newProfile);
  await writeCustomerProfiles(profiles);

  return newProfile;
}

/**
 * 4. Update profile fields and persist to customerProfiles.json.
 * Also synchronizes fullName and email with users.json if provided.
 */
export async function updateCustomerProfile(
  userId: string,
  data: Partial<CustomerProfile>
): Promise<CustomerProfile> {
  const profiles = await readCustomerProfiles();
  const index = profiles.findIndex((p) => p.userId === userId);

  let existing = index >= 0 ? profiles[index] : await getCustomerProfile(userId);

  if (!existing) {
    throw new Error(`Customer profile not found for user ID: ${userId}`);
  }

  const updatedProfile: CustomerProfile = {
    ...existing,
    ...data,
    userId, // Ensure userId is immutable
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    profiles[index] = updatedProfile;
  } else {
    profiles.push(updatedProfile);
  }

  await writeCustomerProfiles(profiles);

  // Sync username or email with users.json if updated
  if (data.fullName || data.email) {
    const users = await getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      if (data.fullName) users[userIndex].username = data.fullName;
      if (data.email) users[userIndex].email = data.email;
      await saveUsers(users);
    }
  }

  return updatedProfile;
}

/**
 * 5. Update user password in users.json and record timestamp in profile.
 */
export async function updateCustomerPassword(
  userId: string,
  newPassword: string
): Promise<void> {
  // Update in users.json
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.password = newPassword;
  await saveUsers(users);

  // Update passwordUpdatedAt in customerProfiles.json
  const profiles = await readCustomerProfiles();
  const profile = profiles.find((p) => p.userId === userId);
  if (profile) {
    profile.passwordUpdatedAt = new Date().toISOString();
    profile.updatedAt = new Date().toISOString();
    await writeCustomerProfiles(profiles);
  }
}
