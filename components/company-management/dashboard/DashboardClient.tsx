"use client";

import React, { useState } from "react";
import { Bell, Calendar, ChevronDown, Filter, LayoutDashboard } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import { ExecutiveKpis } from "./ExecutiveKpis";
import { StageChart } from "./StageChart";
import { RegionChart } from "./RegionChart";
import { StatusChart } from "./StatusChart";
import { SupervisorsWidget } from "./SupervisorsWidget";
import { AtRiskTable } from "./AtRiskTable";
import { AiInsightsSection } from "./AiInsightsSection";
import { OperationsOverview } from "./OperationsOverview";
import { Button } from "@/components/ui/button";

export default function DashboardClient() {
  const [dateRange, setDateRange] = useState("May 14 – May 20, 2024");
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "operations">("overview");

  return (
    <div className={PAGE_SHELL_CLASS}>
      <PageHeader
        icon={<LayoutDashboard className="h-5 w-5 text-burning-flame" />}
        title="Executive Dashboard"
        subtitle="Overview of company performance and project health"
        rightContent={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-blue-fantastic/15 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-fantastic shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-truffle-trouble" />
              <span>{dateRange}</span>
              <ChevronDown className="h-3 w-3 text-blue-fantastic/40 ml-1" />
            </div>

            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-white border border-blue-fantastic/15 flex items-center justify-center text-blue-fantastic hover:bg-blue-fantastic/5 transition-all relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-truffle-trouble" />
            </button>

            <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-fantastic/15 shrink-0 bg-burning-flame flex items-center justify-center text-xs font-extrabold text-blue-fantastic uppercase">
              JS
            </div>
          </div>
        }
      />

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-blue-fantastic/15 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-blue-fantastic text-white shadow-xs"
              : "text-blue-fantastic/70 hover:bg-surface-muted"
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "insights"
              ? "bg-blue-fantastic text-white shadow-xs"
              : "text-blue-fantastic/70 hover:bg-surface-muted"
          }`}
        >
          AI & Communication Insights
        </button>
        <button
          onClick={() => setActiveTab("operations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "operations"
              ? "bg-blue-fantastic text-white shadow-xs"
              : "text-blue-fantastic/70 hover:bg-surface-muted"
          }`}
        >
          Operations & Warranty
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top 4 Stat KPIs */}
          <ExecutiveKpis />

          {/* 2x2 Visual Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StageChart />
            <RegionChart />
            <StatusChart />
            <SupervisorsWidget />
          </div>

          {/* Bottom At-Risk Projects Table */}
          <AtRiskTable />
        </div>
      )}

      {activeTab === "insights" && <AiInsightsSection />}

      {activeTab === "operations" && <OperationsOverview />}
    </div>
  );
}
