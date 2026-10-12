import { CompanyBillingOverview } from "@/components/company/billing/CompanyBillingOverview"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export const metadata = {
  title: "Billing & Licences | Company Portal",
  description: "Manage your subscription, payment methods, and invoices.",
}

export default function CompanyBillingPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <CompanyBillingOverview />
    </div>
  )
}
