"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowUpRight, TrendingUp, HelpCircle } from "lucide-react";

export function AiInsightsSection() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const dates = ["May 8", "May 9", "May 10", "May 11", "May 12", "May 13", "May 14"];
  const askedPoints = [120, 190, 140, 260, 230, 280, 270];
  const answeredPoints = [60, 100, 75, 160, 140, 185, 175];

  const maxVal = 300;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-blue-fantastic/15 pt-8">
        <div>
          <h2 className="text-xl font-bold text-blue-fantastic font-sans">
            Communication & AI Insights
          </h2>
          <p className="text-xs text-blue-fantastic/60 font-medium">
            Customer communication and AI assistant performance metrics
          </p>
        </div>
      </div>

      {/* KPI Cards Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Questions */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
            Total Questions
          </span>
          <div className="text-3xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight mt-1">
            1,248
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
            ↑ 18% <span className="text-blue-fantastic/40 font-normal">vs last month</span>
          </span>
        </Card>

        {/* Answered */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
            Answered
          </span>
          <div className="text-3xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight mt-1">
            1,062
          </div>
          <span className="text-xs font-bold text-blue-fantastic/70 mt-1 block">
            85% resolution rate
          </span>
        </Card>

        {/* Pending */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
            Pending
          </span>
          <div className="text-3xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight mt-1">
            186
          </div>
          <span className="text-xs font-bold text-amber-600 mt-1 block">
            15% awaiting reply
          </span>
        </Card>

        {/* Avg. Response Time */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50">
            Avg. Response Time
          </span>
          <div className="text-3xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight mt-1">
            2h 34m
          </div>
          <span className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
            ↑ 12% <span className="text-blue-fantastic/40 font-normal">vs last month</span>
          </span>
        </Card>
      </div>

      {/* Customer Questions Over Time (Line Chart) */}
      <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-bold text-blue-fantastic font-sans">
            Customer Questions Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-56 relative w-full pt-4">
            <svg viewBox="0 0 700 180" className="w-full h-44 overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="0" y1="20" x2="700" y2="20" stroke="#c9c1b1" strokeOpacity="0.2" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="700" y2="80" stroke="#c9c1b1" strokeOpacity="0.2" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#c9c1b1" strokeOpacity="0.2" strokeDasharray="4 4" />

              {/* Asked Line (Dark Blue) */}
              <polyline
                fill="none"
                stroke="#1b2632"
                strokeWidth="3"
                points="0,110 116,70 233,100 350,25 466,45 583,15 700,20"
              />

              {/* Answered Line (Truffle Red) */}
              <polyline
                fill="none"
                stroke="#a35139"
                strokeWidth="3"
                points="0,140 116,115 233,135 350,75 466,95 583,50 700,55"
              />

              {/* Data points */}
              {dates.map((d, i) => {
                const cx = (i / (dates.length - 1)) * 700;
                const cyAsked = 160 - (askedPoints[i] / maxVal) * 140;
                const cyAnswered = 160 - (answeredPoints[i] / maxVal) * 140;
                const isHovered = hoveredPoint === i;

                return (
                  <g key={d} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle cx={cx} cy={cyAsked} r={isHovered ? 6 : 4} fill="#1b2632" className="cursor-pointer transition-all" />
                    <circle cx={cx} cy={cyAnswered} r={isHovered ? 6 : 4} fill="#a35139" className="cursor-pointer transition-all" />
                  </g>
                );
              })}
            </svg>

            {/* Date Labels below chart */}
            <div className="flex justify-between text-[11px] text-blue-fantastic/50 font-semibold px-2 mt-2">
              {dates.map((date) => (
                <span key={date}>{date}</span>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-2 border-t border-blue-fantastic/15 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1b2632]" />
                <span className="text-blue-fantastic">Asked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#a35139]" />
                <span className="text-blue-fantastic">Answered</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top FAQ Topics & AI Assistant Insights (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top FAQ Topics */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-blue-fantastic font-sans mb-4">
              Top FAQ Topics
            </h3>
            <div className="space-y-3">
              {[
                { topic: "Construction Stages", count: 312 },
                { topic: "Delays & Timeframes", count: 241 },
                { topic: "Payments & Invoices", count: 190 },
                { topic: "Variations", count: 156 },
                { topic: "PCI Process", count: 134 },
              ].map((item) => (
                <div key={item.topic} className="flex items-center justify-between text-xs py-1 border-b border-blue-fantastic/15">
                  <span className="font-semibold text-blue-fantastic">{item.topic}</span>
                  <span className="font-extrabold text-blue-fantastic/80 font-bebas-neue text-sm">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/company-management/ai-trends"
            className="text-xs font-bold text-truffle-trouble hover:underline inline-flex items-center gap-1 mt-4"
          >
            View all FAQs →
          </Link>
        </Card>

        {/* AI Assistant Insights */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-blue-fantastic font-sans">
            AI Assistant Insights
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-fantastic block">AI Conversations</span>
                <span className="text-emerald-600 text-[11px] font-bold">↑ 12% vs last month</span>
              </div>
              <span className="text-xl font-extrabold text-blue-fantastic font-bebas-neue">842</span>
            </div>

            <div className="flex items-center justify-between border-t border-blue-fantastic/15 pt-2">
              <div>
                <span className="font-bold text-blue-fantastic block">Resolution Rate</span>
                <span className="text-emerald-600 text-[11px] font-bold">↑ 5% vs last month</span>
              </div>
              <span className="text-xl font-extrabold text-blue-fantastic font-bebas-neue">72%</span>
            </div>

            <div className="flex items-center justify-between border-t border-blue-fantastic/15 pt-2">
              <div>
                <span className="font-bold text-blue-fantastic block">Satisfaction Rate</span>
                <span className="text-emerald-600 text-[11px] font-bold">+ 0.2 rating</span>
              </div>
              <span className="text-xl font-extrabold text-blue-fantastic font-bebas-neue">4.6 / 5</span>
            </div>

            <div className="border-t border-blue-fantastic/15 pt-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-fantastic">Escalated to Human</span>
                <span className="font-extrabold text-blue-fantastic font-bebas-neue text-base">128</span>
              </div>
              <div className="w-full bg-oatmeal/20 rounded-full h-2 overflow-hidden">
                <div className="bg-truffle-trouble h-full w-[28%] rounded-full" />
              </div>
              <span className="text-[10px] text-blue-fantastic/50 block font-semibold">Resolution Rate: 72%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Tip Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900 font-medium">
        <Lightbulb className="h-5 w-5 text-amber-600 shrink-0" />
        <span>
          <strong>AI Tip:</strong> Consider adding more FAQs about <u>variations</u> and <u>upgrade options</u> to reduce supervisor escalation requests by up to 15%.
        </span>
      </div>
    </div>
  );
}
