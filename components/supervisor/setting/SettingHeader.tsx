"use client"

import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export const TABS = [
  "General",
  "Notifications",
  "Security",
  "Site Preferences",
]

interface SettingHeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function SettingHeader({ activeTab, setActiveTab }: SettingHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-blue-fantastic/15 pb-1 font-sans">
      {/* Title Section */}
      <div className="flex items-start justify-between flex-wrap gap-4 pt-1 px-1">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <Settings className="h-5 w-5 text-burning-flame" />
          </div>
          <div>
            <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
              Supervisor Settings
            </h1>
            <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
              Manage your region, notification alerts, security, and site configurations
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none pt-2 px-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative pb-3 text-sm font-semibold transition-all duration-200 font-sans focus:outline-none whitespace-nowrap cursor-pointer",
                isActive
                  ? "text-truffle-trouble"
                  : "text-blue-fantastic/60 hover:text-blue-fantastic"
              )}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-truffle-trouble rounded-t-full transition-all duration-300" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
