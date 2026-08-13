"use client";

import React from "react";
import { Calendar, Hourglass, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "../PageHeader";
import { cn } from "@/lib/utils";

interface ProgressHeaderProps {
  percentage: number;
  statusLabel: string;
  currentStageName: string;
  estimatedCompletion: string;
  daysRemaining: number;
  startedDate: string;
}

export default function ProgressHeader({
  percentage,
  statusLabel,
  currentStageName,
  estimatedCompletion,
  daysRemaining,
  startedDate,
}: ProgressHeaderProps) {
  // SVG Circle calculations
  const radius = 48;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Build the flexible right side progress bar pill
  const progressPill = (
    <div className="flex items-center gap-3 rounded-2xl bg-blue-fantastic/8 border border-blue-fantastic/10 px-4 py-2 w-full sm:w-72">
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-blue-fantastic">
          <span>Overall Progress</span>
          <span className="text-truffle-trouble font-bold">{percentage}% Complete</span>
        </div>
        <div className="h-1.5 rounded-full bg-blue-fantastic/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-truffle-trouble"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Reusable PageHeader Component */}
      <PageHeader
        icon={<TrendingUp className="h-5 w-5 text-burning-flame" />}
        title="Progress"
        subtitle="Detailed milestone tracking, site updates, and photos"
        rightContent={progressPill}
      />

      {/* Stats Cards Row (Body Content below Header - kept exactly identical) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Circular Progress Gauge */}
        <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden md:col-span-1">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-full bg-truffle-trouble/5 blur-md" />
              
              {/* SVG Gauge */}
              <svg className="w-full h-full transform -rotate-90 relative z-10">
                <defs>
                  <linearGradient id="header-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--burning-flame)" />
                    <stop offset="100%" stopColor="var(--truffle-trouble)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-palladian/60"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke="url(#header-progress-gradient)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Inside Text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-blue-fantastic font-bebas-neue leading-none">
                  {percentage}%
                </span>
                <span className="text-[9px] font-bold text-blue-fantastic/45 uppercase tracking-wide mt-0.5">
                  Done
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-fantastic/50 block">
                Overall Progress
              </span>
              <h2 className="text-xl font-extrabold text-blue-fantastic font-sans leading-tight">
                {statusLabel}
              </h2>
              <p className="text-xs text-blue-fantastic/65 font-medium">
                Current Phase: <strong className="text-truffle-trouble">{currentStageName}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Estimated Completion */}
        <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-fantastic/50 block">
                  Target Finish
                </span>
                <h2 className="text-2xl font-extrabold text-blue-fantastic font-sans tracking-tight">
                  {percentage === 100 ? "Completed ✓" : estimatedCompletion}
                </h2>
              </div>
              <div className="h-10 w-10 rounded-xl bg-truffle-trouble/10 flex items-center justify-center text-truffle-trouble">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-blue-fantastic/5 pt-3.5 mt-4">
              <span className="text-blue-fantastic/45 font-medium">Started Date:</span>
              <span className="text-blue-fantastic/80 font-bold font-sans">{startedDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Days Remaining */}
        <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-fantastic/50 block">
                  Time Remaining
                </span>
                <h2 className="text-2xl font-extrabold text-blue-fantastic font-sans tracking-tight">
                  {percentage === 100 ? (
                    <span className="text-emerald-600">0 days</span>
                  ) : percentage === 0 ? (
                    <span>-- days</span>
                  ) : (
                    <span>{daysRemaining} days</span>
                  )}
                </h2>
              </div>
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                percentage === 100 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                  : "bg-burning-flame/10 text-burning-flame"
              )}>
                {percentage === 100 ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Hourglass className="h-5 w-5" />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-blue-fantastic/5 pt-3.5 mt-4">
              <span className="text-blue-fantastic/45 font-medium">Build status:</span>
              <span className={cn(
                "font-bold uppercase tracking-wider text-[10px]",
                percentage === 100 && "text-emerald-600",
                percentage === 0 && "text-blue-fantastic/45",
                percentage > 0 && percentage < 100 && "text-burning-flame"
              )}>
                {percentage === 100 ? "Ready for occupancy" : percentage === 0 ? "Pending commencement" : "Active construction"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
