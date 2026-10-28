"use client";

import React, { useEffect, useState } from "react";
import type { Project } from "@/lib/types/project";
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
  stages: string[];
}

export default function ProjectsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stageFilter,
  onStageFilterChange,
  stages,
}: ProjectsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full bg-white p-4 rounded-2xl border border-blue-fantastic/5 shadow-sm">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-fantastic/40 pointer-events-none" />
        <Input
          placeholder="Search lot, client or address..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-sm font-sans w-full focus-visible:ring-truffle-trouble"
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
          <SelectTrigger className="w-44 bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs font-bold font-sans focus:ring-truffle-trouble">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/10">
            <SelectItem value="All" className="text-xs font-bold font-sans">All Stages</SelectItem>
            {stages.map((stage) => (
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

/** Shared by the company and management user forms. */
export function ProjectAssignmentPicker({ value, onChange, role }: {
  value: string; onChange: (value: string) => void; role: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/company/projects", { cache: "no-store", signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("Unable to load company projects"); return response.json(); })
      .then(data => { if (!controller.signal.aborted) { setProjects(data.projects); setError(""); } })
      .catch(e => { if (!controller.signal.aborted) setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  if (!["Site Supervisor", "Customer"].includes(role)) return <p className="text-xs text-blue-fantastic/60">Project assignments are available for site supervisors and customers.</p>;
  const selected = new Set(value.split(",").map(id => id.trim().replace(/^tenant-/, "")).filter(Boolean));
  const filtered = projects.filter(p => [p.id, p.clientName, p.address].some(v => v.toLowerCase().includes(query.toLowerCase())));
  return <fieldset className="space-y-2">
    <legend className="text-xs font-bold text-blue-fantastic/80">Assigned projects ({selected.size} selected)</legend>
    <p className="text-xs text-blue-fantastic/60">Select any number of projects. Selecting a project replaces its existing {role === "Customer" ? "customer" : "supervisor"} assignment.</p>
    {loading ? <p role="status" className="text-xs">Loading projects…</p> : error ? <p role="alert" className="text-xs text-red-700">{error} <button type="button" className="underline" onClick={() => { setLoading(true); setRevision(v => v + 1); }}>Retry</button></p> : <>
      <Input aria-label="Search available projects" placeholder="Search project, client or address" value={query} onChange={e => setQuery(e.target.value)} />
      <div className="max-h-52 overflow-y-auto rounded-xl border border-blue-fantastic/15 divide-y divide-blue-fantastic/10">
        {filtered.map(p => <label key={p.id} className="flex cursor-pointer items-start gap-3 p-3 hover:bg-blue-fantastic/5">
          <input type="checkbox" className="mt-1 accent-truffle-trouble" checked={selected.has(p.id)} onChange={e => {
            const next = new Set(selected);
            if (e.target.checked) next.add(p.id); else next.delete(p.id);
            onChange([...next].map(id => "tenant-" + id).join(", "));
          }} />
          <span className="min-w-0"><span className="block text-xs font-semibold">{p.clientName} · {p.id}</span><span className="block text-[11px] text-blue-fantastic/60">{p.address}</span></span>
        </label>)}
        {!filtered.length && <p className="p-3 text-xs text-blue-fantastic/60">{projects.length ? "No matching projects." : "No company projects yet. Create a project first."}</p>}
      </div>
      {!!selected.size && <button type="button" className="text-xs text-truffle-trouble underline" onClick={() => onChange("")}>Clear assignments</button>}
    </>}
  </fieldset>;
}
