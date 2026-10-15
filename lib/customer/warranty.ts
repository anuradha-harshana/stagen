import fs from "fs/promises";
import path from "path";

export type WarrantyStatus = "Active" | "Expiring Soon" | "Expired";
export type ServiceStatus = "completed" | "scheduled" | "upcoming";
export type DefectStatus = "open" | "in-progress" | "resolved";

export interface WarrantyItem {
  id: string;
  icon_key: string;
  title: string;
  provider: string;
  period: string;
  expiry: string;
  status: WarrantyStatus;
  description: string;
  years_total: number;
  years_left: number;
}

export interface MaintenanceItem {
  id: string;
  title: string;
  date: string;
  provider: string;
  status: ServiceStatus;
  notes: string;
}

export interface DefectItem {
  id: string;
  title: string;
  area: string;
  reported: string;
  status: DefectStatus;
  reported_by?: string;
}

export interface TenantWarrantyData {
  tenant_id: string;
  warranties: WarrantyItem[];
  maintenance: MaintenanceItem[];
  defects: DefectItem[];
}

const warrantyFilePath = path.join(process.cwd(), "data", "tenants", "tenant_warranty.json");

// Helper: Format current date like "Mar 15, 2026"
function formatDate(date: Date = new Date()): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Helper: Read raw file content
async function readWarrantyFile(): Promise<TenantWarrantyData | TenantWarrantyData[]> {
  try {
    const raw = await fs.readFile(warrantyFilePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return {
      tenant_id: "tenant-lot-104",
      warranties: [],
      maintenance: [],
      defects: [],
    };
  }
}

// Helper: Write raw file content
async function writeWarrantyFile(data: TenantWarrantyData | TenantWarrantyData[]) {
  await fs.writeFile(warrantyFilePath, JSON.stringify(data, null, 2), "utf8");
}

// Helper: Resolve data for specific tenant
function resolveTenantRecord(
  all: TenantWarrantyData | TenantWarrantyData[],
  tenantId: string
): TenantWarrantyData {
  if (Array.isArray(all)) {
    const found = all.find((item) => item.tenant_id === tenantId);
    return (
      found ||
      all[0] || {
        tenant_id: tenantId,
        warranties: [],
        maintenance: [],
        defects: [],
      }
    );
  }
  return all;
}

// Helper: Update record within data structure
function updateWarrantyDataStructure(
  all: TenantWarrantyData | TenantWarrantyData[],
  tenantId: string,
  updated: TenantWarrantyData
): TenantWarrantyData | TenantWarrantyData[] {
  if (Array.isArray(all)) {
    const index = all.findIndex((item) => item.tenant_id === tenantId);
    if (index === -1) {
      all.push(updated);
    } else {
      all[index] = updated;
    }
    return all;
  }
  return updated;
}

// ── 1. READ (GET) ──
export async function getTenantWarranty(tenantId = "tenant-lot-104"): Promise<TenantWarrantyData> {
  const all = await readWarrantyFile();
  return resolveTenantRecord(all, tenantId);
}

// ── 2. DEFECTS CRUD ──

export async function createTenantDefect(
  tenantId = "tenant-lot-104",
  defectData: Omit<DefectItem, "id" | "reported"> & { reported?: string }
): Promise<DefectItem> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const newId = `DEF-${(record.defects.length + 1).toString().padStart(3, "0")}`;
  const newDefect: DefectItem = {
    ...defectData,
    id: newId,
    reported: defectData.reported || formatDate(),
    status: defectData.status || "open",
  };

  record.defects.unshift(newDefect); // Add new defect at the top

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return newDefect;
}

export async function updateTenantDefect(
  tenantId = "tenant-lot-104",
  defectId: string,
  updates: Partial<DefectItem>
): Promise<DefectItem | null> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const index = record.defects.findIndex((d) => d.id === defectId);
  if (index === -1) return null;

  record.defects[index] = {
    ...record.defects[index],
    ...updates,
  };

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return record.defects[index];
}

export async function deleteTenantDefect(
  tenantId = "tenant-lot-104",
  defectId: string
): Promise<boolean> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const initialCount = record.defects.length;
  record.defects = record.defects.filter((d) => d.id !== defectId);

  if (record.defects.length === initialCount) return false;

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return true;
}

// ── 3. WARRANTIES CRUD ──

export async function createTenantWarranty(
  tenantId = "tenant-lot-104",
  warrantyData: Omit<WarrantyItem, "id">
): Promise<WarrantyItem> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const newId = `w-${(record.warranties.length + 1).toString().padStart(3, "0")}`;
  const newWarranty: WarrantyItem = {
    ...warrantyData,
    id: newId,
  };

  record.warranties.push(newWarranty);

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return newWarranty;
}

export async function updateTenantWarranty(
  tenantId = "tenant-lot-104",
  warrantyId: string,
  updates: Partial<WarrantyItem>
): Promise<WarrantyItem | null> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const index = record.warranties.findIndex((w) => w.id === warrantyId);
  if (index === -1) return null;

  record.warranties[index] = {
    ...record.warranties[index],
    ...updates,
  };

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return record.warranties[index];
}

export async function deleteTenantWarranty(
  tenantId = "tenant-lot-104",
  warrantyId: string
): Promise<boolean> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const initialCount = record.warranties.length;
  record.warranties = record.warranties.filter((w) => w.id !== warrantyId);

  if (record.warranties.length === initialCount) return false;

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return true;
}

// ── 4. MAINTENANCE CRUD ──

export async function createTenantMaintenance(
  tenantId = "tenant-lot-104",
  maintenanceData: Omit<MaintenanceItem, "id">
): Promise<MaintenanceItem> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const newId = `m-${(record.maintenance.length + 1).toString().padStart(3, "0")}`;
  const newMaintenance: MaintenanceItem = {
    ...maintenanceData,
    id: newId,
  };

  record.maintenance.push(newMaintenance);

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return newMaintenance;
}

export async function updateTenantMaintenance(
  tenantId = "tenant-lot-104",
  maintenanceId: string,
  updates: Partial<MaintenanceItem>
): Promise<MaintenanceItem | null> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const index = record.maintenance.findIndex((m) => m.id === maintenanceId);
  if (index === -1) return null;

  record.maintenance[index] = {
    ...record.maintenance[index],
    ...updates,
  };

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return record.maintenance[index];
}

export async function deleteTenantMaintenance(
  tenantId = "tenant-lot-104",
  maintenanceId: string
): Promise<boolean> {
  const all = await readWarrantyFile();
  const record = resolveTenantRecord(all, tenantId);

  const initialCount = record.maintenance.length;
  record.maintenance = record.maintenance.filter((m) => m.id !== maintenanceId);

  if (record.maintenance.length === initialCount) return false;

  const updatedAll = updateWarrantyDataStructure(all, tenantId, record);
  await writeWarrantyFile(updatedAll);

  return true;
}
