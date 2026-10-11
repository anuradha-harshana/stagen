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

async function readSettingsRecords(): Promise<CompanySettingsData[]> {
  try {
    const data = await fs.readFile(settingsFilePath, "utf-8");
    return JSON.parse(data) as CompanySettingsData[];
  } catch (err) {
    console.error("Failed to read company settings JSON:", err);
    return [];
  }
}

async function writeSettingsRecords(records: CompanySettingsData[]) {
  await fs.writeFile(settingsFilePath, JSON.stringify(records, null, 2), "utf-8");
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
  return updatedRecord;
}
