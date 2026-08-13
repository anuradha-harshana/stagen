"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

export type QuestionStatusFilter = "ALL" | "PENDING" | "ANSWERED"
export type QuestionCategoryFilter =
  | "ALL"
  | "Build Progress"
  | "Inspections & Sign-off"
  | "Materials & Specs"
  | "Variations & Costs"
  | "Timeline & Handover"

interface QuestionsFilterBarProps {
  statusFilter: QuestionStatusFilter
  onStatusFilterChange: (status: QuestionStatusFilter) => void
  categoryFilter: QuestionCategoryFilter
  onCategoryFilterChange: (category: QuestionCategoryFilter) => void
  counts: {
    all: number
    pending: number
    answered: number
  }
}

const CATEGORIES: QuestionCategoryFilter[] = [
  "ALL",
  "Build Progress",
  "Inspections & Sign-off",
  "Materials & Specs",
  "Variations & Costs",
  "Timeline & Handover",
]

export function QuestionsFilterBar({
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  counts,
}: QuestionsFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-palladian border border-blue-fantastic/15 p-3 rounded-2xl font-sans shadow-xs">
      {/* Status Pill Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onStatusFilterChange("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === "ALL"
              ? "bg-blue-fantastic text-palladian shadow-xs"
              : "text-blue-fantastic/70 hover:bg-blue-fantastic/10 hover:text-blue-fantastic"
          }`}
        >
          All ({counts.all})
        </button>

        <button
          onClick={() => onStatusFilterChange("PENDING")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === "PENDING"
              ? "bg-burning-flame text-truffle-trouble shadow-xs"
              : "text-blue-fantastic/70 hover:bg-burning-flame/15 hover:text-truffle-trouble"
          }`}
        >
          Pending
          <Badge
            variant="outline"
            className="text-[10px] bg-truffle-trouble text-palladian border-transparent px-1.5 py-0"
          >
            {counts.pending}
          </Badge>
        </button>

        <button
          onClick={() => onStatusFilterChange("ANSWERED")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === "ANSWERED"
              ? "bg-truffle-trouble text-palladian shadow-xs"
              : "text-blue-fantastic/70 hover:bg-truffle-trouble/10 hover:text-truffle-trouble"
          }`}
        >
          Answered ({counts.answered})
        </button>
      </div>

      {/* Category Dropdown Filter */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider">
          Category:
        </span>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value as QuestionCategoryFilter)}
          className="px-3 py-1.5 text-xs font-bold bg-palladian border border-blue-fantastic/20 rounded-xl text-blue-fantastic focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none cursor-pointer font-sans"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "ALL" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
