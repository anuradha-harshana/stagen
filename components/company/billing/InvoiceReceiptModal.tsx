"use client"

import React from "react"
import { X, Download, Printer, CheckCircle2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { InvoiceItem } from "./types"

interface InvoiceReceiptModalProps {
  invoice: InvoiceItem | null
  onClose: () => void
}

export function InvoiceReceiptModal({ invoice, onClose }: InvoiceReceiptModalProps) {
  if (!invoice) return null

  const handleDownload = () => {
    toast.success(`Downloading PDF for invoice ${invoice.invoiceNumber}...`)
  }

  const handlePrint = () => {
    toast.info(`Preparing print preview for ${invoice.invoiceNumber}...`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-cream">
      <div className="bg-white rounded-3xl shadow-2xl border border-oatmeal/30 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-oatmeal/20 bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-fantastic/10 flex items-center justify-center text-blue-fantastic font-bold">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-fantastic font-cream">
                Receipt {invoice.invoiceNumber}
              </h2>
              <span className="text-xs text-neutral-400 font-medium">Billed on {invoice.date}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-palladian transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Invoice Body Content */}
        <div className="p-6 space-y-6">
          {/* Status & Amount Overview Card */}
          <div className="bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Total Amount Paid
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-blue-fantastic font-cream">
                ${invoice.amount.toFixed(2)}
              </span>
            </div>
            <span className="bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {invoice.status}
            </span>
          </div>

          {/* Billing Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] block mb-1">
                Billed To
              </span>
              <p className="font-bold text-blue-fantastic">Stagen Construction Ltd.</p>
              <p className="text-neutral-500">123 Builder Way, Suite 400</p>
              <p className="text-neutral-500">Sydney NSW 2000, Australia</p>
            </div>

            <div>
              <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] block mb-1">
                Payment Details
              </span>
              <p className="font-bold text-blue-fantastic">Visa ending in 4242</p>
              <p className="text-neutral-500">Processed automatically</p>
              <p className="text-neutral-500">Ref: TXN-89302910</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border-t border-b border-neutral-100 py-4 space-y-2">
            <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] block mb-2">
              Itemized Breakdown
            </span>
            {invoice.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
                <span className="font-medium text-neutral-700">{item.description}</span>
                <span className="font-bold text-blue-fantastic">${item.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs py-1 pt-2 border-t border-dashed border-neutral-200 font-bold">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-blue-fantastic">${invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 text-neutral-500">
              <span>GST / Tax (0%)</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-oatmeal/20 bg-neutral-50/50">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="h-10 px-4 border-neutral-200 text-neutral-700 text-xs font-bold rounded-xl hover:bg-neutral-100 gap-2 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 border-neutral-200 text-neutral-600 text-xs font-bold rounded-xl hover:bg-neutral-100 cursor-pointer"
            >
              Close
            </Button>
            <Button
              onClick={handleDownload}
              className="h-10 px-4 bg-blue-fantastic text-palladian hover:bg-blue-fantastic/90 text-xs font-bold rounded-xl shadow-sm gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
