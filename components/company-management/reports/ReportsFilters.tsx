"use client";

import React from "react";
import { Filter, Calendar } from "lucide-react";

interface ReportsFiltersProps {
  selectedRegion: string;
  onRegionChange: (val: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (val: string) => void;
}

export function ReportsFilters({
  selectedRegion,
  onRegionChange,
  selectedTimeframe,
  onTimeframeChange,
}: ReportsFiltersProps) {
  return (
    <div className="bg-palladian rounded-xl p-4 shadow-sm border border-blue-fantastic/15 flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-blue-fantastic/70 font-medium">
          <Filter className="h-4 w-4 text-truffle-trouble" />
          <span>Filters:</span>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <span className="text-blue-fantastic/60">Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="bg-slate-50 border border-blue-fantastic/15 rounded-lg px-3 py-1.5 text-blue-fantastic font-semibold focus:outline-none focus:border-truffle-trouble"
          >
            <option value="All">All Regions (National)</option>
            <option value="NSW">NSW</option>
            <option value="VIC">VIC</option>
            <option value="QLD">QLD</option>
            <option value="WA">WA</option>
          </select>
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center gap-2">
          <span className="text-blue-fantastic/60">Timeframe:</span>
          <select
            value={selectedTimeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
            className="bg-slate-50 border border-blue-fantastic/15 rounded-lg px-3 py-1.5 text-blue-fantastic font-semibold focus:outline-none focus:border-truffle-trouble"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Q2 2026">Q2 2026</option>
            <option value="YTD 2026">YTD 2026</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 text-blue-fantastic/60">
        <Calendar className="h-4 w-4 text-burning-flame" />
        <span>Last synchronized: Today at 09:30 AM</span>
      </div>
    </div>
  );
}
