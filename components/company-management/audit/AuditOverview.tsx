"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AuditHeader } from "./AuditHeader";
import { AuditStats } from "./AuditStats";
import { ComplianceReadiness } from "./ComplianceRediness";
import { AuditLogsList, AuditLog } from "./AuditLogsList";

const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-9041",
    timestamp: "May 14, 2026 10:24 AM",
    user: "Sarah Johnson",
    role: "Company Admin",
    action: "Updated Project",
    module: "Projects",
    details: "P-1028 Stage 4 Lockup completion approved",
    ipAddress: "203.0.113.42 (Sydney, AU)",
    severity: "Info",
  },
  {
    id: "LOG-9040",
    timestamp: "May 14, 2026 09:18 AM",
    user: "John Smith",
    role: "Supervisor",
    action: "Uploaded Document",
    module: "Documents",
    details: "Invoice_1038_Signed.pdf uploaded to site B-402",
    ipAddress: "198.51.100.18 (Melbourne, AU)",
    severity: "Info",
  },
  {
    id: "LOG-9039",
    timestamp: "May 13, 2026 04:35 PM",
    user: "Michael Lee",
    role: "Company Admin",
    action: "Created Warranty",
    module: "Warranty",
    details: "Warranty claim W-2048 registered for Unit 12",
    ipAddress: "203.0.113.88 (Brisbane, AU)",
    severity: "Warning",
  },
  {
    id: "LOG-9038",
    timestamp: "May 13, 2026 02:11 PM",
    user: "System Security Bot",
    role: "System",
    action: "Failed Login Attempt",
    module: "Settings",
    details: "Multiple failed password attempts for user ID admin@stagen.com",
    ipAddress: "198.51.100.201 (Perth, AU)",
    severity: "Critical",
  },
  {
    id: "LOG-9037",
    timestamp: "May 12, 2026 11:45 AM",
    user: "Emma Davis",
    role: "Financial Officer",
    action: "Modified Invoice",
    module: "Billing",
    details: "Adjusted payment status on INV-2026-077 to Paid",
    ipAddress: "203.0.113.15 (Sydney, AU)",
    severity: "Info",
  },
  {
    id: "LOG-9036",
    timestamp: "May 12, 2026 09:05 AM",
    user: "David Miller",
    role: "Supervisor",
    action: "Deleted Document",
    module: "Documents",
    details: "Removed outdated blueprint_v1.pdf from project P-901",
    ipAddress: "198.51.100.44 (Adelaide, AU)",
    severity: "Warning",
  },
  {
    id: "LOG-9035",
    timestamp: "May 11, 2026 03:50 PM",
    user: "Sarah Johnson",
    role: "Company Admin",
    action: "Updated Permissions",
    module: "Users",
    details: "Assigned Supervisor role to new user ID sup_tom@stagen.com",
    ipAddress: "203.0.113.42 (Sydney, AU)",
    severity: "Info",
  },
];

export function AuditOverview() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      <AuditHeader
        onExportCsv={() => showToast("Exporting Audit Log (CSV file)...")}
        onDownloadPdf={() => showToast("Generating Compliance Audit PDF Report...")}
      />

      <AuditStats />

      <ComplianceReadiness
        onViewReport={() => showToast("Opening Full Regulatory Compliance Matrix...")}
      />

      <AuditLogsList logs={mockAuditLogs} />
    </div>
  );
}
