import { Suspense } from "react"
import { SupervisorDocumentsOverview } from "@/components/supervisor/documents/SupervisorDocumentsOverview"
import { SupervisorDocumentsSkeleton } from "@/components/supervisor/documents/SupervisorDocumentsSkeleton"

export const metadata = {
  title: "Document Upload & Progress | Supervisor",
  description: "Upload site documents, certificates, reports, and progress updates for construction projects.",
}

export default function SupervisorDocumentsPage() {
  return (
    <div className="flex flex-col gap-4 w-full px-5">
      <Suspense fallback={<SupervisorDocumentsSkeleton />}>
        <SupervisorDocumentsOverview />
      </Suspense>
    </div>
  )
}
