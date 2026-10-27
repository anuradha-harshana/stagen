import fs from "fs/promises";
import path from "path";

export interface CompanyProfileData {
  companyId: string;
  companyName: string;
  abn: string;
  businessAddress: string;
  contactNumber: string;
  primaryEmail: string;
  websiteUrl: string;
  timezone: string;
  defaultCurrency: string;
  logoUrl: string;
  updatedAt?: string;
}

const profileFilePath = path.join(process.cwd(), "data", "company", "companyProfile.json");
const usersFilePath = path.join(process.cwd(), "data", "users", "users.json");
const auditFilePath = path.join(process.cwd(), "data", "company-management", "audit.json");
const reportsFilePath = path.join(process.cwd(), "data", "company-management", "reports.json");
const governanceFilePath = path.join(process.cwd(), "data", "company", "governanceSettings.json");
const settingsFilePath = path.join(process.cwd(), "data", "company", "companySettings.json");
const localisationFilePath = path.join(process.cwd(), "data", "company", "localisation.json");

const DEFAULT_PROFILE: CompanyProfileData = {
  companyId: "7ab56015-4412-494e-8aff-dbb5095e0095",
  companyName: "STAGEN Constructions",
  abn: "98 123 456 789",
  businessAddress: "Level 14, 100 St Kilda Road, Melbourne VIC 3004",
  contactNumber: "+61 3 9876 5432",
  primaryEmail: "admin@stagen.com.au",
  websiteUrl: "https://stagen.com.au",
  timezone: "Australia/Melbourne",
  defaultCurrency: "AUD ($)",
  logoUrl: "/images/logo.png",
};

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getCompanyProfile(companyId: string): Promise<CompanyProfileData> {
  const records = await readJsonFile<CompanyProfileData[]>(profileFilePath, []);
  const found = records.find((r) => r.companyId === companyId);
  if (found) {
    return found;
  }

  // Create default entry if not found
  const newProfile: CompanyProfileData = {
    ...DEFAULT_PROFILE,
    companyId,
    updatedAt: new Date().toISOString(),
  };
  records.push(newProfile);
  await writeJsonFile(profileFilePath, records);
  return newProfile;
}

export async function updateCompanyProfile(
  companyId: string,
  updates: Partial<Omit<CompanyProfileData, "companyId">>
): Promise<CompanyProfileData> {
  const records = await readJsonFile<CompanyProfileData[]>(profileFilePath, []);
  const existingIndex = records.findIndex((r) => r.companyId === companyId);

  const currentProfile = existingIndex >= 0 ? records[existingIndex] : { ...DEFAULT_PROFILE, companyId };
  const updatedProfile: CompanyProfileData = {
    ...currentProfile,
    ...updates,
    companyId,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    records[existingIndex] = updatedProfile;
  } else {
    records.push(updatedProfile);
  }

  // 1. Write updated profile to companyProfile.json
  await writeJsonFile(profileFilePath, records);

  // 2. Cascade changes across all related JSON files:
  await syncAcrossCompanyFiles(companyId, updatedProfile);

  return updatedProfile;
}

async function syncAcrossCompanyFiles(companyId: string, profile: CompanyProfileData) {
  try {
    // A. Sync to data/users/users.json
    const users = await readJsonFile<any[]>(usersFilePath, []);
    let usersModified = false;
    for (const u of users) {
      if (u.id === companyId && u.role === "company") {
        if (profile.companyName && u.username !== profile.companyName) {
          u.username = profile.companyName;
          usersModified = true;
        }
        if (profile.primaryEmail && u.email !== profile.primaryEmail) {
          u.email = profile.primaryEmail;
          usersModified = true;
        }
      } else if (u.companyId === companyId && u.role === "company-management") {
        if (profile.companyName && u.username !== profile.companyName) {
          u.username = profile.companyName;
          usersModified = true;
        }
      }
    }
    if (usersModified) {
      await writeJsonFile(usersFilePath, users);
    }

    // B. Sync to data/company-management/audit.json
    const auditData = await readJsonFile<any[]>(auditFilePath, []);
    let auditModified = false;
    for (const item of auditData) {
      if (item.companyId === companyId && item.companyName !== profile.companyName) {
        item.companyName = profile.companyName;
        auditModified = true;
      }
    }
    if (auditModified) {
      await writeJsonFile(auditFilePath, auditData);
    }

    // C. Sync to data/company-management/reports.json
    const reportsData = await readJsonFile<any[]>(reportsFilePath, []);
    let reportsModified = false;
    for (const item of reportsData) {
      if (item.companyId === companyId && item.companyName !== profile.companyName) {
        item.companyName = profile.companyName;
        reportsModified = true;
      }
    }
    if (reportsModified) {
      await writeJsonFile(reportsFilePath, reportsData);
    }

    // D. Sync to data/company/governanceSettings.json
    const governance = await readJsonFile<any>(governanceFilePath, null);
    if (governance) {
      let govModified = false;
      if (profile.companyName && governance.organizationName !== profile.companyName) {
        governance.organizationName = profile.companyName;
        govModified = true;
      }
      if (profile.abn && governance.abn !== profile.abn) {
        governance.abn = profile.abn;
        govModified = true;
      }
      if (govModified) {
        await writeJsonFile(governanceFilePath, governance);
      }
    }

    // E. Sync to data/company/companySettings.json
    const settingsList = await readJsonFile<any[]>(settingsFilePath, []);
    let settingsModified = false;
    for (const s of settingsList) {
      if (s.companyId === companyId) {
        if (profile.logoUrl && s.logo !== profile.logoUrl) {
          s.logo = profile.logoUrl;
          settingsModified = true;
        }
        if (profile.timezone && s.selectedTimezone !== profile.timezone) {
          s.selectedTimezone = profile.timezone;
          settingsModified = true;
        }
      }
    }
    if (settingsModified) {
      await writeJsonFile(settingsFilePath, settingsList);
    }

    // F. Sync to data/company/localisation.json
    const localisationList = await readJsonFile<any[]>(localisationFilePath, []);
    let locModified = false;
    for (const loc of localisationList) {
      if (loc.companyId === companyId && loc.settings) {
        if (profile.timezone && loc.settings.primaryTimezone !== profile.timezone) {
          loc.settings.primaryTimezone = profile.timezone;
          loc.settings.timeStandard = `12-Hour AM/PM (${profile.timezone.split("/")[1] || "Local"} Time)`;
          locModified = true;
        }
        if (profile.defaultCurrency) {
          const curr = profile.defaultCurrency.includes("USD")
            ? "$12,500.00 USD"
            : profile.defaultCurrency.includes("GBP")
            ? "£12,500.00 GBP"
            : profile.defaultCurrency.includes("EUR")
            ? "€12,500.00 EUR"
            : "$12,500.00 AUD";
          if (loc.settings.currencyStandard !== curr) {
            loc.settings.currencyStandard = curr;
            locModified = true;
          }
        }
      }
    }
    if (locModified) {
      await writeJsonFile(localisationFilePath, localisationList);
    }
  } catch (err) {
    console.error("Failed to cascade company profile updates:", err);
  }
}
