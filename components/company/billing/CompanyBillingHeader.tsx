"use client"

import React from "react"
import { CreditCard } from "lucide-react"

export function CompanyBillingHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-blue-fantastic/15 font-sans">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
          <CreditCard className="h-5 w-5 text-burning-flame" />
        </div>
        <div>
          <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
            Billing & Licences
          </h1>
          <p className="text-blue-fantastic/60 text-xs sm:text-sm font-medium font-sans mt-0.5">
            Manage your subscription, payment methods, and invoices.
          </p>
        </div>
      </div>
    </div>
  )
}
