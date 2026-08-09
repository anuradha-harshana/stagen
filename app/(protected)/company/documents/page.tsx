import { Suspense } from "react"
import { CompanyDocumentsOverview } from "@/components/company/documents/CompanyDocumentsOverview"
import { CompanyDocumentsSkeleton } from "@/components/company/documents/CompanyDocumentsSkeleton"

export const metadata = {
  title: "Documents & Policies | Company Portal",
  description: "Manage global company documents and safety policies.",
}

export default function CompanyDocumentsPage() {
  return (
    <div className="flex flex-col gap-4 w-full px-5 py-4 font-cream">
      <Suspense fallback={<CompanyDocumentsSkeleton />}>
        <CompanyDocumentsOverview />
      </Suspense>
    </div>
  )
}
