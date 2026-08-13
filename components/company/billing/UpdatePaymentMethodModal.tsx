"use client"

import React, { useState, useEffect } from "react"
import { X, CreditCard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { PaymentMethodInfo } from "./types"

interface UpdatePaymentMethodModalProps {
  isOpen: boolean
  currentPaymentMethod: PaymentMethodInfo
  onClose: () => void
  onSave: (updated: PaymentMethodInfo) => void
}

export function UpdatePaymentMethodModal({
  isOpen,
  currentPaymentMethod,
  onClose,
  onSave,
}: UpdatePaymentMethodModalProps) {
  const [cardholderName, setCardholderName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expMonth, setExpMonth] = useState("")
  const [expYear, setExpYear] = useState("")
  const [cvc, setCvc] = useState("")
  const [postalCode, setPostalCode] = useState("")

  useEffect(() => {
    if (currentPaymentMethod) {
      setCardholderName(currentPaymentMethod.cardholderName || "John Doe")
      setCardNumber(`•••• •••• •••• ${currentPaymentMethod.last4}`)
      setExpMonth(currentPaymentMethod.expMonth)
      setExpYear(currentPaymentMethod.expYear)
      setCvc("•••")
      setPostalCode("90210")
    }
  }, [currentPaymentMethod, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const last4Digit = cardNumber.replace(/\s+/g, "").slice(-4) || currentPaymentMethod.last4

    const updated: PaymentMethodInfo = {
      brand: "Visa",
      last4: last4Digit,
      expMonth: expMonth.padStart(2, "0"),
      expYear: expYear.slice(-2),
      cardholderName: cardholderName,
    }

    onSave(updated)
    toast.success("Payment method updated successfully!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-palladian rounded-3xl shadow-2xl border border-blue-fantastic/15 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-fantastic/15">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-fantastic/10 border border-blue-fantastic/20 flex items-center justify-center text-blue-fantastic">
              <CreditCard className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-base font-bold text-blue-fantastic font-sans">
              Update Payment Method
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic block">Cardholder Name</label>
            <Input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="bg-palladian border-blue-fantastic/15 text-blue-fantastic rounded-xl text-xs h-10 font-sans"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic block">Card Number</label>
            <div className="relative">
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="bg-palladian border-blue-fantastic/15 text-blue-fantastic rounded-xl text-xs h-10 font-sans pr-10"
                required
              />
              <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-neutral-400" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic block">Exp Month</label>
              <Input
                type="text"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                placeholder="MM"
                maxLength={2}
                className="bg-palladian border-blue-fantastic/15 text-blue-fantastic rounded-xl text-xs h-10 font-sans text-center"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic block">Exp Year</label>
              <Input
                type="text"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                placeholder="YY"
                maxLength={2}
                className="bg-palladian border-blue-fantastic/15 text-blue-fantastic rounded-xl text-xs h-10 font-sans text-center"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic block">CVC</label>
              <Input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                maxLength={4}
                className="bg-palladian border-blue-fantastic/15 text-blue-fantastic rounded-xl text-xs h-10 font-sans text-center"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic block">Postal / Zip Code</label>
            <Input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g. 2000"
              className="bg-palladian border-blue-fantastic/15 text-blue-fantastic rounded-xl text-xs h-10 font-sans"
              required
            />
          </div>

          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60 flex items-center gap-2.5 text-xs text-neutral-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Your payment information is encrypted and securely processed via Stripe.</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-fantastic/15">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 border-neutral-200 text-neutral-600 text-xs font-bold rounded-xl hover:bg-neutral-100 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 px-5 bg-blue-fantastic text-palladian hover:bg-blue-fantastic/90 text-xs font-bold rounded-xl shadow-sm cursor-pointer"
            >
              Save Payment Method
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
