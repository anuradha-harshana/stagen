"use client";

import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import { AuditLog } from "@/lib/types/audit";

export { type AuditLog };

interface AuditLogsListProps {
  logs: AuditLog[];
  onViewDetails?: (log: AuditLog) => void;
}

export function AuditLogsList({
  logs,
  onViewDetails,
}: AuditLogsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule =
      selectedModule === "All" || log.module === selectedModule;
    const matchesSeverity =
      selectedSeverity === "All" || log.severity === selectedSeverity;
    return matchesSearch && matchesModule && matchesSeverity;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-fantastic/15 overflow-hidden font-sans">
      <div className="p-6 border-b border-blue-fantastic/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-blue-fantastic">
              Recent System Audit Logs
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-fantastic/10 text-blue-fantastic">
              {filteredLogs.length} of {logs.length}
            </span>
          </div>
          <p className="text-xs text-blue-fantastic/60 mt-0.5">
            Immutable system-wide activity log automatically recorded from user activity
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <label htmlFor="search-audit-logs" className="sr-only">
              Search audit logs
            </label>
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-fantastic/40" />
            <input
              id="search-audit-logs"
              type="text"
              placeholder="Search audit logs..."
              aria-label="Search audit logs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-blue-fantastic/15 rounded-lg text-blue-fantastic focus:outline-none focus:border-truffle-trouble w-52 sm:w-60 font-sans"
            />
          </div>

          {/* Module Filter */}
          <select
            id="filter-module"
            aria-label="Filter by module"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-blue-fantastic/15 rounded-lg text-blue-fantastic focus:outline-none focus:border-truffle-trouble font-medium"
          >
            <option value="All">All Modules</option>
            <option value="Projects">Projects</option>
            <option value="Documents">Documents</option>
            <option value="Warranty">Warranty</option>
            <option value="Billing">Billing</option>
            <option value="Users">Users</option>
            <option value="Settings">Settings</option>
          </select>

          {/* Severity Filter */}
          <select
            id="filter-severity"
            aria-label="Filter by severity"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-blue-fantastic/15 rounded-lg text-blue-fantastic focus:outline-none focus:border-truffle-trouble font-medium"
          >
            <option value="All">All Severities</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-blue-fantastic/60 border-b border-blue-fantastic/15">
              <th className="py-3 px-4 font-semibold">Log ID & Time</th>
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">Module</th>
              <th className="py-3 px-4 font-semibold text-center">Severity</th>
              <th className="py-3 px-4 font-semibold text-right">
                <span className="sr-only">Inspect</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => onViewDetails && onViewDetails(log)}
              >
                <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                  <div className="font-bold text-blue-fantastic">{log.id}</div>
                  <div className="text-[11px] text-blue-fantastic/60">
                    {log.timestamp}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-blue-fantastic">
                  <div>{log.user}</div>
                  <div className="text-[11px] font-normal text-blue-fantastic/50">
                    {log.role}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-blue-fantastic">
                  {log.action}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-blue-fantastic/15">
                    {log.module}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  {log.severity === "Info" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      Info
                    </span>
                  )}
                  {log.severity === "Warning" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Warning
                    </span>
                  )}
                  {log.severity === "Critical" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      Critical
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {onViewDetails && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(log);
                      }}
                      title="Inspect Details and IP Address"
                      className="p-1.5 rounded-md text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-blue-fantastic/50 text-xs"
                >
                  No audit logs match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
