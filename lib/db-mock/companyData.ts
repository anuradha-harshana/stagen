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

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  action: string;
  category: "Security" | "Project Update" | "Document Access" | "Settings" | "User Management";
  resource: string;
  ipAddress: string;
  location: string;
  severity: "Info" | "Warning" | "Critical";
  details: Record<string, any>;
}

export interface AIFaqTrend {
  id: string;
  category: "Stage Timelines" | "Invoices & Payments" | "Warranty Claims" | "Site Access & Inspections" | "Variations & Specs";
  question: string;
  queryCount: number;
  aiResolutionRate: number; // e.g. 94.5%
  escalationCount: number; // escalated to supervisor
  status: "Optimized" | "Needs Review" | "Low Accuracy";
  sampleAnswer: string;
  lastTrained: string;
}

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: "Company Admin" | "Executive Management" | "Site Supervisor" | "Trade Contractor";
  phone: string;
  status: "Active" | "Pending" | "Suspended";
  assignedProjectsCount: number;
  assignedProjects: string[];
  lastActive: string;
  avatarBg: string;
}
