"use client"

import React, { useState } from "react"
import { X, Send, Mail, CheckCircle2 } from "lucide-react"
import { NotificationTemplate } from "./types"
import { toast } from "sonner"

interface SendTestModalProps {
  template: NotificationTemplate | null
  isOpen: boolean
  onClose: () => void
}

export function SendTestModal({
  template,
  isOpen,
  onClose,
}: SendTestModalProps) {
  const [recipient, setRecipient] = useState("admin@stagen.com")
  const [isSending, setIsSending] = useState(false)

  if (!isOpen || !template) return null

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    setTimeout(() => {
      setIsSending(false)
      toast.success(
        `Test notification for "${template.title}" sent to ${recipient}!`
      )
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 bg-abyssal-blue/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-blue-fantastic/15 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-burning-flame/20 text-abyssal-blue rounded-xl">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-abyssal-blue">
                Send Test Notification
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {template.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-abyssal-blue hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-surface-inset border border-blue-fantastic/15 flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Selected Channels
            </span>
            <div className="flex items-center gap-2">
              {template.channels.map((ch) => (
                <span
                  key={ch}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-blue-fantastic/15 text-abyssal-blue rounded-lg capitalize"
                >
                  {ch.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Test Recipient Email / Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="test@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-fantastic/15 text-sm focus:outline-none focus:ring-2 focus:ring-burning-flame/40 focus:border-burning-flame"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-burning-flame text-abyssal-blue font-bold text-xs shadow-sm hover:bg-burning-flame/90 transition-all disabled:opacity-50"
            >
              {isSending ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Dispatch Test
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
