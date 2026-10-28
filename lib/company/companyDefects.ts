import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { DefectItem } from "@/components/company-management/warranty/WarrantyStats";

export interface CompanyDefectRecord extends DefectItem {
  companyId: string;
}

const defectsFilePath = path.join(process.cwd(), "data", "company", "companyDefects.json");

async function readDefectsRecords(): Promise<CompanyDefectRecord[]> {
  return JSON.parse(await fs.readFile(defectsFilePath, "utf8"));
}

async function writeDefectsRecords(records: CompanyDefectRecord[]): Promise<void> {
  await fs.writeFile(defectsFilePath, JSON.stringify(records, null, 2), "utf-8");
}

export async function getCompanyDefects(companyId: string): Promise<CompanyDefectRecord[]> {
  const records = await readDefectsRecords();
  return records.filter((d) => d.companyId === companyId);
}

export async function updateCompanyDefect(
  companyId: string,
  defectId: string,
  updates: Partial<Omit<CompanyDefectRecord, "id" | "companyId">>
): Promise<CompanyDefectRecord | null> {
  const records = await readDefectsRecords();
  const defect = records.find((d) => d.id === defectId && d.companyId === companyId);
  if (!defect) return null;

  Object.assign(defect, updates);
  await writeDefectsRecords(records);
  return defect;
}

export async function createCompanyDefect(
  companyId: string,
  defect: Omit<CompanyDefectRecord, "id" | "companyId">
): Promise<CompanyDefectRecord> {
  const records = await readDefectsRecords();
  const newDefect: CompanyDefectRecord = {
    ...defect,
    id: `DEF-${String(records.length + 1).padStart(3, "0")}`,
    companyId,
  };

  records.unshift(newDefect);
  await writeDefectsRecords(records);
  return newDefect;
}

export async function deleteCompanyDefect(companyId: string, defectId: string): Promise<boolean> {
  const records = await readDefectsRecords();
  const filtered = records.filter((d) => !(d.id === defectId && d.companyId === companyId));

  if (filtered.length === records.length) return false;
  await writeDefectsRecords(filtered);
  return true;
}
