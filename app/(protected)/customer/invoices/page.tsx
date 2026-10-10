import { InvoicesHeader } from "@/components/Customer/Invoices/InvoicesHeader"
import { InvoicesSummaryCards } from "@/components/Customer/Invoices/InvoicesSummaryCards"
import { InvoicesTable } from "@/components/Customer/Invoices/InvoicesTable"
import { PaymentTimeline } from "@/components/Customer/Invoices/PaymentTimeline"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export default function InvoicesPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <InvoicesHeader />
      <InvoicesSummaryCards />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InvoicesTable />
        <PaymentTimeline />
      </div>
    </div>
  )
}
