"use client";

import React from "react";

export function BillingCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Over Time Line Chart */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-base text-blue-fantastic">
              Revenue Over Time
            </h3>
            <p className="text-xs text-blue-fantastic/60">
              Monthly recurring revenue stream in AUD ($k)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-truffle-trouble"></span>
            <span className="text-xs text-blue-fantastic/70 font-medium">
              FY 2025/26
            </span>
          </div>
        </div>

        {/* SVG Smooth Area Line Chart */}
        <div className="relative h-64 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A35139" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFB162" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="40" x2="500" y2="40" stroke="#E2E8F0" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="#E2E8F0" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="#E2E8F0" strokeDasharray="4 4" />

            {/* Y Axis Labels */}
            <text x="0" y="35" fill="#64748B" fontSize="10">400K</text>
            <text x="0" y="85" fill="#64748B" fontSize="10">300K</text>
            <text x="0" y="135" fill="#64748B" fontSize="10">200K</text>
            <text x="0" y="185" fill="#64748B" fontSize="10">0</text>

            {/* Chart Path Area */}
            <path
              d="M 40 160 Q 120 140 180 110 T 320 90 T 420 60 L 480 50 L 480 180 L 40 180 Z"
              fill="url(#revenueGrad)"
            />

            {/* Chart Main Line */}
            <path
              d="M 40 160 Q 120 140 180 110 T 320 90 T 420 60 L 480 50"
              fill="none"
              stroke="#A35139"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Hover Circles */}
            <circle cx="40" cy="160" r="4" fill="#A35139" />
            <circle cx="120" cy="140" r="4" fill="#A35139" />
            <circle cx="200" cy="110" r="4" fill="#A35139" />
            <circle cx="290" cy="90" r="4" fill="#A35139" />
            <circle cx="380" cy="65" r="4" fill="#A35139" />
            <circle cx="480" cy="50" r="6" fill="#FFB162" stroke="#A35139" strokeWidth="2" />
          </svg>

          {/* X Axis Month Labels */}
          <div className="flex justify-between text-xs text-blue-fantastic/60 mt-3 px-6">
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
          </div>
        </div>
      </div>

      {/* Invoice Status Donut Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-blue-fantastic">
            Invoice Status
          </h3>
          <p className="text-xs text-blue-fantastic/60">
            Breakdown of total 48 active billing invoices
          </p>
        </div>

        <div className="my-6 relative flex items-center justify-center">
          {/* SVG Donut Ring */}
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" stroke="#F1F5F9" strokeWidth="12" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#2C3B4D"
              strokeWidth="12"
              fill="none"
              strokeDasharray="160 238"
              strokeDashoffset="0"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#A35139"
              strokeWidth="12"
              fill="none"
              strokeDasharray="50 238"
              strokeDashoffset="-162"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#EF4444"
              strokeWidth="12"
              fill="none"
              strokeDasharray="28 238"
              strokeDashoffset="-214"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold font-sans text-blue-fantastic">48</span>
            <span className="text-[11px] uppercase tracking-wider text-blue-fantastic/60 font-medium">
              Total Invoices
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-blue-fantastic"></span>
              <span>Paid (67%)</span>
            </div>
            <span className="font-semibold">32 Invoices</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-truffle-trouble"></span>
              <span>Pending (21%)</span>
            </div>
            <span className="font-semibold">10 Invoices</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-rose-500"></span>
              <span>Overdue (12%)</span>
            </div>
            <span className="font-semibold text-rose-600">6 Invoices</span>
          </div>
        </div>
      </div>
    </div>
  );
}
