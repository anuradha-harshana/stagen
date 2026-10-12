import { SupervisorQuestionsOverview } from "@/components/supervisor/questions/SupervisorQuestionsOverview"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export const metadata = {
  title: "Customer Questions & Answers | Supervisor",
  description: "Review, manage, and answer inquiries asked by home buyers and site customers.",
}

export default function SupervisorQuestionsPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <SupervisorQuestionsOverview />
    </div>
  )
}
