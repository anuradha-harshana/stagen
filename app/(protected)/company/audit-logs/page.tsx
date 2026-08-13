"use client";

import React, { useState } from "react";
import { 
  ScrollText, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Download, 
  Filter, 
  Eye, 
  AlertTriangle, 
  Info, 
  Clock, 
  CheckCircle2, 
  Lock,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MOCK_AUDIT_LOGS, AuditLogItem } from "@/lib/db-mock/companyData";
import PageHeader from "@/components/Customer/PageHeader";

export default function CompanyAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || log.category === categoryFilter;
    const matchesSeverity = severityFilter === "All" || log.severity === severityFilter;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-xl shadow-lg border border-burning-flame/30 flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-burning-flame" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        icon={<ScrollText className="h-5 w-5 text-burning-flame" />}
        title="Audit Logs & Compliance Trails"
        subtitle="Immutable security audit history, user access records, and tenant configuration updates"
        rightContent={
          <Button
            onClick={() => showNotification("Exporting Audit Trail CSV Report...")}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-9 rounded-xl shadow-sm"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export Audit Report
          </Button>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <ScrollText className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Total Audit Records</p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">1,280 Entries</h3>
              <p className="text-[10px] text-blue-fantastic/50">Stored in encrypted log vault</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-truffle-trouble/15 border border-truffle-trouble/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">User Sessions Today</p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">18 Active Sessions</h3>
              <p className="text-[10px] text-blue-fantastic/50">All staff authenticated via 2FA</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Flagged Incidents</p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">1 Flagged Event</h3>
              <p className="text-[10px] text-blue-fantastic/50">Failed login threshold hit</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <Lock className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Retention Policy</p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">365 Days</h3>
              <p className="text-[10px] text-blue-fantastic/50">Compliant with AU Construction standards</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Audit Log Table Card */}
      <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
        <CardHeader className="pb-4 border-b border-blue-fantastic/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-blue-fantastic">
              System & User Audit Trail
            </CardTitle>
            <CardDescription className="text-xs text-blue-fantastic/60 mt-0.5">
              Filter by event category, IP address, severity level, or user action
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
              <Input
                placeholder="Search user, action, IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-8 text-xs font-sans w-52 focus-visible:ring-truffle-trouble"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-palladian border border-blue-fantastic/15 text-xs font-bold text-blue-fantastic rounded-lg h-8 px-2 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Category Filter Pills */}
            <div className="flex gap-1 bg-blue-fantastic/8 p-0.5 rounded-xl border border-blue-fantastic/10">
              {["All", "Security", "Project Update", "Document Access", "Settings", "User Management"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    categoryFilter === cat
                      ? "bg-blue-fantastic text-palladian shadow-sm"
                      : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-fantastic/5 border-b border-blue-fantastic/10 text-blue-fantastic/70 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User / Operator</th>
                  <th className="py-3 px-4">Action Performed</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">IP & Location</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-fantastic/10">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-blue-fantastic/50">
                      No audit logs match your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-fantastic/3 transition-colors">
                      <td className="py-3 px-4 text-blue-fantastic/70 font-mono text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-blue-fantastic flex items-center justify-center text-palladian font-bold text-[10px] uppercase">
                            {log.user.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-blue-fantastic text-xs">{log.user.name}</p>
                            <p className="text-[10px] text-blue-fantastic/50">{log.user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-fantastic">
                        {log.action}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] bg-blue-fantastic/5 border-blue-fantastic/15 text-blue-fantastic">
                          {log.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-blue-fantastic/80 font-medium max-w-xs truncate">
                        {log.resource}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-mono text-[11px] text-blue-fantastic">{log.ipAddress}</p>
                        <p className="text-[10px] text-blue-fantastic/50">{log.location}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 border font-bold ${
                            log.severity === "Info"
                              ? "bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/30"
                              : log.severity === "Warning"
                              ? "bg-burning-flame/20 text-truffle-trouble border-burning-flame/40"
                              : "bg-truffle-trouble text-palladian border-truffle-trouble shadow-sm"
                          }`}
                        >
                          {log.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedLog(log)}
                          className="h-7 text-xs text-truffle-trouble hover:bg-truffle-trouble/10 font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={selectedLog !== null} onOpenChange={(open) => !open && setSelectedLog(null)}>
        {selectedLog && (
          <DialogContent className="max-w-xl bg-palladian text-blue-fantastic font-cream border border-blue-fantastic/20">
            <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className={`text-[10px] px-2 py-0.5 border font-bold ${
                    selectedLog.severity === "Info"
                      ? "bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/30"
                      : selectedLog.severity === "Warning"
                      ? "bg-burning-flame/20 text-truffle-trouble border-burning-flame/40"
                      : "bg-truffle-trouble text-palladian border-truffle-trouble"
                  }`}
                >
                  {selectedLog.severity} Event
                </Badge>
                <span className="text-xs text-blue-fantastic/60 font-mono">{selectedLog.id}</span>
              </div>
              <DialogTitle className="text-xl font-bold text-blue-fantastic">
                {selectedLog.action}
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-fantastic/60 font-medium">
                Target: {selectedLog.resource}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="grid grid-cols-2 gap-3 text-xs bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10">
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">Timestamp</span>
                  <span className="font-mono text-blue-fantastic font-semibold">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">User & Role</span>
                  <span className="text-blue-fantastic font-semibold">{selectedLog.user.name} ({selectedLog.user.role})</span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">IP Address</span>
                  <span className="font-mono text-blue-fantastic font-semibold">{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">Location</span>
                  <span className="text-blue-fantastic font-semibold">{selectedLog.location}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-blue-fantastic/80 uppercase tracking-wider mb-2">
                  Event Metadata & Diff Payload
                </h4>
                <pre className="bg-blue-fantastic text-palladian p-3 rounded-xl text-xs font-mono overflow-x-auto border border-blue-fantastic/30">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end border-t border-blue-fantastic/10 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedLog(null)}
                className="text-xs font-semibold border-blue-fantastic/20 text-blue-fantastic"
              >
                Close Inspector
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
