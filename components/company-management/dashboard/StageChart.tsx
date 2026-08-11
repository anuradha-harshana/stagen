"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StageData {
  stage: string;
  count: number;
}

const STAGE_DATA: StageData[] = [
  { stage: "Site Cut", count: 12 },
  { stage: "Slab", count: 18 },
  { stage: "Frame", count: 24 },
  { stage: "Lockup", count: 26 },
  { stage: "Fixing", count: 22 },
  { stage: "Comp.", count: 28 },
  { stage: "Handover", count: 15 },
];

export function StageChart() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const maxCount = Math.max(...STAGE_DATA.map((d) => d.count));

  return (
    <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl overflow-hidden font-cream">
      <CardHeader className="pb-2 pt-5 px-6">
        <CardTitle className="text-base font-bold text-blue-fantastic font-sans">
          Projects by Stage
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-oatmeal/20">
          {STAGE_DATA.map((item) => {
            const isHovered = hoveredStage === item.stage;
            const heightPercent = (item.count / maxCount) * 100;

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
                    isHovered ? "text-truffle-trouble scale-110 font-extrabold" : "text-blue-fantastic/70"
                  }`}
                >
                  {item.count}
                </span>

                {/* Bar */}
                <div className="w-full bg-blue-fantastic/10 rounded-t-lg h-40 flex items-end overflow-hidden p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      item.stage === "Comp."
                        ? isHovered
                          ? "bg-truffle-trouble shadow-md"
                          : "bg-truffle-trouble/90"
                        : isHovered
                        ? "bg-blue-fantastic shadow-md"
                        : "bg-blue-fantastic/85"
                    }`}
                  />
                </div>

                {/* Stage Label */}
                <span
                  className={`text-[11px] font-medium text-center truncate max-w-full transition-colors ${
                    isHovered ? "text-blue-fantastic font-bold" : "text-blue-fantastic/60"
                  }`}
                >
                  {item.stage}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
