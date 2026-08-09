import { Suspense } from "react"
import { CompanyBillingOverview } from "@/components/company/billing/CompanyBillingOverview"
import { CompanyBillingSkeleton } from "@/components/company/billing/CompanyBillingSkeleton"

export const metadata = {
  title: "Billing & Licences | Company Portal",
  description: "Manage your subscription, payment methods, and invoices.",
}

export default function CompanyBillingPage() {
  return (
    <div className="flex flex-col gap-4 w-full px-5 py-4 font-cream">
      <Suspense fallback={<CompanyBillingSkeleton />}>
        <CompanyBillingOverview />
      </Suspense>
    </div>
  )
}
