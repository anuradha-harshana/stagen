"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RegionItem {
  region: string;
  count: number;
  percentage: number;
  color: string;
}

const REGION_DATA: RegionItem[] = [
  { region: "NSW", count: 58, percentage: 40, color: "#1b2632" }, // Abyssal blue
  { region: "VIC", count: 36, percentage: 25, color: "#a35139" }, // Truffle trouble
  { region: "QLD", count: 28, percentage: 19, color: "#3b82f6" }, // Bright Blue
  { region: "WA", count: 14, percentage: 10, color: "#10b981" },  // Emerald Green
  { region: "SA", count: 9, percentage: 6, color: "#a855f7" },    // Purple
];

export function RegionChart() {
  const [activeRegion, setActiveRegion] = useState<RegionItem | null>(null);

  // Calculate SVG donut segments
  const total = REGION_DATA.reduce((acc, curr) => acc + curr.count, 0);
  let cumulativeAngle = 0;

  const segments = REGION_DATA.map((item) => {
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
      <CardHeader className="pb-2 pt-5 px-6">
        <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
          Projects by Region
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 h-56">
          {/* Custom SVG Segment Donut Chart */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {segments.map((seg) => {
                const radius = 38;
                const strokeWidth = 14;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = `${(seg.angle / 360) * circumference} ${circumference}`;
                const strokeDashoffset = -((seg.startAngle / 360) * circumference);
                const isHovered = activeRegion?.region === seg.region;

                return (
                  <circle
                    key={seg.region}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setActiveRegion(seg)}
                    onMouseLeave={() => setActiveRegion(null)}
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-extrabold text-blue-fantastic font-bebas-neue">
                {activeRegion ? activeRegion.count : total}
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-fantastic/50">
                {activeRegion ? activeRegion.region : "Total"}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2 w-full">
            {REGION_DATA.map((item) => {
              const isHovered = activeRegion?.region === item.region;

              return (
                <div
                  key={item.region}
                  onMouseEnter={() => setActiveRegion(item)}
                  onMouseLeave={() => setActiveRegion(null)}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                    isHovered ? "bg-palladian/60 font-bold" : "hover:bg-palladian/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-blue-fantastic">{item.region}</span>
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
