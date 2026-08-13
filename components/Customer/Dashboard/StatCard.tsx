"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  badgeText?: string;
  badgeColorClass?: string;
  subtext?: string;
  bottomLabel?: string;
  bottomValue?: string;
  bottomLabel2?: string;
  bottomValue2?: string;
  icon?: React.ReactNode;
  iconBgClass?: string;
  progress?: number;
  className?: string;
}

export default function StatCard({
  title,
  value,
  badgeText,
  badgeColorClass,
  subtext,
  bottomLabel,
  bottomValue,
  bottomLabel2,
  bottomValue2,
  icon,
  iconBgClass,
  progress,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden group",
        className
      )}
    >
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        {/* Top Header Row */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              {title}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
                {value}
              </h2>
              {badgeText && (
                <span
                  className={cn(
                    "text-xs px-2.5 py-0.5 rounded-full font-bold border",
                    badgeColorClass || "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/20"
                  )}
                >
                  {badgeText}
                </span>
              )}
              {subtext && (
                <span className="text-sm text-blue-fantastic/50 font-semibold font-sans">
                  {subtext}
                </span>
              )}
            </div>
          </div>

          {/* Icon Container with Glow */}
          {icon && (
            <div
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-hover:rotate-6",
                iconBgClass || "bg-palladian/30 text-blue-fantastic"
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Progress Bar (Optional) */}
        {progress !== undefined && (
          <div className="w-full my-4">
            <div className="h-3 w-full bg-palladian/55 rounded-full overflow-hidden p-[2px] border border-blue-fantastic/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-burning-flame to-truffle-trouble transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom Details Row */}
        <div className={cn(
          "flex justify-between items-center text-xs border-t border-blue-fantastic/5 pt-3.5 mt-2",
          progress !== undefined ? "mt-2" : "mt-auto"
        )}>
          {bottomLabel && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-blue-fantastic/45 font-medium">{bottomLabel}:</span>
              <span className="text-blue-fantastic/80 font-bold font-sans">{bottomValue}</span>
            </div>
          )}
          {bottomLabel2 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-right">
              <span className="text-blue-fantastic/45 font-medium">{bottomLabel2}:</span>
              <span className="text-blue-fantastic/70 font-semibold">{bottomValue2}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
