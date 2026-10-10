"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { BillingHeader } from "./BillingHeader";
import { BillingStats } from "./BillingStats";
import { BillingCharts } from "./BillingCharts";
import { BillingUsageBreakdown } from "./BillingUsageBreakdown";
import { InvoicesList, Invoice } from "./InvoicesList";

const mockInvoices: Invoice[] = [
  { id: "INV-2026-081", siteName: "Grandview Heights - Phase 2", region: "NSW", plan: "Enterprise", issueDate: "2026-08-01", dueDate: "2026-08-15", amount: 4999, status: "Paid" },
  { id: "INV-2026-080", siteName: "Harbor Light Apartments", region: "VIC", plan: "Premium", issueDate: "2026-08-01", dueDate: "2026-08-15", amount: 2499, status: "Paid" },
  { id: "INV-2026-079", siteName: "Riverfront Estate Site A", region: "QLD", plan: "Premium", issueDate: "2026-07-28", dueDate: "2026-08-11", amount: 2499, status: "Pending" },
  { id: "INV-2026-078", siteName: "Western Edge Commercial", region: "WA", plan: "Standard", issueDate: "2026-07-25", dueDate: "2026-08-08", amount: 1499, status: "Overdue" },
  { id: "INV-2026-077", siteName: "Skyline Towers Deck B", region: "NSW", plan: "Enterprise", issueDate: "2026-07-20", dueDate: "2026-08-03", amount: 4999, status: "Paid" },
  { id: "INV-2026-076", siteName: "Bayside Residences", region: "VIC", plan: "Standard", issueDate: "2026-07-15", dueDate: "2026-07-29", amount: 1499, status: "Overdue" },
  { id: "INV-2026-075", siteName: "Highland Valley Estate", region: "QLD", plan: "Premium", issueDate: "2026-07-10", dueDate: "2026-07-24", amount: 2499, status: "Paid" },
  { id: "INV-2026-074", siteName: "Perth Central Office Park", region: "WA", plan: "Enterprise", issueDate: "2026-07-05", dueDate: "2026-07-19", amount: 4999, status: "Pending" },
];

export function BillingOverview() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-lg shadow-xl border border-burning-flame flex items-center gap-3 animate-bounce">
          <ShieldCheck className="h-5 w-5 text-burning-flame" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Divided Subcomponents */}
      <BillingHeader
        onExport={() => showToast("Exporting financial billing statement (CSV)...")}
        onManageSubscriptions={() => showToast("Opening Subscription Management...")}
      />

      <BillingStats />

      <BillingCharts />

      <BillingUsageBreakdown />

      <InvoicesList
        invoices={mockInvoices}
        onDownload={(id) => showToast(`Downloading ${id} invoice PDF...`)}
      />
    </div>
  );
}
