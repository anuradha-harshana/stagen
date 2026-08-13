"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface AtRiskProjectRow {
  id: string;
  projectName: string;
  customer: string;
  stage: string;
  delayDays: number;
  progressPercent: number;
  lastUpdate: string;
  supervisor: string;
  region: string;
  status: "Delayed" | "At Risk";
}

const MOCK_ROWS: AtRiskProjectRow[] = [
  {
    id: "P-1028",
    projectName: "Smith Residence",
    customer: "John Smith",
    stage: "Lockup",
    delayDays: 7,
    progressPercent: 62,
    lastUpdate: "May 13, 2024",
    supervisor: "John Smith",
    region: "NSW",
    status: "Delayed",
  },
  {
    id: "P-1033",
    projectName: "Johnson Residence",
    customer: "Emily Johnson",
    stage: "Fixing",
    delayDays: 5,
    progressPercent: 47,
    lastUpdate: "May 12, 2024",
    supervisor: "David Brown",
    region: "VIC",
    status: "Delayed",
  },
  {
    id: "P-1041",
    projectName: "Williams Residence",
    customer: "Michael Williams",
    stage: "Frame",
    delayDays: 4,
    progressPercent: 35,
    lastUpdate: "May 11, 2024",
    supervisor: "Michael Lee",
    region: "QLD",
    status: "At Risk",
  },
  {
    id: "P-1048",
    projectName: "Brown Residence",
    customer: "Sarah Brown",
    stage: "Slab",
    delayDays: 3,
    progressPercent: 18,
    lastUpdate: "May 10, 2024",
    supervisor: "Sarah Johnson",
    region: "WA",
    status: "At Risk",
  },
];

export function AtRiskTable() {
  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl overflow-hidden font-sans">
      <CardHeader className="pb-4 pt-5 px-6 flex flex-row items-center justify-between border-b border-blue-fantastic/15">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-truffle-trouble" />
          <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
            At-Risk / Delayed Projects
          </CardTitle>
        </div>
        <Link
          href="/company-management/at-risk"
          className="flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
        >
          View all delayed projects
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-palladian/30 text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider border-b border-blue-fantastic/15">
              <th className="py-3 px-6">Project ID</th>
              <th className="py-3 px-4">Project Name</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4">Delay</th>
              <th className="py-3 px-4">% Complete</th>
              <th className="py-3 px-4">Last Update</th>
              <th className="py-3 px-4">Supervisor</th>
              <th className="py-3 px-4">Region</th>
              <th className="py-3 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oatmeal/15 text-xs text-blue-fantastic font-medium">
            {MOCK_ROWS.map((row) => (
              <tr key={row.id} className="hover:bg-palladian/20 transition-colors">
                <td className="py-3.5 px-6 font-bold text-blue-fantastic/80">{row.id}</td>
                <td className="py-3.5 px-4 font-bold">{row.projectName}</td>
                <td className="py-3.5 px-4 text-blue-fantastic/70">{row.customer}</td>
                <td className="py-3.5 px-4 font-semibold">{row.stage}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold ${
                      row.delayDays >= 5 ? "text-red-600 font-extrabold" : "text-amber-600"
                    }`}
                  >
                    {row.delayDays} days
                  </span>
                </td>
                <td className="py-3.5 px-4">{row.progressPercent}%</td>
                <td className="py-3.5 px-4 text-blue-fantastic/60">{row.lastUpdate}</td>
                <td className="py-3.5 px-4">{row.supervisor}</td>
                <td className="py-3.5 px-4 font-bold">{row.region}</td>
                <td className="py-3.5 px-6 text-right">
                  {row.status === "Delayed" ? (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                      Delayed
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                      At Risk
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
