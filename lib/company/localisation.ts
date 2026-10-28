import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export interface TranslationKey {
  id: string;
  key: string;
  category: "General" | "Dashboard" | "Progress" | "Invoices" | "Warranty" | "AI Assistant";
  enAU: string;
  zhCN: string;
  viVN: string;
  esES: string;
  lastUpdated: string;
  status: "Translated" | "Pending Review" | "Missing";
}

export interface LocalisationSettings {
  defaultLocale: string;
  defaultLocaleLabel: string;
  regionStandard: string;
  supportedLanguages: { code: string; name: string }[];
  primaryTimezone: string;
  timezoneLabel: string;
  currencyStandard: string;
  dateStandard: string;
  timeStandard: string;
}

export interface CompanyLocalisationRecord {
  companyId: string;
  settings: LocalisationSettings;
  translationKeys: TranslationKey[];
  updatedAt?: string;
}

const localisationFile = path.join(process.cwd(), "data", "company", "localisation.json");

const DEFAULT_SETTINGS: LocalisationSettings = {
  defaultLocale: "en-AU",
  defaultLocaleLabel: "English (en-AU)",
  regionStandard: "Australian Regional Standard",
  supportedLanguages: [
    { code: "en-AU", name: "English (Australia)" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "vi-VN", name: "Vietnamese" },
    { code: "es-ES", name: "Spanish" },
  ],
  primaryTimezone: "Australia/Sydney",
  timezoneLabel: "AEST / AEDT Format",
  currencyStandard: "$12,500.00 AUD",
  dateStandard: "06/08/2026 (DD/MM/YYYY)",
  timeStandard: "12-Hour AM/PM (Sydney Time)",
};

const DEFAULT_KEYS: TranslationKey[] = [];

async function readLocalisationRecords(): Promise<CompanyLocalisationRecord[]> {
  try {
    const fileContents = await fs.readFile(localisationFile, "utf8");
    return JSON.parse(fileContents) as CompanyLocalisationRecord[];
  } catch (error) {
    return [];
  }
}

async function writeLocalisationRecords(records: CompanyLocalisationRecord[]) {
  await fs.writeFile(localisationFile, JSON.stringify(records, null, 2), "utf8");
}

function findOrCreateCompanyRecord(
  records: CompanyLocalisationRecord[],
  companyId: string
): CompanyLocalisationRecord {
  let record = records.find((item) => item.companyId === companyId);
  if (!record) {
    record = {
      companyId,
      settings: { ...DEFAULT_SETTINGS },
      translationKeys: [...DEFAULT_KEYS],
      updatedAt: new Date().toISOString(),
    };
    records.push(record);
  }
  return record;
}

export async function getCompanyLocalisationData(
  companyId: string
): Promise<CompanyLocalisationRecord> {
  const records = await readLocalisationRecords();
  return findOrCreateCompanyRecord(records, companyId);
}

export async function createTranslationKey(
  companyId: string,
  input: {
    key: string;
    category: TranslationKey["category"];
    enAU: string;
    zhCN?: string;
    viVN?: string;
    esES?: string;
    status?: TranslationKey["status"];
  }
): Promise<TranslationKey> {
  const records = await readLocalisationRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const now = new Date().toISOString().split("T")[0];

  const newKey: TranslationKey = {
    id: `TR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    key: input.key.trim(),
    category: input.category || "General",
    enAU: input.enAU.trim(),
    zhCN: input.zhCN ? input.zhCN.trim() : "",
    viVN: input.viVN ? input.viVN.trim() : "",
    esES: input.esES ? input.esES.trim() : "",
    lastUpdated: now,
    status: input.status || "Translated",
  };

  company.translationKeys.unshift(newKey);
  company.updatedAt = new Date().toISOString();

  await writeLocalisationRecords(records);
  return newKey;
}

export async function updateTranslationKey(
  companyId: string,
  input: TranslationKey
): Promise<TranslationKey | null> {
  const records = await readLocalisationRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const index = company.translationKeys.findIndex((item) => item.id === input.id);

  if (index === -1) {
    return null;
  }

  const now = new Date().toISOString().split("T")[0];
  const updatedKey: TranslationKey = {
    ...company.translationKeys[index],
    key: input.key.trim(),
    category: input.category || company.translationKeys[index].category,
    enAU: input.enAU.trim(),
    zhCN: input.zhCN ? input.zhCN.trim() : "",
    viVN: input.viVN ? input.viVN.trim() : "",
    esES: input.esES ? input.esES.trim() : "",
    status: input.status || company.translationKeys[index].status,
    lastUpdated: now,
  };

  company.translationKeys[index] = updatedKey;
  company.updatedAt = new Date().toISOString();

  await writeLocalisationRecords(records);
  return updatedKey;
}

export async function deleteTranslationKey(
  companyId: string,
  keyId: string
): Promise<boolean> {
  const records = await readLocalisationRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const initialLength = company.translationKeys.length;

  company.translationKeys = company.translationKeys.filter((item) => item.id !== keyId);

  if (company.translationKeys.length === initialLength) {
    return false;
  }

  company.updatedAt = new Date().toISOString();
  await writeLocalisationRecords(records);
  return true;
}

export async function updateLocalisationSettings(
  companyId: string,
  settings: Partial<LocalisationSettings>
): Promise<LocalisationSettings> {
  const records = await readLocalisationRecords();
  const company = findOrCreateCompanyRecord(records, companyId);

  company.settings = {
    ...company.settings,
    ...settings,
  };
  company.updatedAt = new Date().toISOString();

  await writeLocalisationRecords(records);
  return company.settings;
}
