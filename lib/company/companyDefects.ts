import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { DefectItem } from "@/components/company-management/warranty/WarrantyStats";

export interface CompanyDefectRecord extends DefectItem {
  companyId: string;
}

const defectsFilePath = path.join(process.cwd(), "data", "company", "companyDefects.json");

const INITIAL_DEFECTS: DefectItem[] = [
  {
    id: "DEF-001",
    projectId: "208",
    clientName: "Sarah Jenkins",
    title: "Garage door alignment issue",
    area: "Garage",
    priority: "High",
    reported: "2026-07-25",
    status: "resolved",
    assignedSupervisor: "Eric",
    description: "Garage door rollers are catching on the tracks during closure, preventing it from sealing properly at the base."
  },
  {
    id: "DEF-002",
    projectId: "104",
    clientName: "Anuradha Harshana",
    title: "Hairline crack – master bedroom wall",
    area: "Bedroom 1",
    priority: "Low",
    reported: "2026-07-28",
    status: "in-progress",
    assignedSupervisor: "Eric",
    description: "Small hairline crack has appeared along the plaster joint above the walk-in wardrobe door."
  },
  {
    id: "DEF-003",
    projectId: "104",
    clientName: "Anuradha Harshana",
    title: "Laundry tap dripping",
    area: "Laundry",
    priority: "Medium",
    reported: "2026-08-01",
    status: "open",
    assignedSupervisor: "Unassigned",
    description: "The cold water tap in the laundry basin is dripping continuously at a rate of 1 drip per 5 seconds, causing moisture build-up."
  },
  {
    id: "DEF-004",
    projectId: "312",
    clientName: "Marcus Vance",
    title: "Kitchen splashback silicone peeling",
    area: "Kitchen",
    priority: "Low",
    reported: "2026-08-03",
    status: "open",
    assignedSupervisor: "Unassigned",
    description: "The silicone seal between the stone benchtop and glass splashback is peeling behind the sink."
  }
];

const DEFAULT_COMPANY_ID = "7ab56015-4412-494e-8aff-dbb5095e0095";

async function readDefectsRecords(): Promise<CompanyDefectRecord[]> {
  try {
    const data = await fs.readFile(defectsFilePath, "utf-8");
    const parsed = JSON.parse(data) as CompanyDefectRecord[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    // File doesn't exist or is empty
  }

  // Seed default data
  const seeded: CompanyDefectRecord[] = INITIAL_DEFECTS.map((d) => ({
    ...d,
    companyId: DEFAULT_COMPANY_ID,
  }));

  try {
    await fs.writeFile(defectsFilePath, JSON.stringify(seeded, null, 2), "utf-8");
  } catch (writeErr) {
    console.error("Failed to seed initial company defects:", writeErr);
  }

  return seeded;
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
