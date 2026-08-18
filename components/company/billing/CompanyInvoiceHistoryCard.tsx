"use client"

import React from "react"
import { Download, CheckCircle2, FileText } from "lucide-react"
import { toast } from "sonner"
import { InvoiceItem } from "./types"

interface CompanyInvoiceHistoryCardProps {
  invoices: InvoiceItem[]
  onSelectInvoice: (invoice: InvoiceItem) => void
}

export function CompanyInvoiceHistoryCard({
  invoices,
  onSelectInvoice,
}: CompanyInvoiceHistoryCardProps) {
  const handleDownloadPdf = (e: React.MouseEvent, invoice: InvoiceItem) => {
    e.stopPropagation()
    toast.success(`Downloading invoice ${invoice.invoiceNumber}...`)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-fantastic/15 font-sans flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h3 className="text-lg sm:text-xl font-bold text-blue-fantastic font-sans">
            Invoice History
          </h3>
          <span className="text-xs text-neutral-400 font-medium">
            Showing last {invoices.length} invoices
          </span>
        </div>

        {/* Table Header */}
        <div className="bg-neutral-50/80 rounded-xl px-4 py-2.5 grid grid-cols-12 text-[11px] uppercase tracking-widest font-bold text-neutral-400 mb-2">
          <div className="col-span-4 sm:col-span-4">DATE</div>
          <div className="col-span-3 sm:col-span-3">AMOUNT</div>
          <div className="col-span-3 sm:col-span-3">STATUS</div>
          <div className="col-span-2 sm:col-span-2 text-right">INVOICE</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-neutral-100">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => onSelectInvoice(inv)}
              className="grid grid-cols-12 items-center py-3.5 px-4 rounded-xl hover:bg-neutral-50/80 transition-colors cursor-pointer group"
            >
              {/* DATE */}
              <div className="col-span-4 sm:col-span-4 text-xs sm:text-sm font-bold text-blue-fantastic group-hover:text-truffle-trouble transition-colors">
                {inv.date}
              </div>

              {/* AMOUNT */}
              <div className="col-span-3 sm:col-span-3 text-xs sm:text-sm font-medium text-neutral-400">
                ${inv.amount.toFixed(2)}
              </div>

              {/* STATUS */}
              <div className="col-span-3 sm:col-span-3">
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 stroke-[2.5]" />
                  <span>{inv.status}</span>
                </span>
              </div>

              {/* INVOICE DOWNLOAD */}
              <div className="col-span-2 sm:col-span-2 text-right flex justify-end">
                <button
                  onClick={(e) => handleDownloadPdf(e, inv)}
                  title="Download Invoice PDF"
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-blue-fantastic hover:bg-neutral-200/60 transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
