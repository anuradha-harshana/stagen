"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusItem {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

const STATUS_DATA: StatusItem[] = [
  { status: "Active", count: 84, percentage: 58, color: "#1b2632" },    // Abyssal blue
  { status: "Completed", count: 36, percentage: 25, color: "#10b981" }, // Emerald green
  { status: "Delayed", count: 15, percentage: 10, color: "#e11d48" },   // Rose / Red
  { status: "On Hold", count: 10, percentage: 7, color: "#94a3b8" },    // Slate gray
];

export function StatusChart() {
  const [activeItem, setActiveItem] = useState<StatusItem | null>(null);

  const total = STATUS_DATA.reduce((acc, curr) => acc + curr.count, 0);
  let cumulativeAngle = 0;

  const segments = STATUS_DATA.map((item) => {
    const angle = (item.count / total) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    return {
      ...item,
      startAngle,
      angle,
    };
  });

  return (
    <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl overflow-hidden font-cream">
      <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
          Projects by Status
        </CardTitle>
        <Link
          href="/company-management/projects"
          className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 h-56">
          {/* Custom SVG Donut Chart */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {segments.map((seg) => {
                const radius = 38;
                const strokeWidth = 14;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = `${(seg.angle / 360) * circumference} ${circumference}`;
                const strokeDashoffset = -((seg.startAngle / 360) * circumference);
                const isHovered = activeItem?.status === seg.status;

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
                    onMouseEnter={() => setActiveItem(seg)}
                    onMouseLeave={() => setActiveItem(null)}
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-black text-blue-fantastic font-bebas-neue tracking-tight">
                {activeItem ? activeItem.count : total}
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-fantastic/50">
                {activeItem ? activeItem.status : "Total"}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2.5 w-full">
            {STATUS_DATA.map((item) => {
              const isHovered = activeItem?.status === item.status;

              return (
                <div
                  key={item.status}
                  onMouseEnter={() => setActiveItem(item)}
                  onMouseLeave={() => setActiveItem(null)}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                    isHovered ? "bg-palladian/60 font-bold" : "hover:bg-palladian/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-blue-fantastic">{item.status}</span>
                    <span className="text-blue-fantastic/60 font-medium">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
