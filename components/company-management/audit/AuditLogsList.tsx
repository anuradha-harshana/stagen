"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: "Projects" | "Documents" | "Warranty" | "Billing" | "Users" | "Settings";
  details: string;
  ipAddress: string;
  severity: "Info" | "Warning" | "Critical";
}

interface AuditLogsListProps {
  logs: AuditLog[];
}

export function AuditLogsList({ logs }: AuditLogsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === "All" || log.module === selectedModule;
    const matchesSeverity = selectedSeverity === "All" || log.severity === selectedSeverity;
    return matchesSearch && matchesModule && matchesSeverity;
  });

  return (
    <div className="bg-palladian rounded-xl shadow-sm border border-blue-fantastic/15 overflow-hidden">
      <div className="p-6 border-b border-blue-fantastic/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base text-blue-fantastic">
            Recent System Audit Logs
          </h3>
          <p className="text-xs text-blue-fantastic/60">
            Filterable system-wide activity log for security & compliance review
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-blue-fantastic/15 rounded-lg text-blue-fantastic focus:outline-none focus:border-truffle-trouble w-60"
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
              <th className="py-3 px-6 font-semibold">Date & Time</th>
              <th className="py-3 px-6 font-semibold">User</th>
              <th className="py-3 px-6 font-semibold">Action</th>
              <th className="py-3 px-6 font-semibold">Module</th>
              <th className="py-3 px-6 font-semibold">Details</th>
              <th className="py-3 px-6 font-semibold">IP Address</th>
              <th className="py-3 px-6 font-semibold text-right">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-6 font-mono text-blue-fantastic/80 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3.5 px-6 font-semibold text-blue-fantastic">
                  <div>{log.user}</div>
                  <div className="text-[11px] font-normal text-blue-fantastic/50">{log.role}</div>
                </td>
                <td className="py-3.5 px-6 font-medium text-blue-fantastic">
                  {log.action}
                </td>
                <td className="py-3.5 px-6">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-blue-fantastic/15">
                    {log.module}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-blue-fantastic/80 max-w-xs truncate">
                  {log.details}
                </td>
                <td className="py-3.5 px-6 font-mono text-[11px] text-blue-fantastic/60">
                  {log.ipAddress}
                </td>
                <td className="py-3.5 px-6 text-right">
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
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-blue-fantastic/50 text-xs">
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
