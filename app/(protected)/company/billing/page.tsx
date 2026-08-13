import { Suspense } from "react"
import { CompanyBillingOverview } from "@/components/company/billing/CompanyBillingOverview"
import { CompanyBillingSkeleton } from "@/components/company/billing/CompanyBillingSkeleton"

export const metadata = {
  title: "Billing & Licences | Company Portal",
  description: "Manage your subscription, payment methods, and invoices.",
}

export default function CompanyBillingPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <Suspense fallback={<CompanyBillingSkeleton />}>
        <CompanyBillingOverview />
      </Suspense>
    </div>
  )
}
