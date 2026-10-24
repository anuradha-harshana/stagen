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

const DEFAULT_COMPANY_ID = "7ab56015-4412-494e-8aff-dbb5095e0095";

export const DEFAULT_AUDIT_DATA: CompanyAuditRecord = {
  companyId: DEFAULT_COMPANY_ID,
  companyName: "Build & Co",
  updatedAt: new Date().toISOString(),
  stats: {
    complianceScore: {
      value: "92%",
      rating: "Good Standing",
      description: "ISO 27001 & Safety Verified",
    },
    openFlags: {
      value: 3,
      rating: "Needs Review",
      description: "2 Safety, 1 Document Gap",
    },
    auditsCompleted: {
      value: 142,
      description: "YTD Site & Financial Audits",
    },
    dataIntegrityScore: {
      value: "98.4%",
      description: "✓ Encrypted & Verified",
    },
  },
  complianceReadiness: {
    score: 92,
    rating: "Good Standing",
    description: "Automated audit rating based on active site compliance policies",
    categories: [
      {
        id: "cat-safety",
        name: "Site Safety & Hazard Audits",
        score: 96,
        color: "emerald",
      },
      {
        id: "cat-docs",
        name: "Document Verification & Blueprint Sign-offs",
        score: 94,
        color: "emerald",
      },
      {
        id: "cat-fin",
        name: "Financial & Invoice Audit Trail",
        score: 98,
        color: "blue",
      },
      {
        id: "cat-workload",
        name: "Supervisor Workload & Checklists",
        score: 88,
        color: "amber",
      },
    ],
    regulatoryFrameworks: [
      {
        id: "fw-iso27001",
        name: "ISO/IEC 27001:2022",
        standard: "Information Security & Data Integrity",
        status: "Certified",
        score: 96,
        lastAudit: "2026-04-12",
      },
      {
        id: "fw-ncc2026",
        name: "NCC 2026 / Building Code of Australia",
        standard: "Structural & Energy Efficiency Compliance",
        status: "Compliant",
        score: 94,
        lastAudit: "2026-05-01",
      },
      {
        id: "fw-whs",
        name: "Work Health and Safety (WHS) Act 2011",
        standard: "Site Safety & Subcontractor Induction",
        status: "Verified",
        score: 96,
        lastAudit: "2026-05-10",
      },
      {
        id: "fw-sopa",
        name: "Security of Payment Act (SOPA)",
        standard: "Progress Claim & Milestone Integrity",
        status: "Compliant",
        score: 98,
        lastAudit: "2026-05-11",
      },
    ],
  },
  logs: [
    {
      id: "LOG-9041",
      timestamp: "May 14, 2026 10:24 AM",
      user: "Sarah Johnson",
      role: "Company Admin",
      action: "Updated Project",
      module: "Projects",
      details: "P-1028 Stage 4 Lockup completion approved",
      ipAddress: "203.0.113.42 (Sydney, AU)",
      severity: "Info",
    },
    {
      id: "LOG-9040",
      timestamp: "May 14, 2026 09:18 AM",
      user: "John Smith",
      role: "Supervisor",
      action: "Uploaded Document",
      module: "Documents",
      details: "Invoice_1038_Signed.pdf uploaded to site B-402",
      ipAddress: "198.51.100.18 (Melbourne, AU)",
      severity: "Info",
    },
    {
      id: "LOG-9039",
      timestamp: "May 13, 2026 04:35 PM",
      user: "Michael Lee",
      role: "Company Admin",
      action: "Created Warranty",
      module: "Warranty",
      details: "Warranty claim W-2048 registered for Unit 12",
      ipAddress: "203.0.113.88 (Brisbane, AU)",
      severity: "Warning",
    },
    {
      id: "LOG-9038",
      timestamp: "May 13, 2026 02:11 PM",
      user: "System Security Bot",
      role: "System",
      action: "Failed Login Attempt",
      module: "Settings",
      details: "Multiple failed password attempts for user ID admin@stagen.com",
      ipAddress: "198.51.100.201 (Perth, AU)",
      severity: "Critical",
    },
    {
      id: "LOG-9037",
      timestamp: "May 12, 2026 11:45 AM",
      user: "Emma Davis",
      role: "Financial Officer",
      action: "Modified Invoice",
      module: "Billing",
      details: "Adjusted payment status on INV-2026-077 to Paid",
      ipAddress: "203.0.113.15 (Sydney, AU)",
      severity: "Info",
    },
    {
      id: "LOG-9036",
      timestamp: "May 12, 2026 09:05 AM",
      user: "David Miller",
      role: "Supervisor",
      action: "Deleted Document",
      module: "Documents",
      details: "Removed outdated blueprint_v1.pdf from project P-901",
      ipAddress: "198.51.100.44 (Adelaide, AU)",
      severity: "Warning",
    },
    {
      id: "LOG-9035",
      timestamp: "May 11, 2026 03:50 PM",
      user: "Sarah Johnson",
      role: "Company Admin",
      action: "Updated Permissions",
      module: "Users",
      details: "Assigned Supervisor role to new user ID sup_tom@stagen.com",
      ipAddress: "203.0.113.42 (Sydney, AU)",
      severity: "Info",
    },
  ],
};

// ── File I/O Helpers ──

export async function readAuditRecords(): Promise<CompanyAuditRecord[]> {
  try {
    const raw = await fs.readFile(auditFilePath, "utf8");
    const records = JSON.parse(raw);
    if (Array.isArray(records) && records.length > 0) {
      return records as CompanyAuditRecord[];
    }
    return [DEFAULT_AUDIT_DATA];
  } catch (error) {
    return [DEFAULT_AUDIT_DATA];
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
  const targetId = companyId || DEFAULT_COMPANY_ID;
  let record = records.find(
    (r) => r.companyId === targetId || r.companyId === DEFAULT_COMPANY_ID
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
      input.ipAddress?.trim() || "203.0.113.42 (Melbourne, AU)",
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
