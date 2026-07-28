"use client"

import React from "react"
import { MessageSquare, Clock, CheckCircle2, Building, CornerDownRight, Edit3, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QuestionItem } from "./AnswerQuestionModal"

interface CustomerQuestionsListProps {
  questions: QuestionItem[]
  onOpenAnswerModal: (question: QuestionItem) => void
  onDeleteQuestion?: (questionId: string) => void
}

export function CustomerQuestionsList({
  questions,
  onOpenAnswerModal,
  onDeleteQuestion,
}: CustomerQuestionsListProps) {
  const getStatusBadge = (status: QuestionItem["status"]) => {
    switch (status) {
      case "PENDING":
        return {
          icon: <Clock className="h-3 w-3 text-truffle-trouble animate-pulse" />,
          label: "Pending Reply",
          badge: "bg-burning-flame/20 text-truffle-trouble border-burning-flame/30 font-bold",
        }
      case "ANSWERED":
        return {
          icon: <CheckCircle2 className="h-3 w-3 text-truffle-trouble" />,
          label: "Answered",
          badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold",
        }
    }
  }

  return (
    <div className="space-y-3 font-cream">
      {questions.map((q) => {
        const statusCfg = getStatusBadge(q.status)

        return (
          <Card
            key={q.id}
            className="bg-palladian border border-blue-fantastic/15 shadow-xs hover:shadow-md hover:border-blue-fantastic/25 transition-all duration-200"
          >
            <CardContent className="p-5 flex flex-col gap-4 font-cream">
              {/* Header: Customer Info & Status */}
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-2xl bg-blue-fantastic flex items-center justify-center text-palladian text-xs font-bold shadow-xs shrink-0">
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
                      <span className="text-xs font-bold text-blue-fantastic/70 flex items-center gap-1">
                        <Building className="h-3 w-3 text-truffle-trouble" />
                        {q.projectCode} ({q.projectName})
                      </span>
                    </div>
                    <span className="text-[11px] text-blue-fantastic/50 font-medium">{q.dateAsked}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border border-blue-fantastic/20 bg-blue-fantastic/5 text-blue-fantastic/80 font-bold">
                    {q.category}
                  </Badge>
                  <Badge variant="outline" className={`text-xs border flex items-center gap-1 ${statusCfg.badge}`}>
                    {statusCfg.icon}
                    {statusCfg.label}
                  </Badge>
                </div>
              </div>

              {/* Question Body */}
              <div className="space-y-1 pl-1 border-l-2 border-burning-flame/40">
                <h3 className="text-base font-bold text-blue-fantastic font-cream">{q.questionTitle}</h3>
                <p className="text-xs text-blue-fantastic/80 leading-relaxed font-medium">
                  {q.questionDetails}
                </p>
              </div>

              {/* Display Official Answer if Answered */}
              {q.status === "ANSWERED" && q.answerText && (
                <div className="mt-1 p-3.5 bg-blue-fantastic/5 border border-blue-fantastic/15 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-truffle-trouble">
                      <CornerDownRight className="h-3.5 w-3.5 text-truffle-trouble" />
                      <span>Supervisor Official Response</span>
                    </div>
                    {q.answeredDate && (
                      <span className="text-[10px] text-blue-fantastic/50 font-medium">{q.answeredDate}</span>
                    )}
                  </div>
                  <p className="text-xs text-blue-fantastic/90 leading-relaxed font-medium">
                    {q.answerText}
                  </p>
                </div>
              )}

              {/* Card Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-blue-fantastic/10 mt-1">
                <div className="flex items-center gap-2">
                  {q.status === "PENDING" && (
                    <span className="text-[11px] font-bold text-burning-flame flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Needs response
                    </span>
                  )}
                  {q.status === "ANSWERED" && (
                    <span className="text-[11px] font-bold text-truffle-trouble flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Published to customer portal
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onDeleteQuestion && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onDeleteQuestion(q.id)}
                      className="text-blue-fantastic/40 hover:text-red-600 hover:bg-red-500/10 rounded-lg"
                      title="Delete question record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => onOpenAnswerModal(q)}
                    className={
                      q.status === "ANSWERED"
                        ? "bg-palladian border border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 font-bold rounded-xl h-8 text-xs gap-1.5"
                        : "bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 font-bold rounded-xl h-8 text-xs gap-1.5 shadow-xs"
                    }
                  >
                    {q.status === "ANSWERED" ? (
                      <>
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit Answer
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-3.5 w-3.5" />
                        Answer Question
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {questions.length === 0 && (
        <div className="py-12 text-center border border-dashed border-blue-fantastic/20 rounded-2xl bg-palladian/50 flex flex-col items-center justify-center gap-2 font-cream">
          <MessageSquare className="h-8 w-8 text-blue-fantastic/30" />
          <p className="text-sm font-bold text-blue-fantastic">No customer questions match your filter.</p>
          <p className="text-xs text-blue-fantastic/60 font-semibold">
            Try switching the project or clearing your search filter.
          </p>
        </div>
      )}
    </div>
  )
}
