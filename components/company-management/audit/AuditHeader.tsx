"use client";

import React from "react";
import { Download, FileText, FileSearch, Loader2 } from "lucide-react";

interface AuditHeaderProps {
  onExportCsv: () => void;
  onDownloadPdf: () => void;
  isExporting?: boolean;
}

export function AuditHeader({
  onExportCsv,
  onDownloadPdf,
  isExporting = false,
}: AuditHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-fantastic/15 font-sans w-full">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
          <FileSearch className="h-5 w-5 text-burning-flame" />
        </div>
        <div>
          <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
            Audit & Compliance Reporting
          </h1>
          <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
            Immutable audit logs, user security tracking, and automated compliance scoring.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onExportCsv}
          disabled={isExporting}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-blue-fantastic/20 hover:bg-blue-fantastic hover:text-palladian transition-all duration-200 disabled:opacity-50"
          title="Export current audit logs to CSV"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export Log CSV
        </button>

        <button
          onClick={onDownloadPdf}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-blue-fantastic text-palladian shadow-sm hover:bg-blue-fantastic/90 transition-all duration-200"
          title="Download compliance report PDF"
        >
          <FileText className="h-4 w-4 text-burning-flame" />
          Download PDF Report
        </button>
      </div>
    </div>
  );
}
