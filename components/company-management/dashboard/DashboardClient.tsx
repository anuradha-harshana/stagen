"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bell, Calendar, ChevronDown, Filter } from "lucide-react";
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
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-xs text-blue-fantastic/70 font-medium">
            Overview of company performance and project health
          </p>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-3">
          {/* Date Picker Pill */}
          <div className="flex items-center gap-2 bg-palladian/90 border border-blue-fantastic/15 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-fantastic shadow-xs cursor-pointer hover:bg-palladian transition-all">
            <Calendar className="h-3.5 w-3.5 text-truffle-trouble" />
            <span>{dateRange}</span>
            <ChevronDown className="h-3 w-3 text-blue-fantastic/40 ml-1" />
          </div>

          {/* Bell Notifications */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-palladian/90 border border-blue-fantastic/15 flex items-center justify-center text-blue-fantastic hover:bg-palladian transition-all relative cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-truffle-trouble animate-pulse" />
          </button>

          {/* Profile Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-burning-flame flex items-center justify-center text-xs font-extrabold text-blue-fantastic uppercase">
            JS
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-blue-fantastic/15 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-blue-fantastic text-white shadow-xs"
              : "text-blue-fantastic/70 hover:bg-palladian/60"
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "insights"
              ? "bg-blue-fantastic text-white shadow-xs"
              : "text-blue-fantastic/70 hover:bg-palladian/60"
          }`}
        >
          AI & Communication Insights
        </button>
        <button
          onClick={() => setActiveTab("operations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "operations"
              ? "bg-blue-fantastic text-white shadow-xs"
              : "text-blue-fantastic/70 hover:bg-palladian/60"
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
