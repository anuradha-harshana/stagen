"use client"

import React from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CompanyCurrentPlanCardProps {
  planName: string
  priceMonthly: number
  nextRenewal: string
  billingCycle: string
  onUpgradePlan: () => void
}

export function CompanyCurrentPlanCard({
  planName = "Enterprise Plus",
  priceMonthly = 499,
  nextRenewal = "August 1, 2026",
  billingCycle = "Monthly",
  onUpgradePlan,
}: CompanyCurrentPlanCardProps) {
  return (
    <div className="bg-blue-fantastic rounded-3xl p-6 sm:p-8 shadow-lg border border-white/10 text-palladian font-cream flex flex-col justify-between relative overflow-hidden h-full min-h-[220px]">
      {/* Background subtle glow effect */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-burning-flame/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Action */}
      <div className="flex items-start justify-between gap-4 z-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-oatmeal/60 block mb-1">
            Current Plan
          </span>
          <div className="flex items-baseline flex-wrap">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-palladian leading-tight font-cream">
              {planName}
            </h2>
            <span className="text-sm sm:text-lg text-oatmeal/80 font-normal ml-2 sm:ml-3">
              / ${priceMonthly}/mo
            </span>
          </div>
        </div>

        <Button
          onClick={onUpgradePlan}
          className="bg-burning-flame text-blue-fantastic hover:bg-burning-flame/90 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4 fill-blue-fantastic/20" />
          <span>Upgrade Plan</span>
        </Button>
      </div>

      {/* Bottom Metadata */}
      <div className="flex items-center gap-8 sm:gap-12 mt-6 pt-4 border-t border-white/10 text-xs sm:text-sm z-10">
        <div>
          <span className="text-oatmeal/60 font-medium block text-[11px] sm:text-xs">
            Next Renewal
          </span>
          <span className="font-bold text-palladian mt-0.5 block text-xs sm:text-sm">
            {nextRenewal}
          </span>
        </div>

        <div>
          <span className="text-oatmeal/60 font-medium block text-[11px] sm:text-xs">
            Billing Cycle
          </span>
          <span className="font-bold text-palladian mt-0.5 block text-xs sm:text-sm">
            {billingCycle}
          </span>
        </div>
      </div>
    </div>
  )
}
