import { Suspense } from "react"
import { CompanyDocumentsOverview } from "@/components/company/documents/CompanyDocumentsOverview"
import { CompanyDocumentsSkeleton } from "@/components/company/documents/CompanyDocumentsSkeleton"

export const metadata = {
  title: "Documents & Policies | Company Portal",
  description: "Manage global company documents and safety policies.",
}

export default function CompanyDocumentsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <Suspense fallback={<CompanyDocumentsSkeleton />}>
        <CompanyDocumentsOverview />
      </Suspense>
    </div>
  )
}
