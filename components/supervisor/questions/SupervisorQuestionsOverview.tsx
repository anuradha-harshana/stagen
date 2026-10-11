"use client"

import { useSupervisorData, supervisorRequest, DataState } from "@/components/supervisor/useSupervisorData";
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

  const api = useSupervisorData<QuestionItem[]>("questions", []);
  const questions = api.data;
  const projectApi = useSupervisorData<{ id: string; lot: string }[]>("projects", []);
  const projectOptions = [{ code: "ALL", name: "All Projects" }, ...projectApi.data.map(p => ({ code: p.id, name: p.lot }))];

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

  const handleSaveAnswer = async (id: string, answerText: string, notifyCustomer: boolean) => api.mutate("PUT", { id, answerText, notifyCustomer });
  const handleAddComment = async (id: string, commentText: string, isOfficialAnswer: boolean) => api.mutate("PATCH", { id, commentText, isOfficialAnswer });
  const handleToggleLikeQuestion = async (id: string) => api.mutate("PATCH", { id, like: !questions.find(q => q.id === id)?.isLiked });
  const handleToggleLikeComment = async (id: string, commentId: string) => api.mutate("PATCH", { id, commentId, like: !questions.find(q => q.id === id)?.comments?.find(c => c.id === commentId)?.isLiked });
  const handleDeleteQuestion = async (id: string) => { if (confirm("Remove this question record?")) await api.mutate("DELETE", { id }); };
  if (api.loading || api.error || projectApi.error) return <DataState loading={api.loading} error={api.error || projectApi.error} />;
  return (
    <div className="flex flex-col gap-4 w-full font-sans">
      {/* Header */}
      <SupervisorQuestionsHeader
        projects={projectOptions}
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
