"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ReportKpiStats } from "@/lib/types/reports";

interface ReportsStatsProps {
  stats?: ReportKpiStats;
  isLoading?: boolean;
}

export function ReportsStats({ stats, isLoading }: ReportsStatsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 animate-pulse"
          >
            <div className="h-3 bg-slate-200 rounded w-24 mb-3" />
            <div className="h-8 bg-slate-200 rounded w-32 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-40" />
          </div>
        ))}
      </div>
    );
  }

  const { totalActiveSites, avgStageDuration, siteCompletionRate, operationalScore } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-sans">
      {/* Total Active Sites */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Total Active Sites
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          {totalActiveSites.value}
        </div>
        {totalActiveSites.change && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
            {totalActiveSites.trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : totalActiveSites.trend === "down" ? (
              <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>{totalActiveSites.change}</span>
          </div>
        )}
      </div>

      {/* Avg Stage Duration */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Avg Stage Duration
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          {avgStageDuration.value}
        </div>
        {avgStageDuration.change && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
            {avgStageDuration.trend === "down" ? (
              <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
            ) : avgStageDuration.trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>{avgStageDuration.change}</span>
          </div>
        )}
      </div>

      {/* Site Completion Rate */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Site Completion Rate
        </span>
        <div className="text-3xl font-bold font-sans text-blue-fantastic mt-2">
          {siteCompletionRate.value}
        </div>
        {siteCompletionRate.change && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
            {siteCompletionRate.trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : siteCompletionRate.trend === "down" ? (
              <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-slate-400" />
            )}
            <span>{siteCompletionRate.change}</span>
          </div>
        )}
      </div>

      {/* Operational Score */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-fantastic/15 hover:shadow-md transition-shadow">
        <span className="text-xs uppercase font-semibold text-blue-fantastic/60 tracking-wider">
          Operational Score
        </span>
        <div className="text-3xl font-bold font-sans text-truffle-trouble mt-2">
          {operationalScore.value} / {operationalScore.max}
        </div>
        <p className="text-xs text-blue-fantastic/60 mt-1">{operationalScore.label}</p>
      </div>
    </div>
  );
}
