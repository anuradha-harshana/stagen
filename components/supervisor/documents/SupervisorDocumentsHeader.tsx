"use client"

import React, { useState } from "react"
import Image from "next/image"
import { FolderOpen, Bell, ChevronDown } from "lucide-react"
import { toast } from "sonner"

export const SUPERVISOR_PROJECTS = [
  { code: "PRO-233", name: "Groove Inn" },
  { code: "PRO-234", name: "Sunset Villas" },
  { code: "PRO-235", name: "Horizon Tower" },
  { code: "PRO-236", name: "Parkview Residence" },
]

interface SupervisorDocumentsHeaderProps {
  selectedProject: { code: string; name: string }
  onSelectProject: (project: { code: string; name: string }) => void
}

export function SupervisorDocumentsHeader({
  selectedProject,
  onSelectProject,
}: SupervisorDocumentsHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-blue-fantastic/15 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <FolderOpen className="h-5 w-5 text-burning-flame" />
          </div>
          <div>
            <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
              Upload Documents
            </h1>
            <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
              Upload site documents, certificates and reports
            </p>
          </div>
        </div>

        {/* Right side controls: Project selector & Notifications */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Project Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white border border-blue-fantastic/15 px-3.5 py-1.5 rounded-2xl shadow-sm hover:border-blue-fantastic/30 hover:bg-blue-fantastic/5 transition-all text-xs font-bold text-blue-fantastic"
            >
              <span>
                {selectedProject.code} {selectedProject.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-blue-fantastic/70" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-blue-fantastic/15 py-2 z-30 font-sans">
                {SUPERVISOR_PROJECTS.map((proj) => (
                  <button
                    key={proj.code}
                    onClick={() => {
                      onSelectProject(proj)
                      setIsDropdownOpen(false)
                      toast.info(`Switched active project to ${proj.code} ${proj.name}`)
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${selectedProject.code === proj.code
                      ? "bg-blue-fantastic/15 text-blue-fantastic"
                      : "text-blue-fantastic/80 hover:bg-blue-fantastic/10"
                      }`}
                  >
                    {proj.code} {proj.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
