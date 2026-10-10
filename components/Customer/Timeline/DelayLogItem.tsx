"use client";

import React from "react";
import { DelayLogEntry } from "@/lib/timeline/data";
import { cn } from "@/lib/utils";
import { CloudRain, Wrench, FileCheck, Users, Package, ArrowRight, HelpCircle } from "lucide-react";

interface DelayLogItemProps {
  entry: DelayLogEntry;
}

export default function DelayLogItem({ entry }: DelayLogItemProps) {
  // Select icon and colors based on change type
  let icon = <HelpCircle className="h-4.5 w-4.5" />;
  let colorClass = "bg-blue-fantastic/10 text-blue-fantastic";
  let borderClass = "border-blue-fantastic/5";

  switch (entry.type) {
    case "weather":
      icon = <CloudRain className="h-4.5 w-4.5" />;
      colorClass = "bg-sky-50 text-sky-700 border-sky-200";
      borderClass = "border-sky-100 hover:border-sky-200";
      break;
    case "machinery":
      icon = <Wrench className="h-4.5 w-4.5" />;
      colorClass = "bg-amber-50 text-amber-700 border-amber-200";
      borderClass = "border-amber-100 hover:border-amber-200";
      break;
    case "permits":
      icon = <FileCheck className="h-4.5 w-4.5" />;
      colorClass = "bg-purple-50 text-purple-700 border-purple-200";
      borderClass = "border-purple-100 hover:border-purple-200";
      break;
    case "labor":
      icon = <Users className="h-4.5 w-4.5" />;
      colorClass = "bg-teal-50 text-teal-700 border-teal-200";
      borderClass = "border-teal-100 hover:border-teal-200";
      break;
    case "materials":
      icon = <Package className="h-4.5 w-4.5" />;
      colorClass = "bg-burning-flame/10 text-truffle-trouble border-burning-flame/20";
      borderClass = "border-burning-flame/10 hover:border-burning-flame/30";
      break;
  }

  // Format log entry date
  const formatLogDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className={cn(
        "bg-white border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-[0_4px_15px_rgba(27,38,50,0.03)]",
        borderClass
      )}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Left Icon Badge */}
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border", colorClass)}>
          {icon}
        </div>

        {/* Mid text contents */}
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-truffle-trouble">
              {entry.stageName} Stage
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-fantastic/10" />
            <span className="text-xs text-blue-fantastic/45 font-semibold">
              Logged: {formatLogDate(entry.date)}
            </span>
          </div>
          
          <h4 className="text-sm font-extrabold text-blue-fantastic">
            {entry.title}
          </h4>
          
          <p className="text-xs text-blue-fantastic/70 leading-relaxed font-medium">
            {entry.reason}
          </p>
        </div>
      </div>

      {/* Date Shift Details (Right Panel) */}
      <div className="bg-surface-inset border border-blue-fantastic/5 px-4 py-3 rounded-xl shrink-0 w-full md:w-auto flex flex-col items-center justify-center gap-1">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-fantastic/45 block text-center">
          Schedule Impact
        </span>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-fantastic">
          <span className="text-blue-fantastic/55 line-through">{entry.fromDate}</span>
          <ArrowRight className="h-3.5 w-3.5 text-truffle-trouble" />
          <span className="text-truffle-trouble font-extrabold">{entry.toDate}</span>
        </div>
      </div>
    </div>
  );
}
