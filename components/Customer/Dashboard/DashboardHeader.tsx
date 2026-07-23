"use client";

import React from "react";
import { Home } from "lucide-react";
import PageHeader from "../PageHeader";

interface DashboardHeaderProps {
  username: string;
  percentage: number;
}

export default function DashboardHeader({
  username,
  percentage,
}: DashboardHeaderProps) {
  // Determine greeting based on local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

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
    <PageHeader
      icon={<Home className="h-5 w-5 text-burning-flame" />}
      title="Dashboard"
      subtitle={`${greeting}, ${username} — here is the latest update on your home.`}
      rightContent={progressPill}
    />
  );
}
