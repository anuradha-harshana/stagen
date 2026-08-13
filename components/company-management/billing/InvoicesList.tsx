"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, Clock, AlertTriangle, Download } from "lucide-react";

export interface Invoice {
  id: string;
  siteName: string;
  region: string;
  plan: "Standard" | "Premium" | "Enterprise";
  issueDate: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

interface InvoicesListProps {
  invoices: Invoice[];
  onDownload: (invoiceId: string) => void;
}

export function InvoicesList({ invoices, onDownload }: InvoicesListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = selectedStatus === "All" || inv.status === selectedStatus;
    const matchesSearch =
      inv.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-palladian rounded-xl shadow-sm border border-blue-fantastic/15 overflow-hidden">
      <div className="p-6 border-b border-blue-fantastic/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base text-blue-fantastic">
            Recent Billing Invoices
          </h3>
          <p className="text-xs text-blue-fantastic/60">
            View, search, and manage site billing invoices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <label htmlFor="search-invoices" className="sr-only">
              Search site or invoice number
            </label>
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-fantastic/40" />
            <input
              id="search-invoices"
              type="text"
              placeholder="Search site or invoice #..."
              aria-label="Search site or invoice number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-blue-fantastic/15 rounded-lg text-blue-fantastic focus:outline-none focus:border-truffle-trouble w-60"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            {["All", "Paid", "Pending", "Overdue"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  selectedStatus === status
                    ? "bg-blue-fantastic text-palladian shadow-xs"
                    : "text-blue-fantastic/70 hover:text-blue-fantastic"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-blue-fantastic/60 border-b border-blue-fantastic/15">
              <th className="py-3 px-6 font-semibold">Invoice ID</th>
              <th className="py-3 px-6 font-semibold">Site Name</th>
              <th className="py-3 px-6 font-semibold">Region</th>
              <th className="py-3 px-6 font-semibold">Tier Plan</th>
              <th className="py-3 px-6 font-semibold">Issue / Due Date</th>
              <th className="py-3 px-6 font-semibold">Amount</th>
              <th className="py-3 px-6 font-semibold">Status</th>
              <th className="py-3 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-6 font-mono font-medium text-blue-fantastic">
                  {inv.id}
                </td>
                <td className="py-3.5 px-6 font-semibold text-blue-fantastic">
                  {inv.siteName}
                </td>
                <td className="py-3.5 px-6 font-medium text-blue-fantastic/70">
                  {inv.region}
                </td>
                <td className="py-3.5 px-6">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-blue-fantastic/15">
                    {inv.plan}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-blue-fantastic/70">
                  <div>{inv.issueDate}</div>
                  <div className="text-[11px] text-blue-fantastic/50">Due: {inv.dueDate}</div>
                </td>
                <td className="py-3.5 px-6 font-bold font-sans text-blue-fantastic">
                  ${inv.amount.toLocaleString()}
                </td>
                <td className="py-3.5 px-6">
                  {inv.status === "Paid" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Paid
                    </span>
                  )}
                  {inv.status === "Pending" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                  {inv.status === "Overdue" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <AlertTriangle className="h-3 w-3" /> Overdue
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <button
                    onClick={() => onDownload(inv.id)}
                    className="text-xs font-medium text-truffle-trouble hover:underline inline-flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                </td>
              </tr>
            ))}

            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-blue-fantastic/50 text-xs">
                  No invoices matching your current filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
