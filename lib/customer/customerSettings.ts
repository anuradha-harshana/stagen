import fs from "fs/promises";
import path from "path";
import { CustomerSettings } from "@/lib/types/types";
import { getUsers } from "@/lib/users/users";
import { readCustomerProfiles, updateCustomerProfile } from "@/lib/customer/customerProfile";

const customerSettingsFilePath = path.join(
  process.cwd(),
  "data",
  "customer",
  "customerSettings.json"
);

/**
 * Default customer settings blueprint
 */
export function getDefaultCustomerSettings(
  userId: string,
  email: string = "",
  preferredLanguage: string = "English",
  timeZone: string = "(AEST) Australia/Sydney"
): CustomerSettings {
  return {
    userId,
    general: {
      language: preferredLanguage || "English",
      timeZone: timeZone || "(AEST) Australia/Sydney",
      dateFormat: "DD MMM YYYY",
      currency: "AUD - Australian Dollar",
      measurement: "Metric (m², km)",
    },
    notifications: {
      projectUpdates: true,
      invoiceReminders: true,
      aiNotifications: true,
      emailNotifications: true,
      pushNotifications: true,
    },
    security: {
      twoFactorEnabled: false,
    },
    privacy: {
      profileVisibility: "Only Construction Team",
      dataSharing: false,
    },
    billing: {
      plan: "Not configured",
      billingEmail: email,
      paymentMethod: "Not configured",
      billingCycle: "Monthly",
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * 1. Read all customer settings records from the JSON file.
 * Automatically creates directory and file if they do not exist.
 */
export async function readCustomerSettings(): Promise<CustomerSettings[]> {
  try {
    const fileContents = await fs.readFile(customerSettingsFilePath, "utf8");
    return JSON.parse(fileContents) as CustomerSettings[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(customerSettingsFilePath), { recursive: true });
      await fs.writeFile(
        customerSettingsFilePath,
        JSON.stringify([], null, 2),
        "utf8"
      );
      return [];
    }
    console.error("Failed to read customerSettings.json:", error);
    return [];
  }
}

/**
 * 2. Write customer settings list back to the JSON file.
 */
export async function writeCustomerSettings(
  settings: CustomerSettings[]
): Promise<void> {
  await fs.mkdir(path.dirname(customerSettingsFilePath), { recursive: true });
  await fs.writeFile(
    customerSettingsFilePath,
    JSON.stringify(settings, null, 2),
    "utf8"
  );
}

/**
 * 3. Retrieve settings by userId.
 * If no settings are found, automatically creates and saves default settings
 * using existing account data and profile preferences.
 */
export async function getCustomerSettings(
  userId: string
): Promise<CustomerSettings | null> {
  const settingsList = await readCustomerSettings();
  const existing = settingsList.find((s) => s.userId === userId);

  // If user profile has preferences, gather them for fallback
  const profiles = await readCustomerProfiles().catch(() => []);
  const userProfile = profiles.find((p) => p.userId === userId);

  const fallback = getDefaultCustomerSettings(
    userId,
    userProfile?.email || "",
    userProfile?.preferredLanguage,
    userProfile?.timeZone
  );

  if (existing) {
    // Deep fallback merge to ensure no undefined nested objects if new fields are added
    return {
      ...fallback,
      ...existing,
      general: { ...fallback.general, ...(existing.general || {}) },
      notifications: { ...fallback.notifications, ...(existing.notifications || {}) },
      security: { ...fallback.security, ...(existing.security || {}) },
      privacy: { ...fallback.privacy, ...(existing.privacy || {}) },
      billing: { ...fallback.billing, ...(existing.billing || {}) },
    };
  }

  // Fallback: check if user exists in users.json
  const users = await getUsers().catch(() => []);
  const user = users.find((u) => u.id === userId);

  if (!user && !userProfile) {
    return null;
  }

  const newSettings = getDefaultCustomerSettings(
    userId,
    user?.email || userProfile?.email || "",
    userProfile?.preferredLanguage,
    userProfile?.timeZone
  );

  settingsList.push(newSettings);
  await writeCustomerSettings(settingsList);

  return newSettings;
}

/**
 * 4. Update customer settings fields and persist to customerSettings.json.
 * Also synchronizes language or timeZone with customerProfiles.json if modified.
 */
export async function updateCustomerSettings(
  userId: string,
  data: Partial<CustomerSettings>
): Promise<CustomerSettings> {
  const settingsList = await readCustomerSettings();
  const index = settingsList.findIndex((s) => s.userId === userId);

  let existing = index >= 0 ? settingsList[index] : await getCustomerSettings(userId);

  if (!existing) {
    existing = getDefaultCustomerSettings(userId);
  }

  const updatedSettings: CustomerSettings = {
    ...existing,
    ...data,
    userId, // Ensure userId is immutable
    general: {
      ...existing.general,
      ...(data.general || {}),
    },
    notifications: {
      ...existing.notifications,
      ...(data.notifications || {}),
    },
    security: {
      ...existing.security,
      ...(data.security || {}),
    },
    privacy: {
      ...existing.privacy,
      ...(data.privacy || {}),
    },
    billing: {
      ...existing.billing,
      ...(data.billing || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    settingsList[index] = updatedSettings;
  } else {
    settingsList.push(updatedSettings);
  }

  await writeCustomerSettings(settingsList);

  // Synchronize preferredLanguage and timeZone with customerProfile if updated
  if (data.general?.language || data.general?.timeZone) {
    try {
      await updateCustomerProfile(userId, {
        ...(data.general.language ? { preferredLanguage: data.general.language } : {}),
        ...(data.general.timeZone ? { timeZone: data.general.timeZone } : {}),
      });
    } catch {
      // Ignore if profile doesn't exist yet
    }
  }

  return updatedSettings;
}
