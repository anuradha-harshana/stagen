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
  lastSynchronized: "Not available", stats: { totalActiveSites: { value: 0 }, avgStageDuration: { value: "Not available" }, siteCompletionRate: { value: "Not available" }, operationalScore: { value: 0, max: 100, label: "Not assessed" } }, monthlyTrends: [], stageDurations: [], bottleneck: { stage: "", region: "", delayDays: 0, summary: "No report data" }, regionalReports: []
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
      : null);

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
