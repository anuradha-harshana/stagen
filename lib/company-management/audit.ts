import fs from "fs/promises";
import path from "path";
import {
  AuditLog,
  AuditStatItem,
  AuditStats,
  ComplianceCategory,
  ComplianceFramework,
  ComplianceReadiness,
  CompanyAuditRecord,
} from "@/lib/types/audit";

export type {
  AuditLog,
  AuditStatItem,
  AuditStats,
  ComplianceCategory,
  ComplianceFramework,
  ComplianceReadiness,
  CompanyAuditRecord,
};

const auditFilePath = path.join(
  process.cwd(),
  "data",
  "company-management",
  "audit.json"
);



export const DEFAULT_AUDIT_DATA: CompanyAuditRecord = {
  companyId: "", companyName: "", updatedAt: "", logs: [],
  stats: { complianceScore: { value: "Not assessed" }, openFlags: { value: 0 }, auditsCompleted: { value: 0 }, dataIntegrityScore: { value: "Not assessed" } },
  complianceReadiness: { score: 0, rating: "Not assessed", description: "No audit data recorded", categories: [], regulatoryFrameworks: [] }
};
// ── File I/O Helpers ──

export async function readAuditRecords(): Promise<CompanyAuditRecord[]> {
  try {
    const raw = await fs.readFile(auditFilePath, "utf8");
    const records = JSON.parse(raw);
    if (Array.isArray(records) && records.length > 0) {
      return records as CompanyAuditRecord[];
    }
    return [];
  } catch (error) {
    return [];
  }
}

export async function writeAuditRecords(
  records: CompanyAuditRecord[]
): Promise<void> {
  const dir = path.dirname(auditFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(auditFilePath, JSON.stringify(records, null, 2), "utf8");
}

function findOrCreateCompanyRecord(
  records: CompanyAuditRecord[],
  companyId?: string
): CompanyAuditRecord {
  const targetId = companyId || "";
  let record = records.find(
    (r) => r.companyId === targetId
  );

  if (!record) {
    record = {
      ...DEFAULT_AUDIT_DATA,
      companyId: targetId,
      updatedAt: new Date().toISOString(),
    };
    records.push(record);
  }

  return record;
}

// ── 1. READ: Get full company audit and compliance data ──

export async function getCompanyAuditData(
  companyId?: string
): Promise<CompanyAuditRecord> {
  const records = await readAuditRecords();
  return findOrCreateCompanyRecord(records, companyId);
}

// ── 2. READ: Get audit logs with optional filtering ──

export async function getAuditLogs(
  companyId?: string,
  filter?: {
    search?: string;
    module?: string;
    severity?: string;
  }
): Promise<AuditLog[]> {
  const data = await getCompanyAuditData(companyId);
  let logs = data.logs ?? [];

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.user.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  }

  if (filter?.module && filter.module !== "All") {
    logs = logs.filter((l) => l.module === filter.module);
  }

  if (filter?.severity && filter.severity !== "All") {
    logs = logs.filter((l) => l.severity === filter.severity);
  }

  return logs;
}

// ── 3. CREATE: Add new audit log record ──

export async function createAuditLog(
  companyId: string,
  input: {
    user: string;
    role: string;
    action: string;
    module: string;
    details: string;
    ipAddress?: string;
    severity?: "Info" | "Warning" | "Critical";
  }
): Promise<AuditLog> {
  const records = await readAuditRecords();
  const company = findOrCreateCompanyRecord(records, companyId);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatted = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const timestamp = `${dateFormatted} ${timeFormatted}`;

  const randomNum = Math.floor(9042 + company.logs.length + Math.random() * 50);
  const newId = `LOG-${randomNum}`;

  const severity = input.severity || "Info";

  const newLog: AuditLog = {
    id: newId,
    timestamp,
    user: input.user.trim(),
    role: input.role.trim(),
    action: input.action.trim(),
    module: input.module.trim(),
    details: input.details.trim(),
    ipAddress:
      input.ipAddress?.trim() || "Not recorded",
    severity,
  };

  company.logs.unshift(newLog);
  company.updatedAt = now.toISOString();

  // If new log is Warning or Critical, increment open compliance flags
  if (severity === "Warning" || severity === "Critical") {
    const currentFlags = Number(company.stats.openFlags.value) || 0;
    company.stats.openFlags.value = currentFlags + 1;
  }

  // Increment audits completed
  const currentAudits = Number(company.stats.auditsCompleted.value) || 0;
  company.stats.auditsCompleted.value = currentAudits + 1;

  await writeAuditRecords(records);
  return newLog;
}

// ── 4. UPDATE: Modify an audit log record ──

export async function updateAuditLog(
  companyId: string,
  logId: string,
  updates: Partial<AuditLog>
): Promise<AuditLog | null> {
  const records = await readAuditRecords();
  const company = findOrCreateCompanyRecord(records, companyId);

  const index = company.logs.findIndex((l) => l.id === logId);
  if (index === -1) return null;

  const previousSeverity = company.logs[index].severity;
  const updatedLog = {
    ...company.logs[index],
    ...updates,
  };

  company.logs[index] = updatedLog;
  company.updatedAt = new Date().toISOString();

  // Recalculate open flags if severity changed
  if (updates.severity && updates.severity !== previousSeverity) {
    const openFlagsCount = company.logs.filter(
      (l) => l.severity === "Warning" || l.severity === "Critical"
    ).length;
    company.stats.openFlags.value = openFlagsCount;
  }

  await writeAuditRecords(records);
  return updatedLog;
}

// ── 5. DELETE: Remove an audit log record ──

export async function deleteAuditLog(
  companyId: string,
  logId: string
): Promise<boolean> {
  const records = await readAuditRecords();
  const company = findOrCreateCompanyRecord(records, companyId);

  const initialLength = company.logs.length;
  const removedLog = company.logs.find((l) => l.id === logId);

  company.logs = company.logs.filter((l) => l.id !== logId);

  if (company.logs.length === initialLength) {
    return false;
  }

  company.updatedAt = new Date().toISOString();

  // If deleted log was Warning or Critical, adjust open flags
  if (
    removedLog &&
    (removedLog.severity === "Warning" || removedLog.severity === "Critical")
  ) {
    const openFlagsCount = company.logs.filter(
      (l) => l.severity === "Warning" || l.severity === "Critical"
    ).length;
    company.stats.openFlags.value = openFlagsCount;
  }

  await writeAuditRecords(records);
  return true;
}

// ── 6. UPDATE: Update overall stats or readiness ──

export async function updateComplianceStats(
  companyId: string,
  statsUpdates: Partial<AuditStats>
): Promise<CompanyAuditRecord> {
  const records = await readAuditRecords();
  const company = findOrCreateCompanyRecord(records, companyId);

  company.stats = {
    ...company.stats,
    ...statsUpdates,
  };
  company.updatedAt = new Date().toISOString();

  await writeAuditRecords(records);
  return company;
}

export async function updateComplianceCategory(
  companyId: string,
  categoryId: string,
  newScore: number
): Promise<CompanyAuditRecord> {
  const records = await readAuditRecords();
  const company = findOrCreateCompanyRecord(records, companyId);

  const category = company.complianceReadiness.categories.find(
    (c) => c.id === categoryId
  );
  if (category) {
    category.score = Math.max(0, Math.min(100, newScore));

    // Recalculate average overall score
    const avg = Math.round(
      company.complianceReadiness.categories.reduce(
        (sum, c) => sum + c.score,
        0
      ) / company.complianceReadiness.categories.length
    );
    company.complianceReadiness.score = avg;
    company.stats.complianceScore.value = `${avg}%`;
  }

  company.updatedAt = new Date().toISOString();
  await writeAuditRecords(records);
  return company;
}
