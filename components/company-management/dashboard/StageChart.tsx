"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StageBreakdownItem } from "@/lib/company-management/dashboardData";

interface StageChartProps {
  data: StageBreakdownItem[];
}

export function StageChart({ data }: StageChartProps) {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <Card className="bg-white border border-blue-fantastic/10 hover:border-blue-fantastic/20 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden font-sans transition-all duration-300">
      <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
          Projects by Stage
        </CardTitle>
        <span className="text-xs font-semibold text-blue-fantastic/50">
          7 Construction Phases
        </span>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="h-56 flex items-end justify-between gap-2.5 pt-6 pb-2 border-b border-blue-fantastic/10">
          {data.map((item) => {
            const isHovered = hoveredStage === item.stage;
            const heightPercent = item.count > 0 ? (item.count / maxCount) * 100 : 4;

            return (
              <div
                key={item.stage}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setHoveredStage(item.stage)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                {/* Count Badge on top */}
                <span
                  className={`text-xs font-bold transition-all duration-200 ${
                    isHovered
                      ? "text-truffle-trouble scale-110 font-extrabold"
                      : item.count > 0
                      ? "text-blue-fantastic font-bold"
                      : "text-blue-fantastic/40"
                  }`}
                >
                  {item.count}
                </span>

                {/* Bar Container */}
                <div className="w-full bg-blue-fantastic/5 rounded-t-lg h-40 flex items-end overflow-hidden p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      item.count === 0
                        ? "bg-blue-fantastic/10"
                        : isHovered
                        ? "bg-truffle-trouble shadow-md"
                        : "bg-blue-fantastic"
                    }`}
                  />
                </div>

                {/* Stage Label */}
                <span
                  className={`text-[11px] font-medium text-center truncate max-w-full transition-colors ${
                    isHovered
                      ? "text-blue-fantastic font-bold"
                      : "text-blue-fantastic/70"
                  }`}
                  title={item.stage}
                >
                  {item.stage === "Completion" ? "Comp." : item.stage}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
