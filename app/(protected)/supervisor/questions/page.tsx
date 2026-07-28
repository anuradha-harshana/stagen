import { Suspense } from "react"
import { SupervisorQuestionsOverview } from "@/components/supervisor/questions/SupervisorQuestionsOverview"
import { SupervisorQuestionsSkeleton } from "@/components/supervisor/questions/SupervisorQuestionsSkeleton"

export const metadata = {
  title: "Customer Questions & Answers | Supervisor",
  description: "Review, manage, and answer inquiries asked by home buyers and site customers.",
}

export default function SupervisorQuestionsPage() {
  return (
    <div className="flex flex-col gap-4 w-full px-5 font-cream">
      <Suspense fallback={<SupervisorQuestionsSkeleton />}>
        <SupervisorQuestionsOverview />
      </Suspense>
    </div>
  )
}
