import { Suspense } from "react"
import { InvoicesHeader } from "@/components/Customer/Invoices/InvoicesHeader"
import { InvoicesSummaryCards } from "@/components/Customer/Invoices/InvoicesSummaryCards"
import { InvoicesTable } from "@/components/Customer/Invoices/InvoicesTable"
import { PaymentTimeline } from "@/components/Customer/Invoices/PaymentTimeline"
import { InvoicesSkeleton } from "@/components/Customer/Invoices/InvoicesSkeleton"

function InvoicesContent() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <InvoicesHeader />
      <InvoicesSummaryCards />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InvoicesTable />
        <PaymentTimeline />
      </div>
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <Suspense fallback={<InvoicesSkeleton />}>
        <InvoicesContent />
      </Suspense>
    </div>
  )
}
