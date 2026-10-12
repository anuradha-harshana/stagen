"use client";

import React from "react";
import { AlertTriangle, BarChart2 } from "lucide-react";
import {
  MonthlyTrend,
  StageDuration,
  OperationalBottleneck,
} from "@/lib/types/reports";

interface ReportsChartsProps {
  monthlyTrends?: MonthlyTrend[];
  stageDurations?: StageDuration[];
  bottleneck?: OperationalBottleneck;
  isLoading?: boolean;
}

export function ReportsCharts({
  monthlyTrends,
  stageDurations,
  bottleneck,
  isLoading,
}: ReportsChartsProps) {
  if (isLoading || !monthlyTrends || !stageDurations) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-64 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-80 mb-6" />
          <div className="h-56 bg-slate-50 rounded w-full" />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-52 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-64 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-2 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate dynamic dimensions from JSON data
  const maxMetric = Math.max(
    ...monthlyTrends.map((t) => Math.max(t.scheduled, t.completed)),
    20
  );
  const chartHeight = 130;
  const baselineY = 170;
  const count = monthlyTrends.length;
  const paddingLeft = 42;
  const paddingRight = 20;
  const availableWidth = 500 - paddingLeft - paddingRight;
  const slotWidth = count > 0 ? availableWidth / count : 70;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      {/* Site Velocity & Completion Area Chart */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-semibold text-base text-blue-fantastic">
              Monthly Site Progress & Completion Trends
            </h3>
            <p className="text-xs text-blue-fantastic/60">
              Scheduled vs completed site milestone targets across active sites
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-fantastic"></span>
              <span className="text-blue-fantastic font-semibold">Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-burning-flame"></span>
              <span className="text-blue-fantastic font-semibold">Completed</span>
            </div>
          </div>
        </div>

        {/* SVG Grouped Bar Chart with Integrated Aligned Labels */}
        {monthlyTrends.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-blue-fantastic/40">
            <BarChart2 className="h-8 w-8 mb-2" />
            <span className="text-xs">No monthly trends data available</span>
          </div>
        ) : (
          <div className="h-64 w-full relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 210"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Y-Axis Value Labels */}
              <text x="32" y="44" textAnchor="end" fill="#94A3B8" fontSize="9" fontWeight="600">
                {maxMetric}
              </text>
              <text x="32" y="108" textAnchor="end" fill="#94A3B8" fontSize="9" fontWeight="600">
                {Math.round(maxMetric / 2)}
              </text>
              <text x="32" y="173" textAnchor="end" fill="#94A3B8" fontSize="9" fontWeight="600">
                0
              </text>

              {/* Horizontal Grid lines */}
              <line
                x1={paddingLeft}
                y1="40"
                x2={500 - paddingRight}
                y2="40"
                stroke="#F1F5F9"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingLeft}
                y1="105"
                x2={500 - paddingRight}
                y2="105"
                stroke="#F1F5F9"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingLeft}
                y1={baselineY}
                x2={500 - paddingRight}
                y2={baselineY}
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />

              {/* Dynamic Bars & Integrated Aligned Month Labels */}
              {monthlyTrends.map((trend, i) => {
                const centerX = paddingLeft + (i + 0.5) * slotWidth;
                const barWidth = Math.min(20, slotWidth * 0.32);
                const barGap = 4;

                const schedX = centerX - barWidth - barGap / 2;
                const compX = centerX + barGap / 2;

                const schedH = Math.max(
                  4,
                  (trend.scheduled / maxMetric) * chartHeight
                );
                const compH = Math.max(
                  4,
                  (trend.completed / maxMetric) * chartHeight
                );

                const schedY = baselineY - schedH;
                const compY = baselineY - compH;

                return (
                  <g key={trend.month} className="group">
                    {/* Scheduled Bar */}
                    <rect
                      x={schedX}
                      y={schedY}
                      width={barWidth}
                      height={schedH}
                      fill="#2C3B4D"
                      rx="3"
                      className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                    >
                      <title>{`${trend.month} Scheduled: ${trend.scheduled}`}</title>
                    </rect>

                    {/* Completed Bar */}
                    <rect
                      x={compX}
                      y={compY}
                      width={barWidth}
                      height={compH}
                      fill="#FFB162"
                      rx="3"
                      className="transition-all duration-300 hover:opacity-85 cursor-pointer"
                    >
                      <title>{`${trend.month} Completed: ${trend.completed}`}</title>
                    </rect>

                    {/* Perfectly Center-Aligned Month Label directly under the bar pair */}
                    <text
                      x={centerX}
                      y={196}
                      textAnchor="middle"
                      fill="#2C3B4D"
                      fontSize="11"
                      fontWeight="600"
                      className="select-none"
                    >
                      {trend.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Stage Bottlenecks Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-blue-fantastic">
            Average Days Per Construction Stage
          </h3>
          <p className="text-xs text-blue-fantastic/60">
            Comparing average days vs target benchmark
          </p>
        </div>

        <div className="space-y-4 my-4">
          {stageDurations.map((stg) => (
            <div key={stg.stage} className="text-xs space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-blue-fantastic">{stg.stage}</span>
                <span className="text-blue-fantastic">
                  {stg.days}{" "}
                  <span className="font-normal text-blue-fantastic/50">
                    (Target: {stg.target})
                  </span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stg.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(stg.pct, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {bottleneck && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Operational Bottleneck:</span>{" "}
              {bottleneck.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
