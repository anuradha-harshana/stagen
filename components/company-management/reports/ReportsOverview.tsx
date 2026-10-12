"use client";

import React, { useState, useEffect, useTransition } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsFilters } from "./ReportsFilters";
import { ReportsStats } from "./ReportsStats";
import { ReportsCharts } from "./ReportsCharts";
import { RegionalMatrixTable } from "./RegionalMatrixTable";
import { CompanyReportsData } from "@/lib/types/reports";

interface ReportsOverviewProps {
  initialData?: CompanyReportsData;
  companyId?: string;
}

export function ReportsOverview({
  initialData,
  companyId = "7ab56015-4412-494e-8aff-dbb5095e0095",
}: ReportsOverviewProps) {
  const [data, setData] = useState<CompanyReportsData | undefined>(initialData);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(
    initialData?.timeframe ?? "Q2 2026"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch updated data from API when timeframe or region changes
  useEffect(() => {
    // If we already have the matching initialData on first render, skip refetch
    if (
      initialData &&
      initialData.timeframe === selectedTimeframe &&
      selectedRegion === "All" &&
      !data
    ) {
      setData(initialData);
      return;
    }

    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams({
          companyId,
          timeframe: selectedTimeframe,
          region: selectedRegion,
        });

        const res = await fetch(`/api/company-management/reports?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch reports");
        const json = await res.json();
        if (json.reports) {
          startTransition(() => {
            setData(json.reports);
          });
        }
      } catch (err) {
        console.error("Error fetching company reports:", err);
      }
    };

    void fetchData();
  }, [selectedTimeframe, selectedRegion, companyId]);

  // CSV Export Handler
  const handleExportCsv = () => {
    if (!data?.regionalReports || data.regionalReports.length === 0) {
      showToast("No data available to export.");
      return;
    }

    const headers = [
      "Region / State",
      "Total Sites",
      "Active Sites",
      "On-Time Percentage",
      "Avg Delay (Days)",
      "Supervisors Count",
      "Efficiency Score",
    ];

    const rows = data.regionalReports.map((r) => [
      `"${r.region}"`,
      r.totalSites,
      r.activeSites,
      `${r.onTimePct}%`,
      r.avgDelayDays,
      r.supervisors,
      r.efficiencyScore,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = `company-reports-${selectedTimeframe.toLowerCase().replace(/[\s/]+/g, "-")}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filename} successfully!`);
  };

  // Executive PDF Report Handler
  const handleDownloadPdf = () => {
    showToast(
      `Generated Executive Operational PDF Report for ${selectedTimeframe}. Opening print preview...`
    );
    setTimeout(() => {
      window.print();
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-lg shadow-xl border border-burning-flame flex items-center gap-3 animate-bounce">
          <ShieldCheck className="h-5 w-5 text-burning-flame shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Reports Header with actions */}
      <ReportsHeader
        header={data?.header}
        onExportCsv={handleExportCsv}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Filter Bar */}
      <ReportsFilters
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
        lastSynchronized={data?.lastSynchronized}
        availableTimeframes={data?.availableTimeframes}
        availableRegions={data?.availableRegions}
      />

      {/* Loading indicator bar if transition is in progress */}
      {isPending && (
        <div className="flex items-center gap-2 text-xs font-medium text-blue-fantastic/60 bg-blue-fantastic/5 px-4 py-2 rounded-lg">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-burning-flame" />
          <span>Synchronizing analytics data...</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <ReportsStats stats={data?.stats} isLoading={!data} />

      {/* Velocity Charts & Stage Durations */}
      <ReportsCharts
        monthlyTrends={data?.monthlyTrends}
        stageDurations={data?.stageDurations}
        bottleneck={data?.bottleneck}
        isLoading={!data}
      />

      {/* Regional Operational Matrix Table */}
      <RegionalMatrixTable
        reports={data?.regionalReports ?? []}
        isLoading={!data}
      />
    </div>
  );
}
