"use client";

import React, { useState } from "react";
import { Search, UserRound, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DefectItem } from "./WarrantyStats";

interface DefectsListProps {
  defects: DefectItem[];
  onManageClick: (defect: DefectItem) => void;
}

const statusConfig = {
  resolved: { label: "Resolved", badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30" },
  "in-progress": { label: "In Progress", badge: "bg-burning-flame/10 text-truffle-trouble border-burning-flame/20" },
  open: { label: "Open", badge: "bg-red-500/10 text-red-700 border-red-500/35" },
};

const priorityConfig = {
  High: { label: "High Priority", badge: "bg-red-500/10 text-red-700 border-red-500/30" },
  Medium: { label: "Medium", badge: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
  Low: { label: "Low", badge: "bg-blue-500/10 text-blue-700 border-blue-500/30" },
};

export default function DefectsList({ defects, onManageClick }: DefectsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in-progress" | "resolved">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "High" | "Medium" | "Low">("all");

  const filtered = defects.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.projectId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || d.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4 w-full font-cream">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3.5 bg-palladian p-4 rounded-2xl border border-blue-fantastic/10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-fantastic/40 pointer-events-none" />
            <Input
              placeholder="Search by client, lot, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-xs font-sans w-full focus-visible:ring-truffle-trouble rounded-xl"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-1 bg-blue-fantastic/5 p-0.5 rounded-xl border border-blue-fantastic/10 flex-wrap">
            {(["all", "open", "in-progress", "resolved"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-[11px] font-bold font-cream transition-all rounded-lg cursor-pointer ${
                  statusFilter === status
                    ? "bg-blue-fantastic text-palladian shadow-sm"
                    : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
                }`}
              >
                {status === "all" ? "All Statuses" : status === "in-progress" ? "In Progress" : status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Priority filter */}
        <div className="flex gap-1.5 items-center flex-wrap pt-2 border-t border-blue-fantastic/5">
          <span className="text-[10px] uppercase font-bold text-blue-fantastic/50 font-sans tracking-wide">
            Priority Filter:
          </span>
          <div className="flex gap-1">
            {(["all", "High", "Medium", "Low"] as const).map((prio) => (
              <button
                key={prio}
                onClick={() => setPriorityFilter(prio)}
                className={`px-2.5 py-1 text-[10px] font-bold font-cream transition-all rounded-md cursor-pointer ${
                  priorityFilter === prio
                    ? "bg-truffle-trouble text-palladian shadow-xs"
                    : "bg-blue-fantastic/4 text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-blue-fantastic/10"
                }`}
              >
                {prio === "all" ? "All Priorities" : prio}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List cards */}
      <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-palladian/40 border border-dashed border-blue-fantastic/20 rounded-2xl">
            <CheckCircle2 className="h-10 w-10 text-blue-fantastic/30 mb-2" />
            <p className="text-sm font-bold text-blue-fantastic">No Defects Found</p>
            <p className="text-xs text-blue-fantastic/60 mt-1">
              Try adjusting your query searches or filter options.
            </p>
          </div>
        ) : (
          filtered.map((d) => {
            const statusCfg = statusConfig[d.status];
            const prioCfg = priorityConfig[d.priority];
            const isEscalated = d.priority === "High" && d.status !== "resolved";

            return (
              <div
                key={d.id}
                className={`p-4 bg-palladian border rounded-2xl hover:border-blue-fantastic/20 transition-all space-y-3 relative group ${
                  isEscalated ? "border-red-400 bg-red-500/5" : "border-blue-fantastic/10"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-fantastic/65 uppercase">
                        {d.id}
                      </span>
                      <Badge variant="outline" className={`text-[9px] font-bold rounded-full border px-2 py-0.5 ${prioCfg.badge}`}>
                        {prioCfg.label}
                      </Badge>
                      <Badge variant="outline" className={`text-[9px] font-bold rounded-full border px-2 py-0.5 ${statusCfg.badge}`}>
                        {statusCfg.label}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-extrabold text-blue-fantastic group-hover:text-truffle-trouble transition-colors">
                      {d.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-blue-fantastic/45 font-medium">{d.reported}</span>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-blue-fantastic/75">
                      Client: <strong className="text-blue-fantastic">{d.clientName}</strong> (Lot {d.projectId.toUpperCase()})
                    </p>
                    <p className="text-[11px] text-blue-fantastic/55 font-medium">
                      Area: <strong>{d.area}</strong>
                    </p>
                  </div>

                  {/* Supervisor Assignee */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-blue-fantastic/4 border border-blue-fantastic/10 px-2 py-1 rounded-xl">
                      <UserRound className="h-3 w-3 text-blue-fantastic/50" />
                      <span className="text-[10px] font-bold text-blue-fantastic/70">
                        {d.assignedSupervisor === "Unassigned" ? "Unassigned" : `Supervisor: ${d.assignedSupervisor}`}
                      </span>
                    </div>

                    <Button
                      onClick={() => onManageClick(d)}
                      size="sm"
                      className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-[10px] font-bold h-7 rounded-xl px-2.5 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
