"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsFilters } from "./ReportsFilters";
import { ReportsStats } from "./ReportsStats";
import { ReportsCharts } from "./ReportsCharts";
import { RegionalMatrixTable, RegionalReport } from "./RegionalMatrixTable";

const mockRegionalReports: RegionalReport[] = [
  { region: "NSW (New South Wales)", totalSites: 48, activeSites: 38, onTimePct: 92.4, avgDelayDays: 1.8, supervisors: 12, efficiencyScore: 95 },
  { region: "VIC (Victoria)", totalSites: 36, activeSites: 28, onTimePct: 81.5, avgDelayDays: 4.2, supervisors: 9, efficiencyScore: 84 },
  { region: "QLD (Queensland)", totalSites: 24, activeSites: 18, onTimePct: 88.0, avgDelayDays: 2.5, supervisors: 6, efficiencyScore: 90 },
  { region: "WA (Western Australia)", totalSites: 12, activeSites: 8, onTimePct: 94.2, avgDelayDays: 1.1, supervisors: 3, efficiencyScore: 97 },
];

export function ReportsOverview() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Q2 2026");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredReports = mockRegionalReports.filter(
    (rep) => selectedRegion === "All" || rep.region.startsWith(selectedRegion)
  );

  return (
    <div className="p-6 md:p-8 space-y-8 text-blue-fantastic font-cream">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-lg shadow-xl border border-burning-flame flex items-center gap-3 animate-bounce">
          <ShieldCheck className="h-5 w-5 text-burning-flame" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Divided Subcomponents */}
      <ReportsHeader
        onExportCsv={() => showToast("Exporting Analytics Data (CSV)...")}
        onDownloadPdf={() => showToast("Generating Executive Operational PDF Report...")}
      />

      <ReportsFilters
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
      />

      <ReportsStats />

      <ReportsCharts />

      <RegionalMatrixTable reports={filteredReports} />
    </div>
  );
}
