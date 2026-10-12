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

// --- LOCALISATION MOCK DATA ---
export const MOCK_TRANSLATION_KEYS: TranslationKey[] = [
  {
    id: "TR-001",
    key: "dashboard.welcome_banner",
    category: "Dashboard",
    enAU: "Welcome back to your Build Progress OS",
    zhCN: "欢迎回到您的施工进度系统",
    viVN: "Chào mừng trở lại với Hệ thống Tiến độ Xây dựng",
    esES: "Bienvenido de nuevo a su Sistema de Progreso de Construcción",
    lastUpdated: "2026-08-01",
    status: "Translated"
  },
  {
    id: "TR-002",
    key: "progress.stage_slab_complete",
    category: "Progress",
    enAU: "Slab poured and inspected successfully",
    zhCN: "混凝土地基已浇筑并通过检验",
    viVN: "Móng bê tông đã đỗ và kiểm định thành công",
    esES: "Losa vertida e inspeccionada con éxito",
    lastUpdated: "2026-07-28",
    status: "Translated"
  },
  {
    id: "TR-003",
    key: "invoices.payment_due_reminder",
    category: "Invoices",
    enAU: "Progress payment for Frame Stage is due in 5 days",
    zhCN: "框架阶段进度款需在5天内支付",
    viVN: "Thanh toán tiến độ Giai đoạn Khung đỗ hạn trong 5 ngày",
    esES: "El pago de progreso para la Etapa de Estructura vence en 5 días",
    lastUpdated: "2026-08-02",
    status: "Translated"
  },
  {
    id: "TR-004",
    key: "warranty.report_defect_prompt",
    category: "Warranty",
    enAU: "Submit maintenance items with photos within your 90-day defect liability period",
    zhCN: "请在90天保修期内提交带有照片的维修项目",
    viVN: "Gửi các mục bảo trì kèm ảnh trong thời hạn bảo hành 90 ngày",
    esES: "Envíe los elementos de mantenimiento con fotos dentro de su período de garantía de 90 días",
    lastUpdated: "2026-07-15",
    status: "Translated"
  },
  {
    id: "TR-005",
    key: "ai.ask_assistant_placeholder",
    category: "AI Assistant",
    enAU: "Ask questions about your build, PCI inspections, or variations...",
    zhCN: "询问关于您的房屋建造、PCI验收或变更的问题...",
    viVN: "Đặt câu hỏi về công trình, kiểm tra PCI, hoặc thay đổi...",
    esES: "Haga preguntas sobre su construcción, inspecciones PCI o variaciones...",
    lastUpdated: "2026-08-04",
    status: "Translated"
  },
  {
    id: "TR-006",
    key: "stage.lockup_delayed_weather",
    category: "Progress",
    enAU: "Lockup stage extended due to severe weather delays in Melbourne Metro",
    zhCN: "因墨尔本大都会区恶劣天气延误，封顶阶段已延长",
    viVN: "Giai đoạn đóng cửa kéo dài do thời tiết xấu ở Melbourne Metro",
    esES: "Etapa de cerramiento extendida debido a demasías por mal tiempo en Melbourne Metro",
    lastUpdated: "2026-08-05",
    status: "Pending Review"
  }
];

// --- AUDIT LOGS MOCK DATA ---
export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "LOG-8821",
    timestamp: "2026-08-06 05:42:10",
    user: {
      name: "Marcus Vance",
      email: "marcus.vance@stagenhomes.com.au",
      role: "Company Admin",
    },
    action: "Updated Company Identity Settings",
    category: "Settings",
    resource: "Branding Config / Logo",
    ipAddress: "203.0.113.42",
    location: "Melbourne, VIC, AU",
    severity: "Info",
    details: {
      field: "Brand Logo & Colors",
      updatedBy: "Marcus Vance",
      previousValue: "logo_v1.png",
      newValue: "stagen_brand_v2.png"
    }
  },
  {
    id: "LOG-8820",
    timestamp: "2026-08-06 04:15:33",
    user: {
      name: "Dave Miller",
      email: "dave.m@stagenhomes.com.au",
      role: "Site Supervisor",
    },
    action: "Logged Delay Incident",
    category: "Project Update",
    resource: "Project #AU-104 (Lot 42 Greenvale)",
    ipAddress: "110.142.78.19",
    location: "Geelong, VIC, AU",
    severity: "Warning",
    details: {
      delayType: "Trade Shortage (Bricklayers)",
      durationDays: 4,
      affectedStage: "Frame to Lockup transition"
    }
  },
  {
    id: "LOG-8819",
    timestamp: "2026-08-05 22:04:11",
    user: {
      name: "Elena Rostova",
      email: "elena.r@stagenhomes.com.au",
      role: "Executive Management",
    },
    action: "Exported Monthly Compliance Report",
    category: "Document Access",
    resource: "Executive Warranty Audit PDF",
    ipAddress: "139.130.4.5",
    location: "Sydney, NSW, AU",
    severity: "Info",
    details: {
      reportType: "At-Risk Build Projects & Defect SLA Summary",
      recordsCount: 48
    }
  },
  {
    id: "LOG-8818",
    timestamp: "2026-08-05 18:30:00",
    user: {
      name: "System Security Guard",
      email: "security@stagenhomes.com.au",
      role: "System Automation",
    },
    action: "Failed Login Attempt Threshold",
    category: "Security",
    resource: "User Auth Service",
    ipAddress: "198.51.100.99",
    location: "Unknown IP (Flagged)",
    severity: "Critical",
    details: {
      attemptedEmail: "admin@stagenhomes.com.au",
      consecutiveFailures: 5,
      actionTaken: "IP address temporarily blacklisted for 60 minutes"
    }
  },
  {
    id: "LOG-8817",
    timestamp: "2026-08-05 14:12:45",
    user: {
      name: "Marcus Vance",
      email: "marcus.vance@stagenhomes.com.au",
      role: "Company Admin",
    },
    action: "Invited New User Account",
    category: "User Management",
    resource: "User Account: Sarah Jenkins",
    ipAddress: "203.0.113.42",
    location: "Melbourne, VIC, AU",
    severity: "Info",
    details: {
      assignedRole: "Site Supervisor",
      assignedProjects: ["Lot 12 Point Cook", "Lot 88 Tarneit"]
    }
  }
];

// --- AI & FAQ TRENDS MOCK DATA ---
export const MOCK_AI_FAQ_TRENDS: AIFaqTrend[] = [
  {
    id: "FAQ-01",
    category: "Stage Timelines",
    question: "When is my slab being poured and how long does concrete curing take?",
    queryCount: 342,
    aiResolutionRate: 96.2,
    escalationCount: 13,
    status: "Optimized",
    sampleAnswer: "Concrete slabs typically require 7 to 14 days of curing before framing begins. Your supervisor logs weather inspections live on your timeline.",
    lastTrained: "2026-08-01"
  },
  {
    id: "FAQ-02",
    category: "Invoices & Payments",
    question: "How do I claim my bank drawdown progress payment for Lockup stage?",
    queryCount: 289,
    aiResolutionRate: 92.8,
    escalationCount: 21,
    status: "Optimized",
    sampleAnswer: "Once the Lockup inspection certificate is uploaded by your supervisor, an invoice is automatically issued to your bank with payment instructions.",
    lastTrained: "2026-07-25"
  },
  {
    id: "FAQ-03",
    category: "Site Access & Inspections",
    question: "Can I bring an independent private building inspector before PCI?",
    queryCount: 215,
    aiResolutionRate: 88.4,
    escalationCount: 25,
    status: "Needs Review",
    sampleAnswer: "Independent inspections are welcome during designated milestone holds (Pre-Slab, Frame, Pre-Plaster, PCI). 48 hours notice is required for site safety compliance.",
    lastTrained: "2026-07-10"
  },
  {
    id: "FAQ-04",
    category: "Warranty Claims",
    question: "What is covered under my 90-day defect liability period vs 6-year structural warranty?",
    queryCount: 198,
    aiResolutionRate: 95.0,
    escalationCount: 10,
    status: "Optimized",
    sampleAnswer: "Minor paint touch-ups, door adjustments, and sealant items are covered under the 90-day period. Structural frame and foundation integrity are covered for 6 years.",
    lastTrained: "2026-08-03"
  },
  {
    id: "FAQ-05",
    category: "Variations & Specs",
    question: "Can I request changes to electrical outlets or cabinetry after Lockup stage?",
    queryCount: 164,
    aiResolutionRate: 74.1,
    escalationCount: 42,
    status: "Low Accuracy",
    sampleAnswer: "Post-lockup variations require formal written approval from your site supervisor and builder estimator due to rough-in cabling sign-offs.",
    lastTrained: "2026-06-18"
  }
];

// --- ORGANIZATION USERS MOCK DATA ---
export const MOCK_ORGANIZATION_USERS: OrganizationUser[] = [
  {
    id: "USR-101",
    name: "Marcus Vance",
    email: "marcus.vance@stagenhomes.com.au",
    role: "Company Admin",
    phone: "+61 412 345 678",
    status: "Active",
    assignedProjectsCount: 15,
    assignedProjects: ["All Company Projects"],
    lastActive: "Active Now",
    avatarBg: "bg-burning-flame"
  },
  {
    id: "USR-102",
    name: "Elena Rostova",
    email: "elena.r@stagenhomes.com.au",
    role: "Executive Management",
    phone: "+61 423 456 789",
    status: "Active",
    assignedProjectsCount: 15,
    assignedProjects: ["All Company Projects"],
    lastActive: "15 mins ago",
    avatarBg: "bg-blue-fantastic"
  },
  {
    id: "USR-103",
    name: "Dave Miller",
    email: "dave.m@stagenhomes.com.au",
    role: "Site Supervisor",
    phone: "+61 434 567 890",
    status: "Active",
    assignedProjectsCount: 5,
    assignedProjects: ["Lot 42 Greenvale", "Lot 104 Craigieburn", "Lot 12 Point Cook"],
    lastActive: "1 hour ago",
    avatarBg: "bg-truffle-trouble"
  },
  {
    id: "USR-104",
    name: "Sarah Jenkins",
    email: "sarah.j@stagenhomes.com.au",
    role: "Site Supervisor",
    phone: "+61 445 678 901",
    status: "Active",
    assignedProjectsCount: 4,
    assignedProjects: ["Lot 88 Tarneit", "Lot 31 Werribee", "Lot 19 Sunbury"],
    lastActive: "3 hours ago",
    avatarBg: "bg-burning-flame"
  },
  {
    id: "USR-105",
    name: "Apex Electrical Contractors",
    email: "jobs@apexelectrical.com.au",
    role: "Trade Contractor",
    phone: "+61 3 9876 5432",
    status: "Active",
    assignedProjectsCount: 8,
    assignedProjects: ["Lot 42 Greenvale", "Lot 88 Tarneit"],
    lastActive: "Yesterday",
    avatarBg: "bg-blue-fantastic"
  },
  {
    id: "USR-106",
    name: "Liam O'Connor",
    email: "liam.o@stagenhomes.com.au",
    role: "Site Supervisor",
    phone: "+61 456 789 012",
    status: "Pending",
    assignedProjectsCount: 2,
    assignedProjects: ["Lot 55 Clyde North"],
    lastActive: "Invite Sent (2 days ago)",
    avatarBg: "bg-truffle-trouble"
  }
];

// --- COMPANY MANAGEMENT GOVERNANCE SETTINGS MOCK DATA ---
export const MOCK_GOVERNANCE_SETTINGS = {
  organizationName: "Stagen Residential Group Pty Ltd",
  abn: "98 123 456 789",
  licenseTier: "Enterprise (Up to 50 Active Build Sites)",
  activeSitesUsed: 15,
  billingPeriod: "Annual SaaS License (Renews 15 Dec 2026)",
  alertThresholds: {
    projectDelayAlertDays: 5,
    unansweredQuestionSlaHours: 24,
    unassignedWarrantyDefectDays: 3,
    dailyDigestEmailEnabled: true,
  },
  securityPolicies: {
    enforce2FA: true,
    sessionTimeoutMinutes: 60,
    auditLogRetentionDays: 365,
    ssoProvider: "Microsoft Entra ID (Federated)",
  },
  escalationRules: {
    autoEscalateDelayToManagement: true,
    escalateHighSeverityDefect: true,
    notifySupervisorOnNewQuestion: true
  }
};
