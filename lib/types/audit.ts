export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: "Projects" | "Documents" | "Warranty" | "Billing" | "Users" | "Settings" | string;
  details: string;
  ipAddress: string;
  severity: "Info" | "Warning" | "Critical";
}

export interface AuditStatItem {
  value: string | number;
  rating?: string;
  description?: string;
}

export interface AuditStats {
  complianceScore: AuditStatItem;
  openFlags: AuditStatItem;
  auditsCompleted: AuditStatItem;
  dataIntegrityScore: AuditStatItem;
}

export interface ComplianceCategory {
  id: string;
  name: string;
  score: number;
  color?: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  standard: string;
  status: "Certified" | "Compliant" | "Verified" | "Pending Review";
  score: number;
  lastAudit: string;
}

export interface ComplianceReadiness {
  score: number;
  rating: string;
  description: string;
  categories: ComplianceCategory[];
  regulatoryFrameworks?: ComplianceFramework[];
}

export interface CompanyAuditRecord {
  companyId: string;
  companyName: string;
  updatedAt: string;
  stats: AuditStats;
  complianceReadiness: ComplianceReadiness;
  logs: AuditLog[];
}
