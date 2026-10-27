import fs from "fs/promises";
import path from "path";

export interface CompanySettingsData {
  companyId: string;
  logo: string;
  logoName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  selectedLocale: string;
  selectedTimezone: string;
  updatedAt?: string;
}

const settingsFilePath = path.join(process.cwd(), "data", "company", "companySettings.json");
const profileFilePath = path.join(process.cwd(), "data", "company", "companyProfile.json");
const localisationFilePath = path.join(process.cwd(), "data", "company", "localisation.json");

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read JSON at ${filePath}:`, err);
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function readSettingsRecords(): Promise<CompanySettingsData[]> {
  return await readJsonFile<CompanySettingsData[]>(settingsFilePath, []);
}

async function writeSettingsRecords(records: CompanySettingsData[]) {
  await writeJsonFile(settingsFilePath, records);
}

export async function getCompanySettings(companyId: string): Promise<CompanySettingsData | null> {
  const records = await readSettingsRecords();
  return records.find((r) => r.companyId === companyId) || null;
}

export async function updateCompanySettings(
  companyId: string,
  settings: Omit<CompanySettingsData, "companyId" | "updatedAt">
): Promise<CompanySettingsData> {
  const records = await readSettingsRecords();
  const existingIndex = records.findIndex((r) => r.companyId === companyId);
  const updatedRecord: CompanySettingsData = {
    companyId,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    records[existingIndex] = updatedRecord;
  } else {
    records.push(updatedRecord);
  }

  await writeSettingsRecords(records);

  // Sync settings across localisation and profile files
  await cascadeSettingsChanges(companyId, updatedRecord);

  return updatedRecord;
}

async function cascadeSettingsChanges(companyId: string, settings: CompanySettingsData) {
  try {
    // 1. Sync to data/company/localisation.json
    const localisationList = await readJsonFile<any[]>(localisationFilePath, []);
    let locModified = false;
    for (const item of localisationList) {
      if (item.companyId === companyId && item.settings) {
        if (settings.selectedLocale) {
          item.settings.defaultLocale = settings.selectedLocale;
          if (settings.selectedLocale === "en-GB") {
            item.settings.defaultLocaleLabel = "English (en-GB)";
            item.settings.currencyStandard = "£12,500.00 GBP";
            item.settings.dateStandard = "06/08/2026 (DD/MM/YYYY)";
          } else if (settings.selectedLocale === "en-US") {
            item.settings.defaultLocaleLabel = "English (en-US)";
            item.settings.currencyStandard = "$12,500.00 USD";
            item.settings.dateStandard = "08/06/2026 (MM/DD/YYYY)";
          } else {
            item.settings.defaultLocaleLabel = "English (en-AU)";
            item.settings.currencyStandard = "$12,500.00 AUD";
            item.settings.dateStandard = "06/08/2026 (DD/MM/YYYY)";
          }
          locModified = true;
        }

        if (settings.selectedTimezone) {
          item.settings.primaryTimezone = settings.selectedTimezone;
          const tzCity = settings.selectedTimezone.split("/")[1]?.replace("_", " ") || "Local";
          item.settings.timeStandard = `12-Hour AM/PM (${tzCity} Time)`;
          locModified = true;
        }
        item.updatedAt = new Date().toISOString();
      }
    }
    if (locModified) {
      await writeJsonFile(localisationFilePath, localisationList);
    }

    // 2. Sync to data/company/companyProfile.json
    const profileList = await readJsonFile<any[]>(profileFilePath, []);
    let profileModified = false;
    for (const p of profileList) {
      if (p.companyId === companyId) {
        if (settings.logo && p.logoUrl !== settings.logo) {
          p.logoUrl = settings.logo;
          profileModified = true;
        }
        if (settings.selectedTimezone && p.timezone !== settings.selectedTimezone) {
          p.timezone = settings.selectedTimezone;
          profileModified = true;
        }
        if (settings.selectedLocale) {
          const newCurrency = settings.selectedLocale === "en-GB"
            ? "GBP (£)"
            : settings.selectedLocale === "en-US"
            ? "USD ($)"
            : "AUD ($)";
          if (p.defaultCurrency !== newCurrency) {
            p.defaultCurrency = newCurrency;
            profileModified = true;
          }
        }
        p.updatedAt = new Date().toISOString();
      }
    }
    if (profileModified) {
      await writeJsonFile(profileFilePath, profileList);
    }
  } catch (err) {
    console.error("Failed to cascade settings changes:", err);
  }
}
