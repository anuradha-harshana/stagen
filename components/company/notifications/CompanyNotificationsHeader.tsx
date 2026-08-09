"use client"

import React from "react"
import { Plus } from "lucide-react"

interface CompanyNotificationsHeaderProps {
  activeTab: "templates" | "rules"
  onNewTemplate: () => void
  onNewRule: () => void
}

export function CompanyNotificationsHeader({
  activeTab,
  onNewTemplate,
  onNewRule,
}: CompanyNotificationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-3xl font-bold text-abyssal-blue font-cream tracking-tight">
          Notifications & Rules
        </h1>
        <p className="text-sm text-abyssal-blue/70 font-cream mt-1">
          Configure automated communication and alerts.
        </p>
      </div>

      <div>
        {activeTab === "templates" ? (
          <button
            onClick={onNewTemplate}
            className="inline-flex items-center justify-center gap-2 bg-burning-flame hover:bg-burning-flame/90 text-abyssal-blue font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm font-cream"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
        ) : (
          <button
            onClick={onNewRule}
            className="inline-flex items-center justify-center gap-2 bg-burning-flame hover:bg-burning-flame/90 text-abyssal-blue font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm font-cream"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        )}
      </div>
    </div>
  )
}
