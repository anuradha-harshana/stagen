import { Suspense } from "react"
import { SupervisorQuestionsOverview } from "@/components/supervisor/questions/SupervisorQuestionsOverview"
import { SupervisorQuestionsSkeleton } from "@/components/supervisor/questions/SupervisorQuestionsSkeleton"

export const metadata = {
  title: "Customer Questions & Answers | Supervisor",
  description: "Review, manage, and answer inquiries asked by home buyers and site customers.",
}

export default function SupervisorQuestionsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <Suspense fallback={<SupervisorQuestionsSkeleton />}>
        <SupervisorQuestionsOverview />
      </Suspense>
    </div>
  )
}
