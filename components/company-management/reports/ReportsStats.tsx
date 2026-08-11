"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function ReportsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-oatmeal/60 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Total Active Sites
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          120
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+9% vs previous quarter</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-oatmeal/60 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Avg Stage Duration
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          14.2 Days
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
          <TrendingDown className="h-3.5 w-3.5" />
          <span>-8% faster stage completion</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-oatmeal/60 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Site Completion Rate
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          84.5%
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+3.2% on-time milestone delivery</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-oatmeal/60 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Operational Score
        </span>
        <div className="text-3xl font-bold font-sans text-truffle-trouble mt-2">
          94 / 100
        </div>
        <p className="text-xs text-blue-fantastic/60 mt-1">High Efficiency Rating</p>
      </div>
    </div>
  );
}
