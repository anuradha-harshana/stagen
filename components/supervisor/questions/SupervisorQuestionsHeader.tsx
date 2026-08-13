"use client"

import React, { useState } from "react"
import { MessageCircle, Search, ChevronDown, Bell } from "lucide-react"
import { toast } from "sonner"

export const SUPERVISOR_PROJECTS = [
  { code: "ALL", name: "All Projects" },
  { code: "PRO-233", name: "Groove Inn" },
  { code: "PRO-234", name: "Sunset Villas" },
  { code: "PRO-235", name: "Horizon Tower" },
  { code: "PRO-236", name: "Parkview Residence" },
]

interface SupervisorQuestionsHeaderProps {
  selectedProject: { code: string; name: string }
  onSelectProject: (project: { code: string; name: string }) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SupervisorQuestionsHeader({
  selectedProject,
  onSelectProject,
  searchQuery,
  onSearchChange,
}: SupervisorQuestionsHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-blue-fantastic/15 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <MessageCircle className="h-5 w-5 text-burning-flame" />
          </div>
          <div>
            <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
              Customer Questions &amp; Answers
            </h1>
            <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
              Review, manage, and respond to site questions from home buyers
            </p>
          </div>
        </div>

        {/* Controls: Search & Project Selector Dropdown */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search questions or customers..."
              className="pl-8 pr-3 py-1.5 bg-palladian border border-blue-fantastic/15 rounded-2xl text-xs font-medium text-blue-fantastic placeholder:text-blue-fantastic/40 focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none transition-all w-56 font-sans"
            />
          </div>

          {/* Project Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-palladian border border-blue-fantastic/15 px-3.5 py-1.5 rounded-2xl shadow-sm hover:border-blue-fantastic/30 hover:bg-blue-fantastic/5 transition-all text-xs font-bold text-blue-fantastic"
            >
              <span>
                {selectedProject.code === "ALL"
                  ? "All Projects"
                  : `${selectedProject.code} ${selectedProject.name}`}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-blue-fantastic/70" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-palladian rounded-2xl shadow-xl border border-blue-fantastic/15 py-2 z-30 font-sans">
                {SUPERVISOR_PROJECTS.map((proj) => (
                  <button
                    key={proj.code}
                    onClick={() => {
                      onSelectProject(proj)
                      setIsDropdownOpen(false)
                      toast.info(
                        proj.code === "ALL"
                          ? "Showing customer questions for All Projects"
                          : `Switched filter to ${proj.code} ${proj.name}`
                      )
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                      selectedProject.code === proj.code
                        ? "bg-blue-fantastic/15 text-blue-fantastic"
                        : "text-blue-fantastic/80 hover:bg-blue-fantastic/10"
                    }`}
                  >
                    {proj.code === "ALL" ? "All Projects" : `${proj.code} ${proj.name}`}
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
