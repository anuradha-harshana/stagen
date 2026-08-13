"use client"

import { CreditCard, FileText, Settings2, Wallet, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function BillingSettings() {
  const handleItemClick = (label: string) => {
    toast.info(`Clicked: ${label}`)
  }

  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-sans w-[1000px] max-w-2xl">
      <CardHeader className="border-b border-blue-fantastic/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-truffle-trouble" />
          </div>
          <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
            Billing Settings
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Plan */}
        <button
          onClick={() => handleItemClick("Plan")}
          className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
              <Settings2 className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-fantastic">
                Plan
              </h4>
              <p className="text-xs text-blue-fantastic/60 mt-0.5">
                Current Plan: Professional
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
        </button>

        {/* Billing Information */}
        <button
          onClick={() => handleItemClick("Billing Information")}
          className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-fantastic">
                Billing Information
              </h4>
              <p className="text-xs text-blue-fantastic/60 mt-0.5">
                Update your billing details
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
        </button>

        {/* Payment Methods */}
        <button
          onClick={() => handleItemClick("Payment Methods")}
          className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
              <Wallet className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-fantastic">
                Payment Methods
              </h4>
              <p className="text-xs text-blue-fantastic/60 mt-0.5">
                Manage your saved payment methods
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
        </button>

        {/* Invoice History */}
        <button
          onClick={() => handleItemClick("Invoice History")}
          className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-fantastic">
                Invoice History
              </h4>
              <p className="text-xs text-blue-fantastic/60 mt-0.5">
                View and download your invoices
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
        </button>
      </CardContent>
    </Card>
  )
}
