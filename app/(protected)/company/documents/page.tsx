import { CompanyDocumentsOverview } from "@/components/company/documents/CompanyDocumentsOverview"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export const metadata = {
  title: "Documents & Policies | Company Portal",
  description: "Manage global company documents and safety policies.",
}

export default function CompanyDocumentsPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <CompanyDocumentsOverview />
    </div>
  )
}
