"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import {
  SupervisorQuestionsHeader,
  SUPERVISOR_PROJECTS,
} from "./SupervisorQuestionsHeader"
import { SupervisorQuestionsSummaryCards } from "./SupervisorQuestionsSummaryCards"
import {
  QuestionsFilterBar,
  QuestionStatusFilter,
  QuestionCategoryFilter,
} from "./QuestionsFilterBar"
import { CustomerQuestionsList } from "./CustomerQuestionsList"
import { AnswerQuestionModal, QuestionItem } from "./AnswerQuestionModal"

export function SupervisorQuestionsOverview() {
  const [selectedProject, setSelectedProject] = useState(SUPERVISOR_PROJECTS[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<QuestionStatusFilter>("ALL")
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategoryFilter>("ALL")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem | null>(null)

  // Initial Questions Dataset
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: "q-101",
      projectCode: "PRO-233",
      projectName: "Groove Inn",
      customerName: "Marcus & Sarah Vance",
      dateAsked: "Jul 22, 2026 - 2:30 PM",
      category: "Inspections & Sign-off",
      questionTitle: "When will the wall framing inspection take place?",
      questionDetails:
        "Hi Marcus, we noticed wall framing stage 2 was completed yesterday. Could you confirm if the structural inspector sign-off will happen this Friday?",
      status: "PENDING",
    },
    {
      id: "q-102",
      projectCode: "PRO-233",
      projectName: "Groove Inn",
      customerName: "David Miller",
      dateAsked: "Jul 21, 2026 - 4:15 PM",
      category: "Materials & Specs",
      questionTitle: "Can we request an upgrade for the living room timber laminate flooring?",
      questionDetails:
        "We saw the standard specification sample on site and would like to confirm if we can select Oak Natural grade 1 instead of standard Oak.",
      status: "PENDING",
    },
    {
      id: "q-103",
      projectCode: "PRO-233",
      projectName: "Groove Inn",
      customerName: "Marcus & Sarah Vance",
      dateAsked: "Jul 18, 2026 - 11:00 AM",
      category: "Build Progress",
      questionTitle: "Is the slab concrete cure test completed?",
      questionDetails:
        "Just checking if concrete pour 28-day compression test results were verified by the engineer.",
      status: "ANSWERED",
      answerText:
        "Hi Sarah & Marcus, concrete compression test results achieved 32 MPa (exceeding 25 MPa design requirement). Engineer approval certificate is uploaded in your document tab.",
      answeredDate: "Jul 19, 2026 - 9:40 AM",
    },
    {
      id: "q-104",
      projectCode: "PRO-234",
      projectName: "Sunset Villas",
      customerName: "Jessica & Liam Wong",
      dateAsked: "Jul 22, 2026 - 9:00 AM",
      category: "Timeline & Handover",
      questionTitle: "Will the roof tile installation be delayed by rainfall this week?",
      questionDetails:
        "Weather forecast shows rain on Thursday. Will the roof capping and sarking be completed before rain starts?",
      status: "PENDING",
    },
    {
      id: "q-105",
      projectCode: "PRO-234",
      projectName: "Sunset Villas",
      customerName: "Robert Chen",
      dateAsked: "Jul 20, 2026 - 1:20 PM",
      category: "Variations & Costs",
      questionTitle: "Where do we upload variation request for outdoor alfresco power points?",
      questionDetails:
        "We want two extra weatherproof IP66 power outlets on the outdoor alfresco pillar.",
      status: "ANSWERED",
      answerText:
        "Hi Robert, I have added variation request #VAR-204 to your portal. You can review and approve it directly in the Invoices & Variations section.",
      answeredDate: "Jul 21, 2026 - 10:15 AM",
    },
    {
      id: "q-106",
      projectCode: "PRO-235",
      projectName: "Horizon Tower",
      customerName: "Elena Rostova",
      dateAsked: "Jul 21, 2026 - 3:00 PM",
      category: "Materials & Specs",
      questionTitle: "What brand of ducted HVAC system is installed on Level 4?",
      questionDetails:
        "Could you confirm the exact model and warranty coverage for the air conditioning system?",
      status: "PENDING",
    },
    {
      id: "7",
      projectCode: "PRO-236",
      projectName: "Parkview Residence",
      customerName: "Harrison Ford",
      dateAsked: "Jul 19, 2026 - 5:45 PM",
      category: "Inspections & Sign-off",
      questionTitle: "When is the frame stage sign-off expected from local council?",
      questionDetails:
        "Council inspector came yesterday morning. Has the formal certificate arrived?",
      status: "PENDING",
    },
  ])

  // Filtered dataset
  const filteredQuestions = questions.filter((q) => {
    // 1. Site Filter
    if (selectedProject.code !== "ALL" && q.projectCode !== selectedProject.code) {
      return false
    }

    // 2. Status Filter
    if (statusFilter !== "ALL" && q.status !== statusFilter) {
      return false
    }

    // 3. Category Filter
    if (categoryFilter !== "ALL" && q.category !== categoryFilter) {
      return false
    }

    // 4. Search Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      const matchTitle = q.questionTitle.toLowerCase().includes(query)
      const matchDetails = q.questionDetails.toLowerCase().includes(query)
      const matchCustomer = q.customerName.toLowerCase().includes(query)
      return matchTitle || matchDetails || matchCustomer
    }

    return true
  })

  // Calculate project-aware summary stats
  const activeSiteQuestions =
    selectedProject.code === "ALL"
      ? questions
      : questions.filter((q) => q.projectCode === selectedProject.code)

  const pendingCount = activeSiteQuestions.filter((q) => q.status === "PENDING").length
  const answeredCount = activeSiteQuestions.filter((q) => q.status === "ANSWERED").length

  // Handlers
  const handleOpenAnswerModal = (question: QuestionItem) => {
    setActiveQuestion(question)
    setIsModalOpen(true)
  }

  const handleSaveAnswer = (
    questionId: string,
    answerText: string,
    notifyCustomer: boolean
  ) => {
    const todayFormatted = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " - " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            status: "ANSWERED",
            answerText,
            answeredDate: todayFormatted,
          }
        }
        return q
      })
    )

    if (notifyCustomer) {
      toast.info(`Sent answer notification email & SMS to customer.`)
    }
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("Are you sure you want to remove this question record?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
      toast.success("Question record removed.")
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full font-cream">
      {/* Header */}
      <SupervisorQuestionsHeader
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Summary KPI Cards */}
      <SupervisorQuestionsSummaryCards
        totalCount={activeSiteQuestions.length}
        pendingCount={pendingCount}
        answeredCount={answeredCount}
        selectedProjectName={
          selectedProject.code === "ALL"
            ? "Across All Projects"
            : `${selectedProject.code} · ${selectedProject.name}`
        }
      />

      {/* Filter Bar */}
      <QuestionsFilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        counts={{
          all: activeSiteQuestions.length,
          pending: pendingCount,
          answered: answeredCount,
        }}
      />

      {/* Customer Questions List */}
      <CustomerQuestionsList
        questions={filteredQuestions}
        onOpenAnswerModal={handleOpenAnswerModal}
        onDeleteQuestion={handleDeleteQuestion}
      />

      {/* Answer Modal */}
      <AnswerQuestionModal
        question={activeQuestion}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveAnswer={handleSaveAnswer}
      />
    </div>
  )
}
