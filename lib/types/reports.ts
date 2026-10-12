export interface ReportsHeaderData {
  title: string;
  subtitle: string;
  exportCsvLabel?: string;
  downloadPdfLabel?: string;
}

export interface ReportKpiItem {
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
}

export interface ReportKpiStats {
  totalActiveSites: ReportKpiItem;
  avgStageDuration: ReportKpiItem;
  siteCompletionRate: ReportKpiItem;
  operationalScore: {
    value: number;
    max: number;
    label: string;
  };
}

export interface MonthlyTrend {
  month: string;
  scheduled: number;
  completed: number;
}

export interface StageDuration {
  stage: string;
  days: string;
  target: string;
  status: "Ahead" | "Delayed" | "On Track";
  pct: number;
  color: string;
}

export interface OperationalBottleneck {
  stage: string;
  region: string;
  delayDays: number;
  summary: string;
}

export interface RegionalReport {
  region: string;
  code?: string;
  totalSites: number;
  activeSites: number;
  onTimePct: number;
  avgDelayDays: number;
  supervisors: number;
  efficiencyScore: number;
}

export interface TimeframeReportData {
  lastSynchronized: string;
  header?: ReportsHeaderData;
  stats: ReportKpiStats;
  monthlyTrends: MonthlyTrend[];
  stageDurations: StageDuration[];
  bottleneck: OperationalBottleneck;
  regionalReports: RegionalReport[];
}

export interface CompanyReportsRecord {
  companyId: string;
  companyName?: string;
  header?: ReportsHeaderData;
  timeframes: Record<string, TimeframeReportData>;
  updatedAt?: string;
}

export interface CompanyReportsData {
  companyId: string;
  timeframe: string;
  lastSynchronized: string;
  header: ReportsHeaderData;
  stats: ReportKpiStats;
  monthlyTrends: MonthlyTrend[];
  stageDurations: StageDuration[];
  bottleneck: OperationalBottleneck;
  regionalReports: RegionalReport[];
  availableTimeframes: string[];
  availableRegions: string[];
}
