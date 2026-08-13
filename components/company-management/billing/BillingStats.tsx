"use client";

import React from "react";
import { DollarSign, TrendingUp, Clock, Building2 } from "lucide-react";

export function BillingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
            Monthly Revenue
          </span>
          <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
            $245,680
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>↑ 14% vs last month</span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-truffle-trouble/10 border border-truffle-trouble/20 flex items-center justify-center text-truffle-trouble">
          <DollarSign className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
            Outstanding Invoices
          </span>
          <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
            $68,450
          </div>
          <div className="text-xs text-truffle-trouble font-medium mt-1">
            12 Pending Invoices
          </div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-burning-flame/20 border border-burning-flame/30 flex items-center justify-center text-blue-fantastic">
          <Clock className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-palladian rounded-xl p-6 shadow-sm border border-blue-fantastic/15 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
            Active Sites
          </span>
          <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
            120
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>↑ 9% vs last month</span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-xl bg-blue-fantastic/10 border border-blue-fantastic/20 flex items-center justify-center text-blue-fantastic">
          <Building2 className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
