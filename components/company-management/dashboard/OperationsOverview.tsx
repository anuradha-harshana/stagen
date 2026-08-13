"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Calendar, Clock, ArrowUpRight } from "lucide-react";

interface DefectStatusItem {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

const DEFECT_STATUS_DATA: DefectStatusItem[] = [
  { status: "Open", count: 52, percentage: 41, color: "#1b2632" },       // Abyssal Navy
  { status: "In Progress", count: 38, percentage: 30, color: "#f97316" },// Orange
  { status: "Scheduled", count: 18, percentage: 14, color: "#3b82f6" },  // Blue
  { status: "Resolved", count: 20, percentage: 15, color: "#10b981" },   // Emerald Green
];

export function OperationsOverview() {
  const [activeDefect, setActiveDefect] = useState<DefectStatusItem | null>(null);

  const totalDefects = DEFECT_STATUS_DATA.reduce((acc, curr) => acc + curr.count, 0);
  let cumulativeAngle = 0;

  const segments = DEFECT_STATUS_DATA.map((item) => {
    const angle = (item.count / totalDefects) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    return {
      ...item,
      startAngle,
      angle,
    };
  });

  return (
    <div className="space-y-6 font-sans pt-8 border-t border-blue-fantastic/15">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-blue-fantastic font-sans">
            Operations Overview
          </h2>
          <p className="text-xs text-blue-fantastic/60 font-medium">
            Supervisor workload and warranty management metrics
          </p>
        </div>
      </div>

      {/* Top Grid (Supervisor Workload + Warranty Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supervisor Workload Card */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-blue-fantastic font-sans">
              Supervisor Workload
            </h3>
            <Link
              href="/company-management/supervisors"
              className="text-xs font-bold text-truffle-trouble hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3.5">
            {[
              { initials: "JS", name: "John Smith", count: "15 Projects", pct: 75, bg: "bg-blue-500" },
              { initials: "DB", name: "David Brown", count: "12 Projects", pct: 60, bg: "bg-purple-500" },
              { initials: "ML", name: "Michael Lee", count: "10 Projects", pct: 50, bg: "bg-emerald-500" },
              { initials: "SJ", name: "Sarah Johnson", count: "8 Projects", pct: 43, bg: "bg-amber-500" },
              { initials: "JW", name: "James Wilson", count: "6 Projects", pct: 33, bg: "bg-red-500" },
            ].map((sup) => (
              <div key={sup.name} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full ${sup.bg} text-white font-bold text-[11px] flex items-center justify-center shrink-0`}>
                  {sup.initials}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-fantastic">
                    <span>{sup.name}</span>
                    <span className="text-[11px] text-blue-fantastic/50 font-medium">{sup.count}</span>
                  </div>
                  <div className="w-full bg-oatmeal/20 rounded-full h-2 overflow-hidden">
                    <div style={{ width: `${sup.pct}%` }} className="bg-truffle-trouble h-full rounded-full" />
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-fantastic/70 w-8 text-right">{sup.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Warranty / Defect Overview Donut */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-6">
          <h3 className="text-sm font-bold text-blue-fantastic font-sans mb-4">
            Warranty / Defect Overview
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 h-56">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {segments.map((seg) => {
                  const radius = 38;
                  const strokeWidth = 14;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = `${(seg.angle / 360) * circumference} ${circumference}`;
                  const strokeDashoffset = -((seg.startAngle / 360) * circumference);
                  const isHovered = activeDefect?.status === seg.status;

                  return (
                    <circle
                      key={seg.status}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setActiveDefect(seg)}
                      onMouseLeave={() => setActiveDefect(null)}
                    />
                  );
                })}
              </svg>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-black text-blue-fantastic font-bebas-neue">
                  {activeDefect ? activeDefect.count : totalDefects}
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-fantastic/50">
                  {activeDefect ? activeDefect.status : "Total Issues"}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              {DEFECT_STATUS_DATA.map((item) => (
                <div
                  key={item.status}
                  onMouseEnter={() => setActiveDefect(item)}
                  onMouseLeave={() => setActiveDefect(null)}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-palladian/40 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-blue-fantastic">{item.status}</span>
                  </div>
                  <span className="text-blue-fantastic/70 font-semibold">{item.count} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Grid (Average Resolution Time + Maintenance + Defect Status Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Resolution Time */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
              Average Resolution Time
            </span>
            <div className="text-3xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight mt-1">
              12.4 <span className="text-base font-normal text-blue-fantastic/60 font-sans">days</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
              ↑ 3% <span className="text-blue-fantastic/40 font-normal">vs last month</span>
            </span>
          </div>

          {/* Sparkline curve */}
          <div className="h-16 pt-4">
            <svg viewBox="0 0 200 50" className="w-full h-full overflow-visible">
              <path
                d="M 0,35 Q 30,40 60,30 T 120,25 T 160,15 T 200,10"
                fill="none"
                stroke="#a35139"
                strokeWidth="3"
              />
            </svg>
          </div>
        </Card>

        {/* Upcoming Maintenance */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-blue-fantastic uppercase tracking-wider mb-3">
              Upcoming Maintenance
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { id: "P-1008", date: "May 20, 2024" },
                { id: "P-1012", date: "May 22, 2024" },
                { id: "P-1020", date: "May 25, 2024" },
              ].map((m) => (
                <div key={m.id} className="flex items-center justify-between border-b border-blue-fantastic/15 pb-2">
                  <span className="font-bold text-blue-fantastic">{m.id}</span>
                  <span className="text-blue-fantastic/60 font-medium">{m.date}</span>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/company-management/warranty"
            className="text-xs font-bold text-truffle-trouble hover:underline inline-flex items-center gap-1 mt-3"
          >
            View all →
          </Link>
        </Card>

        {/* Defect Status Summary */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-bold text-blue-fantastic uppercase tracking-wider">
            Defect Status Summary
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { label: "Open", count: 52, color: "bg-red-500" },
              { label: "In Progress", count: 38, color: "bg-truffle-trouble" },
              { label: "Scheduled", count: 18, color: "bg-blue-500" },
              { label: "Resolved", count: 20, color: "bg-emerald-500" },
            ].map((d) => (
              <div key={d.label} className="space-y-1">
                <div className="flex justify-between text-blue-fantastic font-semibold">
                  <span>{d.label}</span>
                  <span className="font-bold">{d.count}</span>
                </div>
                <div className="w-full bg-oatmeal/20 rounded-full h-2 overflow-hidden">
                  <div style={{ width: `${(d.count / 60) * 100}%` }} className={`${d.color} h-full rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
