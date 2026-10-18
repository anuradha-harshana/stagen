"use client";

import React, { useState } from "react";
import { BarChart3 } from "lucide-react";

export interface RegionalBillingData {
  region: "NSW" | "VIC" | "QLD" | "WA" | "SA";
  name: string;
  paid: number;
  pending: number;
  overdue: number;
  total: number;
}

export const REGIONAL_BILLING_STATS: RegionalBillingData[] = [
  {
    region: "NSW",
    name: "New South Wales",
    paid: 78500,
    pending: 16450,
    overdue: 7500,
    total: 102450,
  },
  {
    region: "VIC",
    name: "Victoria",
    paid: 56200,
    pending: 14120,
    overdue: 8000,
    total: 78320,
  },
  {
    region: "QLD",
    name: "Queensland",
    paid: 34400,
    pending: 8290,
    overdue: 4200,
    total: 46890,
  },
  {
    region: "WA",
    name: "Western Australia",
    paid: 11660,
    pending: 3500,
    overdue: 2180,
    total: 17340,
  },
  {
    region: "SA",
    name: "South Australia",
    paid: 7200,
    pending: 2650,
    overdue: 0,
    total: 9850,
  },
];

// Color definitions matching the design system
const COLORS = {
  paid: "#2C3B4D",      // blue-fantastic
  pending: "#A35139",   // truffle-trouble
  overdue: "#EF4444",   // rose-500
};

interface RegionalBillingChartProps {
  onAction?: (message: string) => void;
}

export function RegionalBillingChart({ onAction }: RegionalBillingChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{
    region: string;
    type: "Paid" | "Pending" | "Overdue";
    amount: number;
  } | null>(null);

  // SVG Chart Config
  const chartWidth = 600;
  const chartHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 35;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const innerWidth = chartWidth - paddingLeft - paddingRight;

  const maxVal = 100000;
  const yTicks = [0, 25000, 50000, 75000, 100000];
  const slotWidth = innerWidth / REGIONAL_BILLING_STATS.length;
  const barWidth = 20;
  const barGap = 6;
  const groupWidth = barWidth * 3 + barGap * 2;

  // National Summary
  const grandTotals = REGIONAL_BILLING_STATS.reduce(
    (acc, item) => ({
      paid: acc.paid + item.paid,
      pending: acc.pending + item.pending,
      overdue: acc.overdue + item.overdue,
      total: acc.total + item.total,
    }),
    { paid: 0, pending: 0, overdue: 0, total: 0 }
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-fantastic/15 p-6 font-sans">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-fantastic/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-fantastic/5 flex items-center justify-center text-blue-fantastic">
              <BarChart3 className="h-4.5 w-4.5 text-truffle-trouble" />
            </div>
            <h3 className="font-semibold text-base text-blue-fantastic">
              Regional Billing Statistics
            </h3>
          </div>
          <p className="text-xs text-blue-fantastic/60 mt-0.5">
            Region-wise breakdown of paid, pending, and overdue invoice amounts
          </p>
        </div>

        {/* Legend with matching project colors */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-fantastic"></span>
            <span className="text-blue-fantastic font-semibold">Paid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-truffle-trouble"></span>
            <span className="text-truffle-trouble font-semibold">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500"></span>
            <span className="text-rose-600 font-semibold">Overdue</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative w-full h-64 mt-4">
        {/* Hover Tooltip Overlay */}
        {hoveredBar && (
          <div className="absolute top-2 right-2 bg-blue-fantastic text-white text-xs px-3 py-1.5 rounded-lg shadow-md pointer-events-none flex items-center gap-2 z-10 border border-blue-fantastic/30">
            <span className="font-bold">{hoveredBar.region}</span>
            <span className="opacity-70">•</span>
            <span
              className={
                hoveredBar.type === "Paid"
                  ? "text-burning-flame font-semibold"
                  : hoveredBar.type === "Pending"
                  ? "text-orange-300 font-semibold"
                  : "text-rose-300 font-semibold"
              }
            >
              {hoveredBar.type}: ${hoveredBar.amount.toLocaleString()}
            </span>
          </div>
        )}

        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((val) => {
            const y = paddingTop + innerHeight - (val / maxVal) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray={val === 0 ? "none" : "4 4"}
                  strokeWidth={val === 0 ? "1.5" : "1"}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="600"
                  fill="#94A3B8"
                >
                  ${val / 1000}k
                </text>
              </g>
            );
          })}

          {/* Grouped Regional Bars */}
          {REGIONAL_BILLING_STATS.map((d, idx) => {
            const slotX = paddingLeft + idx * slotWidth;
            const startX = slotX + (slotWidth - groupWidth) / 2;
            const baseY = paddingTop + innerHeight;

            // Heights
            const paidH = Math.max((d.paid / maxVal) * innerHeight, 2);
            const pendingH = Math.max((d.pending / maxVal) * innerHeight, 2);
            const overdueH = d.overdue > 0 ? Math.max((d.overdue / maxVal) * innerHeight, 2) : 0;

            const paidX = startX;
            const pendingX = startX + barWidth + barGap;
            const overdueX = startX + (barWidth + barGap) * 2;

            return (
              <g key={d.region}>
                {/* Paid Bar - Blue Fantastic (#2C3B4D) */}
                <rect
                  x={paidX}
                  y={baseY - paidH}
                  width={barWidth}
                  height={paidH}
                  fill={COLORS.paid}
                  rx="3"
                  className="cursor-pointer transition-all duration-150 hover:opacity-85"
                  onMouseEnter={() =>
                    setHoveredBar({ region: d.region, type: "Paid", amount: d.paid })
                  }
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Pending Bar - Truffle Trouble (#A35139) */}
                <rect
                  x={pendingX}
                  y={baseY - pendingH}
                  width={barWidth}
                  height={pendingH}
                  fill={COLORS.pending}
                  rx="3"
                  className="cursor-pointer transition-all duration-150 hover:opacity-85"
                  onMouseEnter={() =>
                    setHoveredBar({ region: d.region, type: "Pending", amount: d.pending })
                  }
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Overdue Bar - Rose-500 (#EF4444) */}
                {overdueH > 0 ? (
                  <rect
                    x={overdueX}
                    y={baseY - overdueH}
                    width={barWidth}
                    height={overdueH}
                    fill={COLORS.overdue}
                    rx="3"
                    className="cursor-pointer transition-all duration-150 hover:opacity-85"
                    onMouseEnter={() =>
                      setHoveredBar({ region: d.region, type: "Overdue", amount: d.overdue })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                ) : (
                  <rect
                    x={overdueX}
                    y={baseY - 2}
                    width={barWidth}
                    height={2}
                    fill="#E2E8F0"
                    rx="1"
                  />
                )}

                {/* X-Axis Region Label */}
                <text
                  x={slotX + slotWidth / 2}
                  y={baseY + 18}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#2C3B4D"
                >
                  {d.region}
                </text>
                <text
                  x={slotX + slotWidth / 2}
                  y={baseY + 29}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748B"
                  fontWeight="500"
                >
                  ${Math.round(d.total / 1000)}k
                </text>
              </g>
            );
          })}
        </svg>
      </div>


      {/* Grand Total Strip */}
      <div className="mt-4 p-3 bg-slate-100/70 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs text-blue-fantastic">
        <span className="font-bold uppercase tracking-wider text-[11px] text-blue-fantastic/70">
          All Regions Combined Total:
        </span>
        <div className="flex items-center gap-4 font-semibold">
          <span className="flex items-center gap-1.5 text-blue-fantastic">
            <span className="h-2 w-2 rounded-full bg-blue-fantastic"></span>
            Paid: ${grandTotals.paid.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-truffle-trouble">
            <span className="h-2 w-2 rounded-full bg-truffle-trouble"></span>
            Pending: ${grandTotals.pending.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            Overdue: ${grandTotals.overdue.toLocaleString()}
          </span>
          <span className="font-bold text-blue-fantastic pl-2 border-l border-blue-fantastic/20">
            Total: ${grandTotals.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Export as both ProjectSiteUsageTable (for compatibility) and RegionalBillingChart
export const ProjectSiteUsageTable = RegionalBillingChart;
