"use client";

import React from "react";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

interface CompanyNotificationsHeaderProps {
  activeTab: "templates" | "rules";
  onNewTemplate: () => void;
  onNewRule: () => void;
}

export function CompanyNotificationsHeader({
  activeTab,
  onNewTemplate,
  onNewRule,
}: CompanyNotificationsHeaderProps) {
  return (
    <PageHeader
      icon={<Bell className="h-5 w-5 text-burning-flame" />}
      title="Notifications & Rules"
      subtitle="Configure automated communication templates and alert rules."
      rightContent={
        activeTab === "templates" ? (
          <Button
            onClick={onNewTemplate}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/95 text-xs font-semibold h-10 rounded-xl shadow-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Template
          </Button>
        ) : (
          <Button
            onClick={onNewRule}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/95 text-xs font-semibold h-10 rounded-xl shadow-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Rule
          </Button>
        )
      }
    />
  );
}
