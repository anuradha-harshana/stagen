import { SupervisorDocumentsOverview } from "@/components/supervisor/documents/SupervisorDocumentsOverview"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export const metadata = {
  title: "Document Upload & Progress | Supervisor",
  description: "Upload site documents, certificates, reports, and progress updates for construction projects.",
}

export default function SupervisorDocumentsPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <SupervisorDocumentsOverview />
    </div>
  )
}
