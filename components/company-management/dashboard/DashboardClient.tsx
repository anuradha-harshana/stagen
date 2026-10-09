"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  LayoutDashboard,
  FolderKanban,
  Building2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import { Button } from "@/components/ui/button";
import { CompanyManagementDashboardData } from "@/lib/company-management/dashboardData";
import { Project } from "@/lib/types/project";
import ProjectDetailsModal from "@/components/company/projects/project-details-modal";

import { ExecutiveKpis } from "./ExecutiveKpis";
import { StageChart } from "./StageChart";
import { StatusChart } from "./StatusChart";
import { SupervisorsWidget } from "./SupervisorsWidget";
import { AtRiskTable } from "./AtRiskTable";
import { RecentActivitiesWidget } from "./RecentActivitiesWidget";
import { AiInsightsSection } from "./AiInsightsSection";
import { OperationsOverview } from "./OperationsOverview";

interface DashboardClientProps {
  data: CompanyManagementDashboardData;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const [dateRange] = useState("Current Quarter (Q3 2026)");
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "operations">("overview");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className={PAGE_SHELL_CLASS}>
      <PageHeader
        icon={<LayoutDashboard className="h-5 w-5 text-burning-flame" />}
        title="Executive Management Dashboard"
        subtitle="Real-time oversight of construction stage progression, supervisor workloads, and project health."
        rightContent={
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-blue-fantastic/15 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-fantastic shadow-xs">
              <Calendar className="h-3.5 w-3.5 text-truffle-trouble" />
              <span>{dateRange}</span>
            </div>

            <Link href="/company-management/projects">
              <Button
                variant="outline"
                className="bg-white border-blue-fantastic/15 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-bold h-9 px-3 rounded-xl shadow-xs"
              >
                <FolderKanban className="h-3.5 w-3.5 mr-1.5 text-truffle-trouble" />
                All Projects ({data.kpis.totalProjects})
              </Button>
            </Link>
          </div>
        }
      />

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-blue-fantastic/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-blue-fantastic text-white shadow-xs"
              : "text-blue-fantastic/70 hover:bg-surface-muted"
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "insights"
              ? "bg-blue-fantastic text-white shadow-xs"
              : "text-blue-fantastic/70 hover:bg-surface-muted"
          }`}
        >
          AI & Communication Insights
        </button>
        <button
          onClick={() => setActiveTab("operations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
          {/* Top Stat KPIs (Reusing /company/projects design language) */}
          <ExecutiveKpis kpis={data.kpis} />

          {/* 2x2 Visual Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StageChart data={data.stageBreakdown} />
            <StatusChart data={data.statusBreakdown} />
            <SupervisorsWidget data={data.supervisorsWorkload} />
            <RecentActivitiesWidget activities={data.recentActivities} />
          </div>

          {/* Bottom At-Risk Projects Table */}
          <AtRiskTable
            data={data.atRiskProjects}
            onViewProject={(project) => setSelectedProject(project)}
          />
        </div>
      )}

      {activeTab === "insights" && <AiInsightsSection />}

      {activeTab === "operations" && <OperationsOverview />}

      {/* Reusable Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
