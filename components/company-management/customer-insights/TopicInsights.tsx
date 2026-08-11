"use client";

import React from "react";
import { TrendingUp, Clock, HelpCircle, Activity } from "lucide-react";

export default function TopicInsights() {
  const topics = [
    { label: "Timeline & Delivery", value: 40, color: "bg-truffle-trouble" },
    { label: "Site Access & Safety", value: 30, color: "bg-burning-flame" },
    { label: "Design & Variations", value: 20, color: "bg-blue-fantastic" },
    { label: "Billing & Invoices", value: 10, color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-6 w-full font-cream">
      {/* 1. Inquiry Topic Breakdown */}
      <div className="bg-palladian p-6 rounded-2xl border border-blue-fantastic/10 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-blue-fantastic/5">
          <TrendingUp className="h-4.5 w-4.5 text-truffle-trouble" />
          <h3 className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">
            Inquiry Topic Distribution
          </h3>
        </div>

        <p className="text-[11px] text-blue-fantastic/60 font-semibold leading-relaxed">
          Distribution of customer inquiries across categories, processed by AI classification.
        </p>

        <div className="space-y-3.5">
          {topics.map((t) => (
            <div key={t.label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-fantastic/75">{t.label}</span>
                <span className="text-blue-fantastic">{t.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-blue-fantastic/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.color}`}
                  style={{ width: `${t.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Response Speed Metrics */}
      <div className="bg-palladian p-6 rounded-2xl border border-blue-fantastic/10 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-blue-fantastic/5">
          <Clock className="h-4.5 w-4.5 text-burning-flame" />
          <h3 className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">
            Resolution Performance
          </h3>
        </div>

        <div className="space-y-3 pl-1">
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-lg flex items-center justify-center shrink-0">
              <Activity className="h-4 w-4 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-fantastic">AI Average Response Speed</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Instant (&lt; 5 seconds)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-7 w-7 bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-fantastic">Admin Average Response Speed</p>
              <p className="text-[11px] text-truffle-trouble font-bold mt-0.5">1.5 Hours (Same-day resolution)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-7 w-7 bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-lg flex items-center justify-center shrink-0">
              <HelpCircle className="h-4 w-4 text-burning-flame" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-fantastic">Active Supervisor Workload</p>
              <p className="text-[11px] text-blue-fantastic/60 font-semibold mt-0.5">
                Eric (Supervisor): <strong>3 lots</strong> assigned
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
