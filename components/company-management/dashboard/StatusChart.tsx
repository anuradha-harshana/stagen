"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBreakdownItem } from "@/lib/company-management/dashboardData";

interface StatusChartProps {
  data: StatusBreakdownItem[];
}

export function StatusChart({ data }: StatusChartProps) {
  const [activeItem, setActiveItem] = useState<StatusBreakdownItem | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  let cumulativeAngle = 0;

  const segments = data.map((item) => {
    const angle = total > 0 ? (item.count / total) * 360 : 0;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    return {
      ...item,
      startAngle,
      angle,
    };
  });

  return (
    <Card className="bg-white border border-blue-fantastic/10 hover:border-blue-fantastic/20 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden font-sans transition-all duration-300">
      <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
          Projects by Status
        </CardTitle>
        <Link
          href="/company-management/projects"
          className="text-xs font-bold text-truffle-trouble hover:underline transition-colors"
        >
          View all projects
        </Link>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 h-56">
          {/* Custom SVG Donut Chart */}
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {segments.map((seg) => {
                const radius = 38;
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
                    strokeWidth={isHovered ? 16 : 12}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setActiveItem(seg)}
                    onMouseLeave={() => setActiveItem(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-extrabold text-blue-fantastic font-sans leading-none">
                {activeItem ? activeItem.count : total}
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-fantastic/50 tracking-wider mt-0.5">
                {activeItem ? activeItem.status : "Projects"}
              </span>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="flex-1 w-full flex flex-col justify-center space-y-2.5">
            {data.map((item) => {
              const isHovered = activeItem?.status === item.status;

              return (
                <div
                  key={item.status}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                    isHovered
                      ? "bg-surface-inset shadow-xs scale-[1.01]"
                      : "hover:bg-surface-inset/60"
                  }`}
                  onMouseEnter={() => setActiveItem(item)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        isHovered ? "text-blue-fantastic font-bold" : "text-blue-fantastic/80"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-fantastic">
                      {item.count}
                    </span>
                    <span className="text-[11px] font-medium text-blue-fantastic/50 w-8 text-right">
                      {item.percentage}%
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
