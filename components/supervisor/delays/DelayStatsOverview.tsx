"use client";

import React from "react";
import { TimelinePageData } from "@/lib/timeline/data";
import { DelayMessage } from "./DelayStore";
import { AlertTriangle, Clock, CalendarDays, Send } from "lucide-react";

interface DelayStatsOverviewProps {
  timelineData: TimelinePageData;
  messages: DelayMessage[];
}

export function DelayStatsOverview({ timelineData, messages }: DelayStatsOverviewProps) {
  const delayLog = timelineData.delayLog || [];
  const totalDelays = delayLog.length;

  // Total calculated delay days
  const totalDays = timelineData.delayDays || totalDelays * 4;

  // Most recent delay entry
  const latestEntry = delayLog[delayLog.length - 1];

  // Message read statistics
  const sentCount = messages.length;
  const readCount = messages.filter((m) => m.status === "read").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {/* 1. Total Delays Logged */}
      <div className="bg-palladian rounded-2xl p-5 border border-blue-fantastic/10 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-fantastic/60 font-sans">
            Total Delays
          </span>
          <div className="text-2xl font-black text-blue-fantastic font-sans">
            {totalDelays} {totalDelays === 1 ? "Incident" : "Incidents"}
          </div>
          <p className="text-[11px] text-blue-fantastic/65 font-sans">
            Logged for this project
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-truffle-trouble/10 border border-truffle-trouble/20 flex items-center justify-center text-truffle-trouble shrink-0">
          <AlertTriangle className="h-6 w-6" />
        </div>
      </div>

      {/* 2. Cumulative Days Delayed */}
      <div className="bg-palladian rounded-2xl p-5 border border-blue-fantastic/10 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-fantastic/60 font-sans">
            Cumulative Delay
          </span>
          <div className="text-2xl font-black text-truffle-trouble font-sans">
            +{totalDays} Days
          </div>
          <p className="text-[11px] text-blue-fantastic/65 font-sans">
            Added to baseline schedule
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
          <Clock className="h-6 w-6" />
        </div>
      </div>

      {/* 3. Latest Delay Event */}
      <div className="bg-palladian rounded-2xl p-5 border border-blue-fantastic/10 shadow-xs flex items-center justify-between">
        <div className="space-y-1 min-w-0 flex-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-fantastic/60 font-sans">
            Latest Event
          </span>
          <div className="text-base font-extrabold text-blue-fantastic truncate font-sans">
            {latestEntry ? latestEntry.stageName + " Stage" : "No Delays"}
          </div>
          <p className="text-[11px] text-blue-fantastic/65 font-sans truncate">
            {latestEntry ? `${latestEntry.date} • ${latestEntry.title}` : "Baseline on track"}
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-burning-flame/10 border border-burning-flame/20 flex items-center justify-center text-truffle-trouble shrink-0 ml-2">
          <CalendarDays className="h-6 w-6" />
        </div>
      </div>

      {/* 4. Customer Notices Stat */}
      <div className="bg-palladian rounded-2xl p-5 border border-blue-fantastic/10 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-fantastic/60 font-sans">
            Customer Notices
          </span>
          <div className="text-2xl font-black text-blue-fantastic font-sans">
            {sentCount} Sent
          </div>
          <p className="text-[11px] text-emerald-700 font-bold font-sans">
            {readCount} read by customer
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shrink-0">
          <Send className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
