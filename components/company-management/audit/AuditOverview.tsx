"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  FileText,
  Download,
  Building2,
  Loader2,
} from "lucide-react";
import { AuditHeader } from "./AuditHeader";
import { AuditStats } from "./AuditStats";
import { ComplianceReadiness } from "./ComplianceRediness";
import { AuditLogsList } from "./AuditLogsList";
import { AuditLog, CompanyAuditRecord } from "@/lib/types/audit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const CLIENT_FALLBACK_AUDIT: CompanyAuditRecord = {
  companyId: "7ab56015-4412-494e-8aff-dbb5095e0095",
  companyName: "Build & Co",
  updatedAt: new Date().toISOString(),
  stats: {
    complianceScore: {
      value: "92%",
      rating: "Good Standing",
      description: "ISO 27001 & Safety Verified",
    },
    openFlags: {
      value: 3,
      rating: "Needs Review",
      description: "2 Safety, 1 Document Gap",
    },
    auditsCompleted: {
      value: 142,
      description: "YTD Site & Financial Audits",
    },
    dataIntegrityScore: {
      value: "98.4%",
      description: "✓ Encrypted & Verified",
    },
  },
  complianceReadiness: {
    score: 92,
    rating: "Good Standing",
    description: "Automated audit rating based on active site compliance policies",
    categories: [
      {
        id: "cat-safety",
        name: "Site Safety & Hazard Audits",
        score: 96,
        color: "emerald",
      },
      {
        id: "cat-docs",
        name: "Document Verification & Blueprint Sign-offs",
        score: 94,
        color: "emerald",
      },
      {
        id: "cat-fin",
        name: "Financial & Invoice Audit Trail",
        score: 98,
        color: "blue",
      },
      {
        id: "cat-workload",
        name: "Supervisor Workload & Checklists",
        score: 88,
        color: "amber",
      },
    ],
    regulatoryFrameworks: [
      {
        id: "fw-iso27001",
        name: "ISO/IEC 27001:2022",
        standard: "Information Security & Data Integrity",
        status: "Certified",
        score: 96,
        lastAudit: "2026-04-12",
      },
      {
        id: "fw-ncc2026",
        name: "NCC 2026 / Building Code of Australia",
        standard: "Structural & Energy Efficiency Compliance",
        status: "Compliant",
        score: 94,
        lastAudit: "2026-05-01",
      },
      {
        id: "fw-whs",
        name: "Work Health and Safety (WHS) Act 2011",
        standard: "Site Safety & Subcontractor Induction",
        status: "Verified",
        score: 96,
        lastAudit: "2026-05-10",
      },
      {
        id: "fw-sopa",
        name: "Security of Payment Act (SOPA)",
        standard: "Progress Claim & Milestone Integrity",
        status: "Compliant",
        score: 98,
        lastAudit: "2026-05-11",
      },
    ],
  },
  logs: [],
};

interface AuditOverviewProps {
  initialData?: CompanyAuditRecord;
  companyId?: string;
}

export function AuditOverview({
  initialData,
  companyId = "7ab56015-4412-494e-8aff-dbb5095e0095",
}: AuditOverviewProps) {
  const [data, setData] = useState<CompanyAuditRecord>(
    initialData || CLIENT_FALLBACK_AUDIT
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Fetch Audit Data from API ──
  const fetchAuditData = async () => {
    try {
      const res = await fetch(
        `/api/company-management/audit?companyId=${encodeURIComponent(companyId)}`
      );
      if (!res.ok) throw new Error("Failed to load audit data");
      const json = await res.json();
      if (json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Error loading audit data:", err);
      showToast("Unable to load latest audit logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      void fetchAuditData();
    }
  }, [companyId, initialData]);

  // ── CSV Export ──
  const handleExportCsv = () => {
    setIsExporting(true);
    try {
      const logs = data.logs ?? [];
      if (logs.length === 0) {
        showToast("No audit logs available to export.");
        return;
      }

      const headers = [
        "Log ID",
        "Timestamp",
        "User",
        "Role",
        "Action",
        "Module",
        "Details",
        "IP Address",
        "Severity",
      ];

      const rows = logs.map((log) => [
        `"${log.id}"`,
        `"${log.timestamp}"`,
        `"${log.user.replace(/"/g, '""')}"`,
        `"${log.role.replace(/"/g, '""')}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.module}"`,
        `"${log.details.replace(/"/g, '""')}"`,
        `"${log.ipAddress.replace(/"/g, '""')}"`,
        `"${log.severity}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `audit_compliance_report_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Exported ${logs.length} audit logs to CSV.`);
    } catch (err) {
      console.error(err);
      showToast("Failed to generate CSV export.");
    } finally {
      setIsExporting(false);
    }
  };

  // ── PDF Report ──
  const handleDownloadPdf = () => {
    setIsReportOpen(true);
    showToast("Opening Regulatory Compliance & Audit Report view.");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-lg shadow-xl border border-burning-flame flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <ShieldCheck className="h-5 w-5 text-burning-flame shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-blue-fantastic/60 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-truffle-trouble" />
          <p className="text-sm font-medium">Loading Audit & Compliance Data...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <AuditHeader
            onExportCsv={handleExportCsv}
            onDownloadPdf={handleDownloadPdf}
            isExporting={isExporting}
          />

          {/* Stats Bar */}
          <AuditStats stats={data.stats} />

          {/* Compliance Readiness Overview */}
          <ComplianceReadiness
            readiness={data.complianceReadiness}
            onViewReport={() => setIsReportOpen(true)}
          />

          {/* Filterable Immutable Audit Logs Table */}
          <AuditLogsList
            logs={data.logs}
            onViewDetails={(log) => setSelectedLog(log)}
          />
        </>
      )}

      {/* ── Dialog 1: Inspect Single Log Details ── */}
      <Dialog
        open={selectedLog !== null}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        {selectedLog && (
          <DialogContent className="max-w-lg bg-white text-blue-fantastic font-sans border border-blue-fantastic/20">
            <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-bold text-blue-fantastic flex items-center gap-2">
                    <span className="font-mono text-base bg-blue-fantastic/10 px-2 py-0.5 rounded text-blue-fantastic">
                      {selectedLog.id}
                    </span>
                    <span>Audit Log Inspection</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-blue-fantastic/60 mt-1">
                    Recorded {selectedLog.timestamp} from {selectedLog.ipAddress}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-blue-fantastic/10">
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">
                    User / Actor
                  </span>
                  <span className="font-bold text-blue-fantastic text-sm">
                    {selectedLog.user}
                  </span>
                  <span className="text-[11px] text-blue-fantastic/60 block">
                    {selectedLog.role}
                  </span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">
                    Module & Severity
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-800">
                      {selectedLog.module}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        selectedLog.severity === "Critical"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : selectedLog.severity === "Warning"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {selectedLog.severity}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase mb-1">
                  Action Executed
                </span>
                <p className="font-semibold text-blue-fantastic text-sm bg-blue-fantastic/5 p-2.5 rounded-lg border border-blue-fantastic/10">
                  {selectedLog.action}
                </p>
              </div>

              <div>
                <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase mb-1">
                  Full Details & Context
                </span>
                <p className="text-blue-fantastic/90 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedLog.details}
                </p>
              </div>

              <div>
                <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase mb-1">
                  Client IP & Regional Verification
                </span>
                <div className="font-mono text-xs text-blue-fantastic/70 bg-slate-50 p-2 rounded border border-slate-200">
                  {selectedLog.ipAddress}
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center border-t border-blue-fantastic/10 pt-3">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-fantastic text-palladian hover:bg-blue-fantastic/90 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ── Dialog 2: Regulatory Compliance Matrix & Frameworks Report ── */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-2xl bg-white text-blue-fantastic font-sans border border-blue-fantastic/20">
          <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-fantastic flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-burning-flame" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-blue-fantastic">
                  Regulatory Compliance & Audit Matrix
                </DialogTitle>
                <DialogDescription className="text-xs text-blue-fantastic/60">
                  Comprehensive audit scorecards, statutory certifications, and Australian standards
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            {/* Top Score Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Overall Compliance Standing
                </span>
                <h4 className="text-2xl font-bold text-emerald-700 mt-0.5">
                  {data.complianceReadiness?.score ?? 92}% Score •{" "}
                  {data.complianceReadiness?.rating ?? "Good Standing"}
                </h4>
                <p className="text-emerald-700/80 text-[11px] mt-0.5">
                  Verified across{" "}
                  {data.complianceReadiness?.categories?.length ?? 4} operational
                  modules and {data.logs.length} logged audit events.
                </p>
              </div>

              <div className="h-12 w-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center bg-white shadow-sm shrink-0">
                <span className="font-bold text-emerald-700 text-sm">
                  {data.complianceReadiness?.score ?? 92}%
                </span>
              </div>
            </div>

            {/* Frameworks List */}
            <div>
              <h4 className="font-bold text-blue-fantastic text-xs uppercase tracking-wider mb-2">
                Certified Regulatory Frameworks
              </h4>
              <div className="space-y-2">
                {(data.complianceReadiness?.regulatoryFrameworks ?? []).map((fw) => (
                  <div
                    key={fw.id}
                    className="p-3 bg-slate-50 border border-blue-fantastic/15 rounded-xl flex items-center justify-between hover:bg-slate-100/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-fantastic text-xs">
                          {fw.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {fw.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-fantastic/70 mt-0.5">
                        {fw.standard}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-emerald-600 text-sm block">
                        {fw.score}%
                      </span>
                      <span className="text-[10px] text-blue-fantastic/50 block">
                        Last Audit: {fw.lastAudit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Trail Guarantee */}
            <div className="bg-blue-fantastic/5 border border-blue-fantastic/15 rounded-xl p-3 flex items-start gap-2.5">
              <Building2 className="h-4 w-4 text-truffle-trouble shrink-0 mt-0.5" />
              <div className="text-[11px] text-blue-fantastic/80 leading-relaxed">
                <span className="font-bold text-blue-fantastic block mb-0.5">
                  Immutable Cryptographic Audit Trail
                </span>
                All system log entries are retained with SHA-256 integrity hashing
                according to your company governance policy (
                {data.stats.dataIntegrityScore?.value ?? "98.4%"} integrity verified).
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-blue-fantastic/10 pt-3">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 rounded-lg transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download Audit CSV
            </button>

            <button
              onClick={() => {
                setIsReportOpen(false);
                window.print();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 rounded-lg shadow-sm transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
