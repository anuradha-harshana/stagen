import { Suspense } from "react"
import { SupervisorDocumentsOverview } from "@/components/supervisor/documents/SupervisorDocumentsOverview"
import { SupervisorDocumentsSkeleton } from "@/components/supervisor/documents/SupervisorDocumentsSkeleton"

export const metadata = {
  title: "Document Upload & Progress | Supervisor",
  description: "Upload site documents, certificates, reports, and progress updates for construction projects.",
}

export default function SupervisorDocumentsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <Suspense fallback={<SupervisorDocumentsSkeleton />}>
        <SupervisorDocumentsOverview />
      </Suspense>
    </div>
  )
}
