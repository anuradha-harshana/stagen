import fs from "fs/promises";
import path from "path";
import {
  CompanyReportsData,
  CompanyReportsRecord,
  ReportsHeaderData,
  TimeframeReportData,
} from "../types/reports";

const reportsFilePath = path.join(
  process.cwd(),
  "data",
  "company-management",
  "reports.json"
);

// Fallback data if JSON file is missing or empty
const defaultFallbackTimeframe: TimeframeReportData = {
  lastSynchronized: "Today at 09:30 AM",
  header: {
    title: "Reports & Analytics",
    subtitle:
      "Track site velocity, stage durations, regional performance matrix, and operational efficiency metrics.",
    exportCsvLabel: "Export CSV",
    downloadPdfLabel: "Executive PDF Report",
  },
  stats: {
    totalActiveSites: {
      value: 120,
      change: "+9% vs previous quarter",
      trend: "up",
    },
    avgStageDuration: {
      value: "14.2 Days",
      change: "-8% faster stage completion",
      trend: "down",
    },
    siteCompletionRate: {
      value: "84.5%",
      change: "+3.2% on-time milestone delivery",
      trend: "up",
    },
    operationalScore: {
      value: 94,
      max: 100,
      label: "High Efficiency Rating",
    },
  },
  monthlyTrends: [
    { month: "Jan", scheduled: 28, completed: 24 },
    { month: "Feb", scheduled: 34, completed: 31 },
    { month: "Mar", scheduled: 38, completed: 36 },
    { month: "Apr", scheduled: 32, completed: 29 },
    { month: "May", scheduled: 42, completed: 40 },
    { month: "Jun", scheduled: 45, completed: 43 },
  ],
  stageDurations: [
    {
      stage: "Base Slab & Foundation",
      days: "12 Days",
      target: "14 Days",
      status: "Ahead",
      pct: 85,
      color: "bg-emerald-500",
    },
    {
      stage: "Frame & Lockup",
      days: "18 Days",
      target: "15 Days",
      status: "Delayed",
      pct: 110,
      color: "bg-rose-500",
    },
    {
      stage: "Services & Fitout",
      days: "14 Days",
      target: "14 Days",
      status: "On Track",
      pct: 100,
      color: "bg-blue-fantastic",
    },
    {
      stage: "Linings & Carpentry",
      days: "10 Days",
      target: "12 Days",
      status: "Ahead",
      pct: 83,
      color: "bg-emerald-500",
    },
    {
      stage: "Practical Completion",
      days: "7 Days",
      target: "8 Days",
      status: "Ahead",
      pct: 88,
      color: "bg-emerald-500",
    },
  ],
  bottleneck: {
    stage: "Frame & Lockup",
    region: "VIC",
    delayDays: 3,
    summary:
      "Frame & Lockup stage in VIC region averaging +3 days delay due to timber supply chain schedules.",
  },
  regionalReports: [
    {
      region: "NSW (New South Wales)",
      code: "NSW",
      totalSites: 48,
      activeSites: 38,
      onTimePct: 92.4,
      avgDelayDays: 1.8,
      supervisors: 12,
      efficiencyScore: 95,
    },
    {
      region: "VIC (Victoria)",
      code: "VIC",
      totalSites: 36,
      activeSites: 28,
      onTimePct: 81.5,
      avgDelayDays: 4.2,
      supervisors: 9,
      efficiencyScore: 84,
    },
    {
      region: "QLD (Queensland)",
      code: "QLD",
      totalSites: 24,
      activeSites: 18,
      onTimePct: 88.0,
      avgDelayDays: 2.5,
      supervisors: 6,
      efficiencyScore: 90,
    },
    {
      region: "WA (Western Australia)",
      code: "WA",
      totalSites: 12,
      activeSites: 8,
      onTimePct: 94.2,
      avgDelayDays: 1.1,
      supervisors: 3,
      efficiencyScore: 97,
    },
  ],
};

/**
 * Reads all company report records from JSON file.
 */
export async function readReportsRecords(): Promise<CompanyReportsRecord[]> {
  try {
    const fileContents = await fs.readFile(reportsFilePath, "utf8");
    const data = JSON.parse(fileContents);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.warn("Could not read reports file, using fallback:", error);
    return [];
  }
}

/**
 * Writes company report records to JSON file.
 */
export async function writeReportsRecords(
  records: CompanyReportsRecord[]
): Promise<void> {
  const dir = path.dirname(reportsFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(reportsFilePath, JSON.stringify(records, null, 2), "utf8");
}

/**
 * Retrieves Reports and Analytics data for a given company, timeframe, and region.
 * Follows the project's data retrieval pattern.
 */
export async function getCompanyReports(
  companyId?: string,
  timeframe: string = "Q2 2026",
  region: string = "All"
): Promise<CompanyReportsData> {
  const records = await readReportsRecords();

  // Find record matching companyId, or fallback to first available record
  const companyRecord =
    (companyId
      ? records.find((rec) => rec.companyId === companyId)
      : null) ?? records[0];

  const availableTimeframes = companyRecord
    ? Object.keys(companyRecord.timeframes)
    : ["Q2 2026", "Last 30 Days", "YTD 2026"];

  const resolvedTimeframe =
    companyRecord?.timeframes[timeframe]
      ? timeframe
      : availableTimeframes[0] ?? "Q2 2026";

  const timeframeData: TimeframeReportData =
    companyRecord?.timeframes[resolvedTimeframe] ?? defaultFallbackTimeframe;

  const resolvedHeader: ReportsHeaderData =
    timeframeData.header ??
    companyRecord?.header ?? {
      title: "Reports & Analytics",
      subtitle:
        "Track site velocity, stage durations, regional performance matrix, and operational efficiency metrics.",
      exportCsvLabel: "Export CSV",
      downloadPdfLabel: "Executive PDF Report",
    };

  // Filter regional reports if region specified
  const filteredRegionalReports =
    region === "All"
      ? timeframeData.regionalReports
      : timeframeData.regionalReports.filter(
          (rep) =>
            rep.code === region ||
            rep.region.toUpperCase().startsWith(region.toUpperCase())
        );

  const availableRegions = [
    "All",
    ...Array.from(
      new Set(
        timeframeData.regionalReports.map(
          (r) => r.code || r.region.split(" ")[0]
        )
      )
    ),
  ];

  return {
    companyId: companyId ?? companyRecord?.companyId ?? "default-company",
    timeframe: resolvedTimeframe,
    lastSynchronized: timeframeData.lastSynchronized,
    header: resolvedHeader,
    stats: timeframeData.stats,
    monthlyTrends: timeframeData.monthlyTrends,
    stageDurations: timeframeData.stageDurations,
    bottleneck: timeframeData.bottleneck,
    regionalReports: filteredRegionalReports,
    availableTimeframes,
    availableRegions,
  };
}

/**
 * Saves or updates reports data for a company.
 */
export async function saveCompanyReports(
  companyId: string,
  updatedData: Partial<TimeframeReportData>,
  timeframe: string = "Q2 2026"
): Promise<CompanyReportsRecord> {
  const records = await readReportsRecords();
  let companyRecord = records.find((rec) => rec.companyId === companyId);
  const now = new Date().toISOString();

  if (!companyRecord) {
    companyRecord = {
      companyId,
      timeframes: {
        [timeframe]: {
          ...defaultFallbackTimeframe,
          ...updatedData,
        },
      },
      updatedAt: now,
    };
    records.push(companyRecord);
  } else {
    companyRecord.timeframes[timeframe] = {
      ...(companyRecord.timeframes[timeframe] ?? defaultFallbackTimeframe),
      ...updatedData,
    };
    companyRecord.updatedAt = now;
  }

  await writeReportsRecords(records);
  return companyRecord;
}
