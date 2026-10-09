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
import { AnswerQuestionModal, QuestionItem, CommentItem } from "./AnswerQuestionModal"

export function SupervisorQuestionsOverview() {
  const [selectedProject, setSelectedProject] = useState(SUPERVISOR_PROJECTS[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<QuestionStatusFilter>("ALL")
  const [categoryFilter, setCategoryFilter] = useState<QuestionCategoryFilter>("ALL")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem | null>(null)

  // Initial Questions Dataset with Facebook Comment Threads & Likes
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
      likesCount: 3,
      isLiked: false,
      comments: [
        {
          id: "c-101-1",
          authorName: "Marcus Vance",
          authorRole: "CUSTOMER",
          content: "We also noticed electrical rough-in was completed on Tuesday, looking forward to the update!",
          timestamp: "Jul 22, 2026 - 3:00 PM",
          likes: 2,
          isLiked: false,
        },
      ],
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
      likesCount: 2,
      isLiked: false,
      comments: [],
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
        "Just checking if concrete pour 28-day compression test results were verified by the structural engineer.",
      status: "ANSWERED",
      answerText:
        "Hi Sarah & Marcus, concrete compression test results achieved 32 MPa (exceeding 25 MPa design requirement). Engineer approval certificate is uploaded in your document tab.",
      answeredDate: "Jul 19, 2026 - 9:40 AM",
      likesCount: 5,
      isLiked: true,
      comments: [
        {
          id: "c-103-1",
          authorName: "Marcus (Site Supervisor)",
          authorRole: "SUPERVISOR",
          content: "Hi Sarah & Marcus, concrete compression test results achieved 32 MPa (exceeding 25 MPa design requirement). Engineer approval certificate is uploaded in your document tab.",
          timestamp: "Jul 19, 2026 - 9:40 AM",
          isOfficialAnswer: true,
          likes: 4,
          isLiked: true,
        },
        {
          id: "c-103-2",
          authorName: "Sarah Vance",
          authorRole: "CUSTOMER",
          content: "Thank you so much Marcus! We verified the certificate in our customer document portal.",
          timestamp: "Jul 19, 2026 - 10:15 AM",
          likes: 2,
          isLiked: false,
        },
      ],
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
      likesCount: 1,
      isLiked: false,
      comments: [],
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
      likesCount: 4,
      isLiked: false,
      comments: [
        {
          id: "c-105-1",
          authorName: "Site Supervisor",
          authorRole: "SUPERVISOR",
          content: "Hi Robert, I have added variation request #VAR-204 to your portal. You can review and approve it directly in the Invoices & Variations section.",
          timestamp: "Jul 21, 2026 - 10:15 AM",
          isOfficialAnswer: true,
          likes: 3,
          isLiked: false,
        },
        {
          id: "c-105-2",
          authorName: "Robert Chen",
          authorRole: "CUSTOMER",
          content: "Awesome, approved! Thanks for the quick response.",
          timestamp: "Jul 21, 2026 - 11:00 AM",
          likes: 1,
          isLiked: false,
        },
      ],
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
      likesCount: 2,
      isLiked: false,
      comments: [],
    },
    {
      id: "q-107",
      projectCode: "PRO-236",
      projectName: "Parkview Residence",
      customerName: "Harrison Ford",
      dateAsked: "Jul 19, 2026 - 5:45 PM",
      category: "Inspections & Sign-off",
      questionTitle: "When is the frame stage sign-off expected from local council?",
      questionDetails:
        "Council inspector came yesterday morning. Has the formal certificate arrived?",
      status: "PENDING",
      likesCount: 1,
      isLiked: false,
      comments: [],
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
    const todayFormatted =
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " - " +
      new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newComment: CommentItem = {
            id: `ans-${Date.now()}`,
            authorName: "Supervisor Official Response",
            authorRole: "SUPERVISOR",
            content: answerText,
            timestamp: todayFormatted,
            isOfficialAnswer: true,
            likes: 1,
            isLiked: false,
          }

          const updatedComments = [
            ...(q.comments || []).filter((c) => !c.isOfficialAnswer),
            newComment,
          ]

          return {
            ...q,
            status: "ANSWERED",
            answerText,
            answeredDate: todayFormatted,
            comments: updatedComments,
          }
        }
        return q
      })
    )

    if (notifyCustomer) {
      toast.info(`Sent answer notification email & SMS to customer.`)
    }
  }

  const handleAddQuestion = (newQ: {
    category: string
    questionTitle: string
    questionDetails: string
    projectCode: string
    projectName: string
  }) => {
    const todayFormatted =
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " - " +
      new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

    const newItem: QuestionItem = {
      id: `q-${Date.now()}`,
      projectCode: newQ.projectCode,
      projectName: newQ.projectName,
      customerName: "Current User / Buyer",
      dateAsked: todayFormatted,
      category: newQ.category,
      questionTitle: newQ.questionTitle,
      questionDetails: newQ.questionDetails,
      status: "PENDING",
      likesCount: 1,
      isLiked: true,
      comments: [],
    }

    setQuestions((prev) => [newItem, ...prev])
  }

  const handleAddComment = (
    questionId: string,
    commentText: string,
    isOfficialAnswer: boolean
  ) => {
    const todayFormatted =
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " - " +
      new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newComment: CommentItem = {
            id: `c-${Date.now()}`,
            authorName: isOfficialAnswer ? "Supervisor Official Response" : "Site Manager",
            authorRole: isOfficialAnswer ? "SUPERVISOR" : "SUPERVISOR",
            content: commentText,
            timestamp: todayFormatted,
            isOfficialAnswer,
            likes: 1,
            isLiked: false,
          }

          let newStatus = q.status
          let newAnswerText = q.answerText
          let newAnsweredDate = q.answeredDate

          if (isOfficialAnswer) {
            newStatus = "ANSWERED"
            newAnswerText = commentText
            newAnsweredDate = todayFormatted
          }

          const existingComments = q.comments || []
          const updatedComments = isOfficialAnswer
            ? [...existingComments.filter((c) => !c.isOfficialAnswer), newComment]
            : [...existingComments, newComment]

          return {
            ...q,
            status: newStatus,
            answerText: newAnswerText,
            answeredDate: newAnsweredDate,
            comments: updatedComments,
          }
        }
        return q
      })
    )
  }

  const handleToggleLikeQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const isLiked = !q.isLiked
          const count = (q.likesCount || 0) + (isLiked ? 1 : -1)
          return { ...q, isLiked, likesCount: Math.max(0, count) }
        }
        return q
      })
    )
  }

  const handleToggleLikeComment = (questionId: string, commentId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const updatedComments = (q.comments || []).map((c) => {
            if (c.id === commentId) {
              const isLiked = !c.isLiked
              const likes = (c.likes || 0) + (isLiked ? 1 : -1)
              return { ...c, isLiked, likes: Math.max(0, likes) }
            }
            return c
          })
          return { ...q, comments: updatedComments }
        }
        return q
      })
    )
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("Are you sure you want to remove this question record?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId))
      toast.success("Question record removed.")
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full font-sans">
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

      {/* Facebook Style Customer Questions Feed */}
      <CustomerQuestionsList
        questions={filteredQuestions}
        onOpenAnswerModal={handleOpenAnswerModal}
        onDeleteQuestion={handleDeleteQuestion}
        onAddQuestion={handleAddQuestion}
        onAddComment={handleAddComment}
        onToggleLikeQuestion={handleToggleLikeQuestion}
        onToggleLikeComment={handleToggleLikeComment}
        userRole="SUPERVISOR"
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
