"use client"

import React from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteLicenceInfo } from "./types"

interface CompanySiteLicencesCardProps {
  licences: SiteLicenceInfo
  onBuyMoreLicences: () => void
}

export function CompanySiteLicencesCard({
  licences,
  onBuyMoreLicences,
}: CompanySiteLicencesCardProps) {
  const percentage = Math.min(100, Math.round((licences.used / licences.total) * 100))
  const remaining = Math.max(0, licences.total - licences.used)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-oatmeal/30 font-cream flex flex-col justify-between h-full min-h-[220px]">
      <div>
        {/* Title and Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-blue-fantastic font-cream">
            Site Licences
          </h3>
          <span className="bg-burning-flame/15 text-truffle-trouble font-bold px-3 py-1 rounded-full text-xs border border-burning-flame/30 shrink-0">
            {licences.used} / {licences.total} Used
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden my-3 border border-neutral-200/40">
          <div
            className="bg-burning-flame h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed mt-3">
          You have {remaining} active project {remaining === 1 ? "licence" : "licences"} remaining on your current plan.
        </p>
      </div>

      <Button
        onClick={onBuyMoreLicences}
        className="w-full mt-6 h-11 bg-blue-fantastic hover:bg-blue-fantastic/90 text-palladian font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <PlusCircle className="h-4 w-4 text-burning-flame" />
        <span>Buy More Licences</span>
      </Button>
    </div>
  )
}
