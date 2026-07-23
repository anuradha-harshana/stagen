"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Maximize2, Calendar, Layout } from "lucide-react";

export type ZoomScale = "week" | "month" | "project";

interface ZoomToggleProps {
  currentScale: ZoomScale;
  onChange: (scale: ZoomScale) => void;
}

export default function ZoomToggle({ currentScale, onChange }: ZoomToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-fantastic/60">
        <Layout className="h-3.5 w-3.5" />
        <span>Gantt Scale:</span>
      </span>

      <div className="flex bg-palladian/45 border border-blue-fantastic/5 p-1 rounded-xl w-full sm:w-auto">
        <button
          onClick={() => onChange("week")}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 cursor-pointer",
            currentScale === "week"
              ? "bg-white text-truffle-trouble shadow-sm border border-blue-fantastic/5"
              : "text-blue-fantastic/60 hover:text-blue-fantastic"
          )}
        >
          <span>Week</span>
        </button>

        <button
          onClick={() => onChange("month")}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 cursor-pointer",
            currentScale === "month"
              ? "bg-white text-truffle-trouble shadow-sm border border-blue-fantastic/5"
              : "text-blue-fantastic/60 hover:text-blue-fantastic"
          )}
        >
          <span>Month</span>
        </button>

        <button
          onClick={() => onChange("project")}
          className={cn(
            "flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 cursor-pointer",
            currentScale === "project"
              ? "bg-white text-truffle-trouble shadow-sm border border-blue-fantastic/5"
              : "text-blue-fantastic/60 hover:text-blue-fantastic"
          )}
        >
          <Maximize2 className="h-3 w-3" />
          <span>Full Build</span>
        </button>
      </div>
    </div>
  );
}
