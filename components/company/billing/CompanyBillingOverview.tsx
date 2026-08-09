"use client"

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

// Initial mock data directly matching the user's uploaded reference UI
const INITIAL_PLAN: BillingPlan = {
  id: "enterprise-plus",
  name: "Enterprise Plus",
  price: 499,
  billingCycle: "Monthly",
  description: "Enterprise tier with advanced site management.",
  features: ["Up to 15 site licences", "Priority support", "Full API Access"],
}

const INITIAL_PAYMENT_METHOD: PaymentMethodInfo = {
  brand: "Visa",
  last4: "4242",
  expMonth: "12",
  expYear: "28",
  cardholderName: "Stagen Admin",
}

const INITIAL_SITE_LICENCES: SiteLicenceInfo = {
  used: 12,
  total: 15,
  costPerLicence: 25,
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "inv-101",
    invoiceNumber: "INV-2026-0701",
    date: "July 1, 2026",
    amount: 499.0,
    status: "Paid",
    items: [
      { description: "Enterprise Plus Plan - Monthly Subscription", amount: 499.0 },
    ],
  },
  {
    id: "inv-102",
    invoiceNumber: "INV-2026-0601",
    date: "June 1, 2026",
    amount: 499.0,
    status: "Paid",
    items: [
      { description: "Enterprise Plus Plan - Monthly Subscription", amount: 499.0 },
    ],
  },
  {
    id: "inv-103",
    invoiceNumber: "INV-2026-0501",
    date: "May 1, 2026",
    amount: 499.0,
    status: "Paid",
    items: [
      { description: "Enterprise Plus Plan - Monthly Subscription", amount: 499.0 },
    ],
  },
  {
    id: "inv-104",
    invoiceNumber: "INV-2026-0401",
    date: "April 1, 2026",
    amount: 499.0,
    status: "Paid",
    items: [
      { description: "Enterprise Plus Plan - Monthly Subscription", amount: 499.0 },
    ],
  },
]

export function CompanyBillingOverview() {
  const [plan, setPlan] = useState<BillingPlan>(INITIAL_PLAN)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodInfo>(INITIAL_PAYMENT_METHOD)
  const [licences, setLicences] = useState<SiteLicenceInfo>(INITIAL_SITE_LICENCES)
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES)

  // Modals state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isBuyLicencesModalOpen, setIsBuyLicencesModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null)

  // Update Plan Handler
  const handleSelectPlan = (newPlan: BillingPlan) => {
    setPlan(newPlan)
  }

  // Update Payment Method Handler
  const handleSavePaymentMethod = (updated: PaymentMethodInfo) => {
    setPaymentMethod(updated)
  }

  // Buy Additional Licences Handler
  const handlePurchaseLicences = (additionalCount: number) => {
    setLicences((prev) => ({
      ...prev,
      total: prev.total + additionalCount,
    }))
  }

  return (
    <div className="flex flex-col gap-6 w-full font-cream">
      {/* Header */}
      <CompanyBillingHeader />

      {/* Top Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <CompanyCurrentPlanCard
            planName={plan.name}
            priceMonthly={plan.price}
            nextRenewal="August 1, 2026"
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
      <UpgradePlanModal
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
