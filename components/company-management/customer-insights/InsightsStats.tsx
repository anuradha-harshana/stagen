"use client";

import React from "react";
import { MessageSquare, Cpu, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InsightsStatsProps {
  totalQueries: number;
  pendingCount: number;
}

export default function InsightsStats({
  totalQueries,
  pendingCount,
}: InsightsStatsProps) {
  const csat = 4.8;
  const aiRate = 75;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-sans">
      {/* Total Queries Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Total Queries
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {totalQueries}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">
              {pendingCount} queries awaiting supervisor response
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-fantastic/10 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
            <MessageSquare className="h-6 w-6 text-blue-fantastic" />
          </div>
        </CardContent>
      </Card>

      {/* AI Resolution Rate Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              AI Resolution Rate
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {aiRate}%
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">
              Resolved automatically by the AI model
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:rotate-6 transition-all duration-300">
            <Cpu className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Customer Satisfaction Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Customer Satisfaction
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {csat} <span className="text-base text-blue-fantastic/40">/ 5.0</span>
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">
              Average CSAT rating of AI resolutions
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-burning-flame/15 text-truffle-trouble group-hover:rotate-6 transition-all duration-300">
            <Smile className="h-6 w-6 text-truffle-trouble" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
