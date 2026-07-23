"use client";

import React from "react";
import Image from "next/image";
import { Home, UserCircle2 } from "lucide-react";
import PageHeader from "../PageHeader";

interface DashboardHeaderProps {
  username: string;
  email: string;
  role: string;
  percentage: number;
}

export default function DashboardHeader({
  username,
  email,
  role,
  percentage,
}: DashboardHeaderProps) {
  // Determine greeting based on local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // User identity card shown on the right side of the header
  const rightContent = (
    <div className="flex items-center gap-3 flex-wrap justify-end">
      {/* Progress pill */}
      <div className="flex items-center gap-3 rounded-2xl bg-blue-fantastic/8 border border-blue-fantastic/10 px-4 py-2 w-full sm:w-auto sm:min-w-60">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-blue-fantastic">
            <span>Overall Progress</span>
            <span className="text-truffle-trouble font-bold">{percentage}% Complete</span>
          </div>
          <div className="h-1.5 rounded-full bg-blue-fantastic/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-truffle-trouble transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* User identity card */}
      <div className="flex items-center gap-2.5 rounded-2xl bg-white/60 border border-blue-fantastic/10 shadow-sm px-3 py-2 shrink-0">
        <div className="relative">
          <Image
            src="/images/user.jpg"
            width={36}
            height={36}
            alt={username}
            className="rounded-full object-cover ring-2 ring-truffle-trouble/30"
          />
          {/* online dot */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-bold text-blue-fantastic capitalize">{username}</p>
          <p className="text-[11px] text-blue-fantastic/50 truncate max-w-[130px]">{email}</p>
        </div>
        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-truffle-trouble/10 border border-truffle-trouble/20 px-2 py-0.5 text-[10px] font-semibold text-truffle-trouble uppercase tracking-wider">
          <UserCircle2 className="h-3 w-3" />
          {role}
        </span>
      </div>
    </div>
  );

  return (
    <PageHeader
      icon={<Home className="h-5 w-5 text-burning-flame" />}
      title="Dashboard"
      subtitle={`${greeting}, ${username} — here is the latest update on your home.`}
      rightContent={rightContent}
    />
  );
}
