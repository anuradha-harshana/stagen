"use client"

import React, { useState } from "react"
import { X, Check, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { BillingPlan } from "./types"

interface UpgradePlanModalProps {
  isOpen: boolean
  currentPlanName: string
  onClose: () => void
  onSelectPlan: (plan: BillingPlan) => void
}

const AVAILABLE_PLANS: BillingPlan[] = [
  {
    id: "plan-starter",
    name: "Starter",
    price: 199,
    billingCycle: "Monthly",
    description: "Ideal for small builders and emerging contractors.",
    features: [
      "Up to 5 active site licences",
      "Standard document management",
      "Email support",
      "Basic reporting & audit logs",
    ],
  },
  {
    id: "plan-pro",
    name: "Pro Standard",
    price: 299,
    billingCycle: "Monthly",
    description: "For growing construction firms with multi-site operations.",
    features: [
      "Up to 10 active site licences",
      "Advanced safety policies & QA",
      "Priority customer support",
      "Custom branding & workflows",
    ],
  },
  {
    id: "plan-enterprise-plus",
    name: "Enterprise Plus",
    price: 499,
    billingCycle: "Monthly",
    description: "Full suite power for large-scale enterprise developments.",
    recommended: true,
    features: [
      "Up to 15 active site licences",
      "Unlimited document storage",
      "24/7 dedicated account supervisor",
      "Custom stage templates & AI insights",
      "Full API & Webhook integrations",
    ],
  },
  {
    id: "plan-ultimate",
    name: "Unlimited Scale",
    price: 899,
    billingCycle: "Monthly",
    description: "Maximum scale for nationwide home builders.",
    features: [
      "Up to 50 active site licences",
      "Dedicated infrastructure & SLAs",
      "Multi-subsidiary management",
      "Custom SSO & security controls",
      "Quarterly strategy reviews",
    ],
  },
]

export function UpgradePlanModal({
  isOpen,
  currentPlanName,
  onClose,
  onSelectPlan,
}: UpgradePlanModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan-enterprise-plus")
  const [isAnnual, setIsAnnual] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    const targetPlan = AVAILABLE_PLANS.find((p) => p.id === selectedPlanId)
    if (targetPlan) {
      const finalPlan = {
        ...targetPlan,
        price: isAnnual ? Math.round(targetPlan.price * 0.85) : targetPlan.price,
        billingCycle: (isAnnual ? "Annual" : "Monthly") as "Monthly" | "Annual",
      }
      onSelectPlan(finalPlan)
      toast.success(`Successfully updated subscription to ${targetPlan.name}!`)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-palladian rounded-3xl shadow-2xl border border-blue-fantastic/15 w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-fantastic/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-burning-flame/15 border border-burning-flame/30 flex items-center justify-center text-truffle-trouble">
              <Sparkles className="h-4.5 w-4.5 text-burning-flame fill-burning-flame/20" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-fantastic font-sans">
                Change Subscription Plan
              </h2>
              <p className="text-xs text-neutral-400">
                Choose the right plan to power your build sites.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-palladian transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Annual vs Monthly Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!isAnnual ? "text-blue-fantastic" : "text-neutral-400"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer ${
                isAnnual ? "bg-blue-fantastic" : "bg-neutral-200"
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-palladian transition-transform ${
                  isAnnual ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${isAnnual ? "text-blue-fantastic" : "text-neutral-400"}`}>
                Annual Billing
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Save 15%
              </span>
            </div>
          </div>

          {/* Grid of Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AVAILABLE_PLANS.map((plan) => {
              const isCurrent = plan.name === currentPlanName
              const isSelected = plan.id === selectedPlanId
              const displayPrice = isAnnual ? Math.round(plan.price * 0.85) : plan.price

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? "border-blue-fantastic bg-blue-fantastic/5 shadow-md"
                      : "border-neutral-200 hover:border-neutral-300 bg-palladian"
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-burning-flame text-blue-fantastic text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                      Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm text-blue-fantastic">{plan.name}</h3>
                      {isCurrent && (
                        <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-bold">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 min-h-[32px] leading-tight mb-3">
                      {plan.description}
                    </p>

                    <div className="mb-4">
                      <span className="text-2xl font-bold text-blue-fantastic">
                        ${displayPrice}
                      </span>
                      <span className="text-xs text-neutral-400 font-normal">/mo</span>
                    </div>

                    <ul className="space-y-2 mb-4 border-t border-neutral-100 pt-3">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-neutral-600">
                          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-blue-fantastic text-palladian shadow-xs"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select Plan"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-blue-fantastic/15 bg-neutral-50/50 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-10 px-4 border-neutral-200 text-neutral-600 text-xs font-bold rounded-xl hover:bg-neutral-100 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="h-10 px-5 bg-burning-flame text-blue-fantastic hover:bg-burning-flame/90 text-xs font-bold rounded-xl shadow-sm cursor-pointer"
          >
            Confirm & Switch Plan
          </Button>
        </div>
      </div>
    </div>
  )
}
