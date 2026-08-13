"use client";

import React from "react";
import { Download, CreditCard } from "lucide-react";

interface BillingHeaderProps {
  onExport: () => void;
  onManageSubscriptions: () => void;
}

export function BillingHeader({ onExport, onManageSubscriptions }: BillingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-fantastic/15 font-sans w-full">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
          <CreditCard className="h-5 w-5 text-burning-flame" />
        </div>
        <div>
          <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
            Billing & Site Usage
          </h1>
          <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
            Real-time insights into revenue, site tier usage, and automated invoice reconciliation.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-blue-fantastic/20 hover:bg-blue-fantastic hover:text-palladian transition-all duration-200"
        >
          <Download className="h-4 w-4" />
          Export Statement
        </button>
        <button
          onClick={onManageSubscriptions}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-truffle-trouble text-palladian shadow-md hover:bg-truffle-trouble/90 transition-all duration-200"
        >
          <CreditCard className="h-4 w-4 text-burning-flame" />
          Manage Subscriptions
        </button>
      </div>
    </div>
  );
}
