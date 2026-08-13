"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: any) => void;
  stageFilter: string;
  onStageFilterChange: (value: string) => void;
}

const STAGES = [
  "Site Cut",
  "Slab",
  "Frame",
  "Lockup",
  "Fixing",
  "Completion",
  "Handover",
];

export default function ProjectsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stageFilter,
  onStageFilterChange,
}: ProjectsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full bg-palladian p-4 rounded-2xl border border-blue-fantastic/5 shadow-sm">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-fantastic/40 pointer-events-none" />
        <Input
          placeholder="Search lot, client or address..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-sm font-sans w-full focus-visible:ring-truffle-trouble"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Status Buttons */}
        <div className="flex gap-1 bg-blue-fantastic/5 p-0.5 rounded-xl border border-blue-fantastic/10">
          {(["All", "On Track", "Delayed", "Action Required"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => onStatusFilterChange(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
                statusFilter === filter
                  ? "bg-blue-fantastic text-palladian shadow-sm"
                  : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Stage Select Dropdown */}
        <Select value={stageFilter} onValueChange={onStageFilterChange}>
          <SelectTrigger className="w-44 bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 text-xs font-bold font-sans focus:ring-truffle-trouble">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent className="bg-palladian text-blue-fantastic border-blue-fantastic/10">
            <SelectItem value="All" className="text-xs font-bold font-sans">All Stages</SelectItem>
            {STAGES.map((stage) => (
              <SelectItem key={stage} value={stage} className="text-xs font-bold font-sans">
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
