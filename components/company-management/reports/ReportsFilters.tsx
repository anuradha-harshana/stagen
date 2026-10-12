"use client";

import React from "react";
import { Filter, Calendar } from "lucide-react";

interface ReportsFiltersProps {
  selectedRegion: string;
  onRegionChange: (val: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (val: string) => void;
  lastSynchronized?: string;
  availableTimeframes?: string[];
  availableRegions?: string[];
}

export function ReportsFilters({
  selectedRegion,
  onRegionChange,
  selectedTimeframe,
  onTimeframeChange,
  lastSynchronized,
  availableTimeframes = [],
  availableRegions = [],
}: ReportsFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-fantastic/15 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-blue-fantastic/70 font-medium">
          <Filter className="h-4 w-4 text-truffle-trouble" />
          <span>Filters:</span>
        </div>

        {/* Region Filter */}
        {availableRegions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-blue-fantastic/60">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="bg-slate-50 border border-blue-fantastic/15 rounded-lg px-3 py-1.5 text-blue-fantastic font-semibold focus:outline-none focus:border-truffle-trouble cursor-pointer"
            >
              {availableRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg === "All" ? "All Regions (National)" : reg}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timeframe Filter */}
        {availableTimeframes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-blue-fantastic/60">Timeframe:</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => onTimeframeChange(e.target.value)}
              className="bg-slate-50 border border-blue-fantastic/15 rounded-lg px-3 py-1.5 text-blue-fantastic font-semibold focus:outline-none focus:border-truffle-trouble cursor-pointer"
            >
              {availableTimeframes.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {lastSynchronized && (
        <div className="flex items-center gap-2 text-blue-fantastic/60">
          <Calendar className="h-4 w-4 text-burning-flame" />
          <span>Last synchronized: {lastSynchronized}</span>
        </div>
      )}
    </div>
  );
}
