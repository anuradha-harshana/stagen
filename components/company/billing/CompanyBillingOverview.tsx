"use client"

import { useCompanySection, DataState } from "@/components/supervisor/useSupervisorData";
import React, { useState } from "react"
import { CompanyBillingHeader } from "./CompanyBillingHeader"
import { CompanyCurrentPlanCard } from "./CompanyCurrentPlanCard"
import { CompanyPaymentMethodCard } from "./CompanyPaymentMethodCard"
import { CompanyInvoiceHistoryCard } from "./CompanyInvoiceHistoryCard"
import { CompanySiteLicencesCard } from "./CompanySiteLicencesCard"
import { UpgradePlanModal } from "./UpgradePlanModal"
import { UpdatePaymentMethodModal } from "./UpdatePaymentMethodModal"
import { BuyLicencesModal } from "./BuyLicencesModal"
import { InvoiceReceiptModal } from "./InvoiceReceiptModal"
import { BillingPlan, PaymentMethodInfo, InvoiceItem, SiteLicenceInfo } from "./types"

export function CompanyBillingOverview() {
  const stored = useCompanySection<{ plan: BillingPlan; paymentMethod: PaymentMethodInfo; licences: SiteLicenceInfo; invoices: InvoiceItem[]; nextRenewal?: string; plans?: BillingPlan[] }>("billing", {
    plan: { id: "", name: "Not configured", price: 0, billingCycle: "Monthly", description: "", features: [] },
    paymentMethod: { brand: "Not configured", last4: "", expMonth: "", expYear: "", cardholderName: "" },
    licences: { used: 0, total: 0, costPerLicence: 0 }, invoices: []
  });
  const { plan, paymentMethod, licences, invoices } = stored.data;
  // Modals state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isBuyLicencesModalOpen, setIsBuyLicencesModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null)

  // Update Plan Handler
  const handleSelectPlan = (newPlan: BillingPlan) => {
    void stored.save({ ...stored.data, plan: newPlan })
  }

  // Update Payment Method Handler
  const handleSavePaymentMethod = (updated: PaymentMethodInfo) => {
    void stored.save({ ...stored.data, paymentMethod: updated })
  }

  // Buy Additional Licences Handler
  const handlePurchaseLicences = (additionalCount: number) => {
    void stored.save({ ...stored.data, licences: { ...licences, total: licences.total + additionalCount } })
  }

  if (stored.loading || stored.error) return <DataState loading={stored.loading} error={stored.error} />;
  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      {/* Header */}
      <CompanyBillingHeader />

      {/* Top Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <CompanyCurrentPlanCard
            planName={plan.name}
            priceMonthly={plan.price}
            nextRenewal={stored.data.nextRenewal ?? "Not configured"}
            billingCycle={plan.billingCycle}
            onUpgradePlan={() => setIsUpgradeModalOpen(true)}
          />
        </div>
        <div className="lg:col-span-1">
          <CompanyPaymentMethodCard
            paymentMethod={paymentMethod}
            onUpdatePaymentMethod={() => setIsPaymentModalOpen(true)}
          />
        </div>
      </div>

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <CompanyInvoiceHistoryCard
            invoices={invoices}
            onSelectInvoice={(inv) => setSelectedInvoice(inv)}
          />
        </div>
        <div className="lg:col-span-1">
          <CompanySiteLicencesCard
            licences={licences}
            onBuyMoreLicences={() => setIsBuyLicencesModalOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <UpgradePlanModal plans={stored.data.plans ?? []}
        isOpen={isUpgradeModalOpen}
        currentPlanName={plan.name}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSelectPlan={handleSelectPlan}
      />

      <UpdatePaymentMethodModal
        isOpen={isPaymentModalOpen}
        currentPaymentMethod={paymentMethod}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePaymentMethod}
      />

      <BuyLicencesModal
        isOpen={isBuyLicencesModalOpen}
        licences={licences}
        onClose={() => setIsBuyLicencesModalOpen(false)}
        onPurchase={handlePurchaseLicences}
      />

      <InvoiceReceiptModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  )
}
