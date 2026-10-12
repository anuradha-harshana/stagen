"use client";

import React from "react";
import { Download, BarChart3 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { ReportsHeaderData } from "@/lib/types/reports";

interface ReportsHeaderProps {
  header?: ReportsHeaderData;
  onExportCsv?: () => void;
  onDownloadPdf?: () => void;
}

export function ReportsHeader({
  header,
  onExportCsv,
  onDownloadPdf,
}: ReportsHeaderProps) {
  const title = header?.title || "Reports & Analytics";
  const subtitle = header?.subtitle || "";
  const exportCsvLabel = header?.exportCsvLabel || "Export CSV";
  const downloadPdfLabel = header?.downloadPdfLabel || "Executive PDF Report";

  return (
    <PageHeader
      icon={<BarChart3 className="h-5 w-5 text-burning-flame" />}
      title={title}
      subtitle={subtitle}
      rightContent={
        <div className="flex items-center gap-3">
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-blue-fantastic/20 hover:bg-blue-fantastic hover:text-palladian transition-all duration-200 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              {exportCsvLabel}
            </button>
          )}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-truffle-trouble text-palladian shadow-md hover:bg-truffle-trouble/90 transition-all duration-200 cursor-pointer"
            >
              <BarChart3 className="h-4 w-4 text-burning-flame" />
              {downloadPdfLabel}
            </button>
          )}
        </div>
      }
    />
  );
}
