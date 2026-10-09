"use client"

import React, { useState } from "react"
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  Building,
  Send,
  Trash2,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { QuestionItem } from "./AnswerQuestionModal"

interface CustomerQuestionsListProps {
  questions: QuestionItem[]
  onOpenAnswerModal?: (question: QuestionItem) => void
  onDeleteQuestion?: (questionId: string) => void
  onAddQuestion?: (newQ: {
    category: string
    questionTitle: string
    questionDetails: string
    projectCode: string
    projectName: string
  }) => void
  onAddComment?: (questionId: string, commentText: string, isOfficialAnswer: boolean) => void
  onToggleLikeQuestion?: (questionId: string) => void
  onToggleLikeComment?: (questionId: string, commentId: string) => void
  userRole?: "SUPERVISOR" | "CUSTOMER"
}

export function CustomerQuestionsList({
  questions,
  onDeleteQuestion,
  onAddComment,
  userRole = "SUPERVISOR",
}: CustomerQuestionsListProps) {
  // Comment Inputs per Question ID
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  // Dropdown collapse/expand state for comments (default hidden)
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})

  const toggleComments = (id: string) => {
    setOpenComments((prev) => ({ ...prev, [id]: !(prev[id] ?? false) }))
  }

  const handleCommentSubmit = (questionId: string) => {
    const text = commentInputs[questionId]?.trim()
    if (!text) return

    const isOfficial = userRole === "SUPERVISOR"

    if (onAddComment) {
      onAddComment(questionId, text, isOfficial)
    }

    setCommentInputs((prev) => ({ ...prev, [questionId]: "" }))

    // Ensure comment section is expanded when adding a comment
    setOpenComments((prev) => ({ ...prev, [questionId]: true }))

    toast.success("Comment added.")
  }

  return (
    <div className="space-y-4 font-sans">
      {questions.map((q) => {
        const commentsList = q.comments || []
        const isCommentsOpen = openComments[q.id] ?? false

        return (
          <Card
            key={q.id}
            className="bg-white border border-blue-fantastic/15 shadow-xs hover:border-blue-fantastic/30 transition-all rounded-2xl overflow-hidden font-sans"
          >
            <CardContent className="p-5 space-y-4 font-sans">
              {/* CARD HEADER */}
              <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-blue-fantastic/10">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-fantastic flex items-center justify-center text-palladian text-xs font-bold shadow-xs shrink-0">
                    {q.customerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-blue-fantastic">{q.customerName}</span>
                      <span className="text-xs text-blue-fantastic/40">•</span>
                      <span className="text-xs font-semibold text-blue-fantastic/70 flex items-center gap-1">
                        <Building className="h-3 w-3 text-truffle-trouble" />
                        {q.projectCode} ({q.projectName})
                      </span>
                    </div>
                    <span className="text-[11px] text-blue-fantastic/50 font-medium">{q.dateAsked}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-blue-fantastic/20 bg-blue-fantastic/5 text-blue-fantastic/80 font-bold">
                    {q.category}
                  </Badge>

                  {q.status === "PENDING" ? (
                    <Badge variant="outline" className="text-xs bg-burning-flame/20 text-truffle-trouble border-burning-flame/30 font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3 text-truffle-trouble" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-truffle-trouble" />
                      Answered
                    </Badge>
                  )}

                  {onDeleteQuestion && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onDeleteQuestion(q.id)}
                      className="text-blue-fantastic/30 hover:text-red-600 hover:bg-red-500/10 rounded-lg ml-1"
                      title="Delete question"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* QUESTION DETAILS */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-blue-fantastic font-sans">{q.questionTitle}</h3>
                <p className="text-xs text-blue-fantastic/80 leading-relaxed font-medium">
                  {q.questionDetails}
                </p>
              </div>

              {/* COMMENT SECTION HEADER WITH DROPDOWN TOGGLE (CHEVRON ICON) */}
              <div className="pt-2 border-t border-blue-fantastic/10 font-sans space-y-3">
                <button
                  type="button"
                  onClick={() => toggleComments(q.id)}
                  className="w-full flex items-center justify-between py-1 text-xs font-bold text-blue-fantastic/70 hover:text-blue-fantastic transition-colors font-sans group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 uppercase tracking-wider">
                    <MessageSquare className="h-3.5 w-3.5 text-truffle-trouble" />
                    <span>Comments ({commentsList.length})</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-blue-fantastic/60 group-hover:text-blue-fantastic font-semibold">
                    <span>{isCommentsOpen ? "Hide" : "Show"}</span>
                    {isCommentsOpen ? (
                      <ChevronUp className="h-4 w-4 text-truffle-trouble transition-transform" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-truffle-trouble transition-transform" />
                    )}
                  </div>
                </button>

                {/* EXPANDABLE COMMENT SECTION CONTENT */}
                {isCommentsOpen && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    {/* COMMENTS LIST */}
                    {commentsList.length > 0 && (
                      <div className="space-y-2.5">
                        {commentsList.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              c.isOfficialAnswer
                                ? "bg-truffle-trouble/10 border border-truffle-trouble/30"
                                : "bg-surface-muted/60 border border-blue-fantastic/10"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-bold text-blue-fantastic">
                                <User className="h-3 w-3 text-truffle-trouble" />
                                <span>{c.authorName}</span>
                                {c.isOfficialAnswer && (
                                  <Badge className="text-[9px] bg-truffle-trouble text-palladian font-bold px-1.5 py-0 border-none">
                                    <ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> Supervisor Answer
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[10px] text-blue-fantastic/50 font-medium">{c.timestamp}</span>
                            </div>
                            <p className="text-blue-fantastic/90 font-medium leading-relaxed">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* INLINE COMMENT INPUT BOX */}
                    <div className="flex items-center gap-2 pt-1 font-sans">
                      <input
                        type="text"
                        value={commentInputs[q.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleCommentSubmit(q.id)
                          }
                        }}
                        placeholder={
                          userRole === "SUPERVISOR"
                            ? "Write a comment or official answer..."
                            : "Write a comment..."
                        }
                        className="flex-1 px-3.5 py-2 text-xs bg-white border border-blue-fantastic/20 rounded-xl text-blue-fantastic placeholder:text-blue-fantastic/40 focus:border-truffle-trouble outline-none font-medium"
                      />

                      <Button
                        size="sm"
                        onClick={() => handleCommentSubmit(q.id)}
                        className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 font-bold rounded-xl h-8 px-3 text-xs gap-1 shadow-xs shrink-0"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Send</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {questions.length === 0 && (
        <div className="py-12 text-center border border-dashed border-blue-fantastic/20 rounded-2xl bg-surface-muted flex flex-col items-center justify-center gap-2 font-sans">
          <MessageSquare className="h-8 w-8 text-blue-fantastic/30" />
          <p className="text-sm font-bold text-blue-fantastic">No customer questions found.</p>
        </div>
      )}
    </div>
  )
}
