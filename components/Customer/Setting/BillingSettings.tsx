"use client"

import { useState, useEffect } from "react"
import { CreditCard, FileText, Settings2, Wallet, ChevronRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CustomerSettings } from "@/lib/types/types"
import { saveCustomerSettingsAction } from "@/lib/customer/actions"

interface BillingSettingsProps {
  settings?: CustomerSettings | null
  onUpdate?: (updated: CustomerSettings) => void
}

export default function BillingSettings({ settings, onUpdate }: BillingSettingsProps = {}) {
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState(
    settings?.billing?.plan || "Professional"
  )
  const [billingEmail, setBillingEmail] = useState(
    settings?.billing?.billingEmail || "customer@stagen.com"
  )
  const [paymentMethod, setPaymentMethod] = useState(
    settings?.billing?.paymentMethod || "Visa ending in 4242"
  )

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)
  const [isSavingPlan, setIsSavingPlan] = useState(false)

  useEffect(() => {
    if (settings?.billing) {
      setCurrentPlan(settings.billing.plan || "Professional")
      setBillingEmail(settings.billing.billingEmail || "customer@stagen.com")
      setPaymentMethod(settings.billing.paymentMethod || "Visa ending in 4242")
      setSelectedPlan(settings.billing.plan || "Professional")
    }
  }, [settings])

  const handleSavePlan = async () => {
    setIsSavingPlan(true)
    try {
      const res = await saveCustomerSettingsAction({
        billing: {
          plan: selectedPlan,
          billingEmail,
          paymentMethod,
          billingCycle: settings?.billing?.billingCycle || "Monthly",
        },
      })

      if (res.success && res.settings) {
        setCurrentPlan(selectedPlan)
        onUpdate?.(res.settings)
        toast.success(`Plan updated to ${selectedPlan}!`)
        setIsPlanModalOpen(false)
      } else {
        toast.error(res.error || "Failed to update plan")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update plan")
    } finally {
      setIsSavingPlan(false)
    }
  }

  const handleInvoiceHistory = () => {
    router.push("/customer/invoices")
  }

  const handleManagePaymentMethod = () => {
    toast.info(`Current default method: ${paymentMethod}`)
  }

  return (
    <>
      <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans w-[1000px] max-w-2xl">
        <CardHeader className="border-b border-blue-fantastic/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-truffle-trouble" />
            </div>
            <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
              Billing Settings
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Plan */}
          <button
            type="button"
            onClick={() => setIsPlanModalOpen(true)}
            className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
                <Settings2 className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-fantastic">
                  Plan
                </h4>
                <p className="text-xs text-blue-fantastic/60 mt-0.5">
                  Current Plan: {currentPlan}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/25 text-xs font-semibold px-2 py-0.5 rounded-lg"
              >
                Active
              </Badge>
              <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
            </div>
          </button>

          {/* Billing Information */}
          <div className="w-full flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-truffle-trouble" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-fantastic">
                  Billing Information
                </h4>
                <p className="text-xs text-blue-fantastic/60 mt-0.5">
                  Invoices sent to: <span className="font-semibold">{billingEmail}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <button
            type="button"
            onClick={handleManagePaymentMethod}
            className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
                <Wallet className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-fantastic">
                  Payment Methods
                </h4>
                <p className="text-xs text-blue-fantastic/60 mt-0.5">
                  {paymentMethod}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
          </button>

          {/* Invoice History */}
          <button
            type="button"
            onClick={handleInvoiceHistory}
            className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-fantastic">
                  Invoice History
                </h4>
                <p className="text-xs text-blue-fantastic/60 mt-0.5">
                  View and download your project invoices
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-truffle-trouble">
              View
              <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Plan Selection Modal */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
                <Settings2 className="h-4 w-4 text-truffle-trouble" />
              </div>
              <DialogTitle className="text-blue-fantastic text-base font-bold font-sans">
                Select Customer Plan
              </DialogTitle>
            </div>
            <DialogDescription className="text-blue-fantastic/60 text-xs">
              Choose the tier that fits your construction project tracking needs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 font-sans">
            {[
              {
                id: "Standard",
                name: "Standard Tier",
                desc: "Basic timeline tracking and digital warranty storage.",
              },
              {
                id: "Professional",
                name: "Professional Tier (Recommended)",
                desc: "Live site webcam, daily supervisor log updates, and AI assistant.",
              },
              {
                id: "Enterprise",
                name: "Enterprise Multi-Lot",
                desc: "Full portfolio tracking across multiple construction lots.",
              },
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  selectedPlan === p.id
                    ? "border-truffle-trouble bg-truffle-trouble/5"
                    : "border-blue-fantastic/15 bg-white hover:bg-blue-fantastic/5"
                }`}
              >
                <div>
                  <h5 className="text-xs font-bold text-blue-fantastic">{p.name}</h5>
                  <p className="text-xs text-blue-fantastic/60 mt-0.5">{p.desc}</p>
                </div>
                {selectedPlan === p.id && (
                  <Check className="h-4 w-4 text-truffle-trouble shrink-0 mt-0.5" />
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPlanModalOpen(false)}
              disabled={isSavingPlan}
              className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSavePlan}
              disabled={isSavingPlan}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold shadow-sm cursor-pointer"
            >
              {isSavingPlan ? "Saving..." : "Update Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
