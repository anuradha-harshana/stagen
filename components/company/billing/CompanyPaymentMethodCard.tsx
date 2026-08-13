"use client"

import React from "react"
import { CreditCard, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentMethodInfo } from "./types"

interface CompanyPaymentMethodCardProps {
  paymentMethod: PaymentMethodInfo
  onUpdatePaymentMethod: () => void
}

export function CompanyPaymentMethodCard({
  paymentMethod,
  onUpdatePaymentMethod,
}: CompanyPaymentMethodCardProps) {
  return (
    <div className="bg-palladian rounded-3xl p-6 shadow-sm border border-blue-fantastic/15 font-sans flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-blue-fantastic mb-4 font-sans">
          Payment Method
        </h3>

        <div className="bg-neutral-50/90 border border-neutral-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="h-10 w-12 rounded-xl bg-palladian border border-neutral-200 flex items-center justify-center text-blue-fantastic shadow-2xs shrink-0">
            <CreditCard className="h-5 w-5 text-blue-fantastic" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-bold text-blue-fantastic truncate">
              {paymentMethod.brand} ending in {paymentMethod.last4}
            </span>
            <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">
              Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onUpdatePaymentMethod}
        className="w-full mt-4 h-11 border-neutral-200/90 text-blue-fantastic hover:bg-neutral-50 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
      >
        <Edit3 className="h-4 w-4 text-blue-fantastic/60" />
        <span>Update Payment Method</span>
      </Button>
    </div>
  )
}
