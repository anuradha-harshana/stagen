"use client"

import React, { useState, useEffect } from "react"
import { MessageSquare, Send, X, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export interface QuestionItem {
  id: string
  projectCode: string
  projectName: string
  customerName: string
  customerAvatar?: string
  dateAsked: string
  category: string
  questionTitle: string
  questionDetails: string
  status: "PENDING" | "ANSWERED"
  answerText?: string
  answeredDate?: string
}

interface AnswerQuestionModalProps {
  question: QuestionItem | null
  isOpen: boolean
  onClose: () => void
  onSaveAnswer: (questionId: string, answerText: string, notifyCustomer: boolean) => void
}

export function AnswerQuestionModal({
  question,
  isOpen,
  onClose,
  onSaveAnswer,
}: AnswerQuestionModalProps) {
  const [answerText, setAnswerText] = useState("")
  const [notifyCustomer, setNotifyCustomer] = useState(true)

  useEffect(() => {
    if (question) {
      setAnswerText(question.answerText || "")
    } else {
      setAnswerText("")
    }
  }, [question])

  if (!isOpen || !question) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answerText.trim()) {
      toast.error("Please enter an answer before submitting.")
      return
    }

    onSaveAnswer(question.id, answerText.trim(), notifyCustomer)
    toast.success(`Answer published and sent to ${question.customerName}!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-2xl bg-palladian border border-blue-fantastic/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="bg-blue-fantastic/5 border-b border-blue-fantastic/10 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-xs text-burning-flame shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
                  Respond to Customer Inquiry
                </CardTitle>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-blue-fantastic/70 font-semibold">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-truffle-trouble" />
                    {question.customerName}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-truffle-trouble" />
                    {question.projectCode} ({question.projectName})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-blue-fantastic/10 text-blue-fantastic/60 hover:text-blue-fantastic transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-5 font-sans">
          {/* Customer Question Card Box */}
          <div className="p-4 bg-blue-fantastic/5 border border-blue-fantastic/15 rounded-2xl space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className="text-xs bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-bold">
                {question.category}
              </Badge>
              <span className="text-xs text-blue-fantastic/60 font-medium">{question.dateAsked}</span>
            </div>
            <h4 className="text-sm font-bold text-blue-fantastic">{question.questionTitle}</h4>
            <p className="text-xs text-blue-fantastic/80 leading-relaxed font-medium">
              {question.questionDetails}
            </p>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider font-sans flex items-center justify-between">
                <span>Supervisor Official Answer <span className="text-burning-flame">*</span></span>
                <span className="text-[11px] text-blue-fantastic/50 lowercase font-medium">Visible in Customer Portal</span>
              </label>
              <textarea
                rows={5}
                required
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your detailed, clear response for the customer..."
                className="w-full px-4 py-3 text-sm bg-palladian border border-blue-fantastic/20 rounded-2xl text-blue-fantastic placeholder:text-blue-fantastic/40 focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none transition-all font-medium font-sans resize-none"
              />
            </div>
            
            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-fantastic/10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 font-bold rounded-xl px-5 text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 font-bold rounded-xl px-6 text-xs h-9 gap-1.5 shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                Publish &amp; Send Answer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
