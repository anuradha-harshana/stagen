"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const TABS = [
  { label: "All",       count: 29 },
  { label: "Photos",    count: 24 },
  { label: "Documents", count: 5  },
  { label: "Reports",   count: 3  },
]

export function DocumentsFilter() {
  const [active, setActive] = useState("All")

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          onClick={() => setActive(tab.label)}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-semibold border transition-all duration-200 font-sans",
            active === tab.label
              ? "bg-blue-fantastic text-palladian border-blue-fantastic shadow-sm"
              : "bg-white text-blue-fantastic/60 border-blue-fantastic/15 hover:bg-blue-fantastic/8 hover:text-blue-fantastic hover:border-blue-fantastic/25"
          )}
        >
          {tab.label}
          <span
            className={cn(
              "inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold",
              active === tab.label
                ? "bg-white/15 text-palladian"
                : "bg-blue-fantastic/10 text-blue-fantastic/50"
            )}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}
