"use client"

import React, { useState } from "react"
import { X, PlusCircle, Minus, Plus, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { SiteLicenceInfo } from "./types"

interface BuyLicencesModalProps {
  isOpen: boolean
  licences: SiteLicenceInfo
  onClose: () => void
  onPurchase: (additionalCount: number) => void
}

export function BuyLicencesModal({
  isOpen,
  licences,
  onClose,
  onPurchase,
}: BuyLicencesModalProps) {
  const [additionalCount, setAdditionalCount] = useState<number>(3)
  const pricePerLicence = licences.costPerLicence || 25

  if (!isOpen) return null

  const handleIncrement = () => setAdditionalCount((prev) => prev + 1)
  const handleDecrement = () => setAdditionalCount((prev) => (prev > 1 ? prev - 1 : 1))

  const newTotalLicences = licences.total + additionalCount
  const totalCostMonthly = additionalCount * pricePerLicence

  const handleConfirmPurchase = () => {
    onPurchase(additionalCount)
    toast.success(`Successfully added ${additionalCount} site licences! Total licences: ${newTotalLicences}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-palladian rounded-3xl shadow-2xl border border-blue-fantastic/15 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-fantastic/15">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-burning-flame/15 border border-burning-flame/30 flex items-center justify-center text-truffle-trouble">
              <PlusCircle className="h-4.5 w-4.5 text-burning-flame fill-burning-flame/20" />
            </div>
            <h2 className="text-base font-bold text-blue-fantastic font-sans">
              Purchase Additional Site Licences
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-palladian transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current State Info Box */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/10 flex items-center justify-center text-blue-fantastic">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 font-medium block">Current Allocation</span>
                <span className="text-sm font-bold text-blue-fantastic">
                  {licences.used} of {licences.total} Used
                </span>
              </div>
            </div>
            <span className="bg-orange-50 text-burning-flame text-xs font-bold px-2.5 py-1 rounded-full border border-burning-flame/20">
              {licences.total - licences.used} Remaining
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-blue-fantastic block text-center">
              Select Additional Licences to Add
            </label>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={additionalCount <= 1}
                className="h-11 w-11 rounded-2xl bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 flex items-center justify-center text-blue-fantastic font-bold disabled:opacity-40 cursor-pointer transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className="text-center min-w-[90px]">
                <span className="text-3xl font-bold text-blue-fantastic block font-sans">
                  +{additionalCount}
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">
                  {additionalCount === 1 ? "Site Licence" : "Site Licences"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleIncrement}
                className="h-11 w-11 rounded-2xl bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 flex items-center justify-center text-blue-fantastic font-bold cursor-pointer transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Select Pill Buttons */}
          <div className="flex items-center justify-center gap-2">
            {[1, 3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setAdditionalCount(num)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  additionalCount === num
                    ? "bg-blue-fantastic text-palladian shadow-2xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                +{num}
              </button>
            ))}
          </div>

          {/* Summary Breakdown */}
          <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-500 font-medium">
              <span>Unit Price</span>
              <span>${pricePerLicence}.00 / licence / mo</span>
            </div>
            <div className="flex items-center justify-between text-neutral-500 font-medium">
              <span>New Total Licences</span>
              <span className="font-bold text-blue-fantastic">{newTotalLicences} Licences</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-sm font-bold text-blue-fantastic">
              <span>Additional Monthly Cost</span>
              <span className="text-base text-truffle-trouble">${totalCostMonthly}.00 / mo</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-blue-fantastic/15 bg-neutral-50/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 px-4 border-neutral-200 text-neutral-600 text-xs font-bold rounded-xl hover:bg-neutral-100 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPurchase}
            className="h-10 px-5 bg-blue-fantastic text-palladian hover:bg-blue-fantastic/90 text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Confirm & Add Licences
          </Button>
        </div>
      </div>
    </div>
  )
}
