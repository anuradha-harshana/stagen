import fs from "fs/promises";
import path from "path";
import { getCompanyProjects } from "@/lib/tenant/projects";
import { getCompanyUsers } from "@/lib/users/users";
import { Project } from "@/lib/types/project";

const dataRoot = path.join(process.cwd(), "data", "tenants");

export interface CompanyManagementKpis {
  totalProjects: number;
  activeProjects: number;
  onTrackProjects: number;
  delayedProjects: number;
  completedProjects: number;
  avgProgress: number;
  totalContractValue: number;
  totalCollected: number;
  totalOutstanding: number;
}

export interface StageBreakdownItem {
  stage: string;
  count: number;
  percentage: number;
}

export interface StatusBreakdownItem {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SupervisorWorkloadItem {
  id: string;
  name: string;
  initials: string;
  email: string;
  projectsCount: number;
  progressPercent: number;
  activeCount: number;
  delayedCount: number;
}

export interface AtRiskProjectItem {
  id: string;
  projectName: string;
  customer: string;
  stage: string;
  delayDays: number;
  progressPercent: number;
  lastUpdate: string;
  supervisor: string;
  region: string;
  status: "Delayed" | "Action Required" | "At Risk";
  delayReason?: string;
  rawProject: Project;
}

export interface RecentActivityItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  date: string;
  stageName: string;
  type: "success" | "warning" | "info";
  clientName?: string;
}

export interface CompanyManagementDashboardData {
  companyId: string;
  kpis: CompanyManagementKpis;
  stageBreakdown: StageBreakdownItem[];
  statusBreakdown: StatusBreakdownItem[];
  supervisorsWorkload: SupervisorWorkloadItem[];
  atRiskProjects: AtRiskProjectItem[];
  recentActivities: RecentActivityItem[];
  projects: Project[];
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function extractRegion(address: string): string {
  const upper = address.toUpperCase();
  if (upper.includes("VIC")) return "VIC";
  if (upper.includes("NSW")) return "NSW";
  if (upper.includes("QLD")) return "QLD";
  if (upper.includes("WA")) return "WA";
  if (upper.includes("SA")) return "SA";
  return "VIC";
}

export async function getCompanyManagementDashboardData(
  companyId: string
): Promise<CompanyManagementDashboardData> {
  // 1. Fetch projects and supervisor users from existing data sources
  const [projects, companyUsers] = await Promise.all([
    getCompanyProjects(companyId),
    getCompanyUsers(companyId),
  ]);

  // 2. Read raw tenants file for financial metrics
  let rawTenants: any[] = [];
  try {
    const tenantsContent = await fs.readFile(
      path.join(dataRoot, "tenants.json"),
      "utf8"
    );
    const parsed = JSON.parse(tenantsContent);
    rawTenants = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("Failed to read tenants.json for financials", error);
  }

  const companyTenants = rawTenants.filter(
    (t) => t.company_id === companyId
  );

  let totalContractValue = 0;
  let totalCollected = 0;
  let totalOutstanding = 0;
  for (const t of companyTenants) {
    totalContractValue += Number(t.contract_value ?? 0);
    totalCollected += Number(t.amount_paid ?? 0);
    totalOutstanding += Number(t.outstanding ?? 0);
  }

  // 3. Compute KPI metrics
  const totalProjects = projects.length;
  const onTrackProjects = projects.filter((p) => p.status === "On Track").length;
  const delayedProjects = projects.filter(
    (p) => p.status === "Delayed" || p.status === "Action Required"
  ).length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const activeProjects = totalProjects - completedProjects;

  const totalProgress = projects.reduce((acc, p) => acc + (p.progress || 0), 0);
  const avgProgress = totalProjects > 0 ? Math.round(totalProgress / totalProjects) : 0;

  const kpis: CompanyManagementKpis = {
    totalProjects,
    activeProjects,
    onTrackProjects,
    delayedProjects,
    completedProjects,
    avgProgress,
    totalContractValue,
    totalCollected,
    totalOutstanding,
  };

  // 4. Compute Stage Breakdown
  const standardStages = [
    "Site Cut",
    "Slab",
    "Frame",
    "Lockup",
    "Fixing",
    "Completion",
    "Handover",
  ];

  const stageBreakdown: StageBreakdownItem[] = standardStages.map((stageName) => {
    const count = projects.filter(
      (p) =>
        p.currentStage?.toLowerCase() === stageName.toLowerCase() ||
        (stageName === "Completion" && p.currentStage?.toLowerCase() === "comp.")
    ).length;
    return {
      stage: stageName,
      count,
      percentage: totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0,
    };
  });

  // 5. Compute Status Breakdown
  const statusColors: Record<string, string> = {
    "On Track": "#2c3b4d", // blue-fantastic
    "Delayed": "#a35139", // truffle-trouble / red
    "Action Required": "#ffb162", // burning-flame
    "Completed": "#10b981", // emerald
  };

  const statusMap = new Map<string, number>();
  for (const p of projects) {
    statusMap.set(p.status, (statusMap.get(p.status) ?? 0) + 1);
  }

  const statusBreakdown: StatusBreakdownItem[] = Array.from(statusMap.entries()).map(
    ([status, count]) => ({
      status,
      count,
      percentage: totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0,
      color: statusColors[status] || "#2c3b4d",
    })
  );

  // 6. Compute Supervisors Workload
  const supervisors = companyUsers.filter((u) => u.user.role === "supervisor");
  const supervisorsWorkload: SupervisorWorkloadItem[] = supervisors.map((s) => {
    const assignedProjects = projects.filter(
      (p) =>
        p.supervisorName?.toLowerCase() === s.user.username.toLowerCase() ||
        p.supervisorName?.toLowerCase().includes(s.user.username.toLowerCase())
    );
    const count = assignedProjects.length;
    const progressSum = assignedProjects.reduce((sum, p) => sum + (p.progress || 0), 0);
    const progressPercent = count > 0 ? Math.round(progressSum / count) : 0;
    const activeCount = assignedProjects.filter((p) => p.status !== "Completed").length;
    const delayedCount = assignedProjects.filter(
      (p) => p.status === "Delayed" || p.status === "Action Required"
    ).length;

    return {
      id: s.user.id,
      name: s.user.username,
      initials: getInitials(s.user.username),
      email: s.user.email,
      projectsCount: count,
      progressPercent,
      activeCount,
      delayedCount,
    };
  });

  // 7. Compute At-Risk Projects
  const atRiskProjects: AtRiskProjectItem[] = projects
    .filter(
      (p) =>
        p.status === "Delayed" ||
        p.status === "Action Required" ||
        (p.delayDays !== undefined && p.delayDays > 0)
    )
    .map((p) => {
      const topDelay = p.delays?.[0];
      return {
        id: `PRO-${p.id.replace(/^lot-/, "")}`,
        projectName: `Lot ${p.id.replace(/^lot-/, "")} Residence`,
        customer: p.clientName || "Client",
        stage: p.currentStage || "In Progress",
        delayDays: p.delayDays || topDelay?.durationDays || 5,
        progressPercent: p.progress || 0,
        lastUpdate: p.lastUpdate || topDelay?.date || p.startDate || "Recent",
        supervisor: p.supervisorName || "Assigned Supervisor",
        region: extractRegion(p.address),
        status: (p.status === "Delayed" ? "Delayed" : "Action Required") as AtRiskProjectItem["status"],
        delayReason: topDelay?.description || "Schedule review pending",
        rawProject: p,
      };
    });

  // 8. Fetch Activities
  let rawActivities: any[] = [];
  try {
    const actContent = await fs.readFile(
      path.join(dataRoot, "tenant_activities.json"),
      "utf8"
    );
    const parsed = JSON.parse(actContent);
    rawActivities = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error("Failed to read tenant_activities.json", error);
  }

  const projectMap = new Map(projects.map((p) => [`tenant-${p.id}`, p]));
  const recentActivities: RecentActivityItem[] = rawActivities
    .map((act) => {
      const matched = projectMap.get(act.tenant_id) || projects.find((p) => p.id === act.tenant_id?.replace(/^tenant-/, ""));
      return {
        id: act.id,
        projectId: act.tenant_id?.replace(/^tenant-/, "Lot ") || "Lot",
        title: act.title,
        description: act.description,
        date: act.date,
        stageName: act.stage_name || "General",
        type: act.type === "warning" ? "warning" : act.type === "info" ? "info" : "success",
        clientName: matched?.clientName,
      };
    })
    .slice(0, 10);

  return {
    companyId,
    kpis,
    stageBreakdown,
    statusBreakdown,
    supervisorsWorkload,
    atRiskProjects,
    recentActivities,
    projects,
  };
}
