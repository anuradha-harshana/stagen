"use client"

import React, { useState } from "react"
import { X, Plus, Mail, Bell, Bookmark } from "lucide-react"
import { DeliveryChannel, NotificationTemplate } from "./types"

interface NewTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (template: NotificationTemplate) => void
}

export function NewTemplateModal({
  isOpen,
  onClose,
  onCreate,
}: NewTemplateModalProps) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [channels, setChannels] = useState<DeliveryChannel[]>(["email", "in_app"])

  if (!isOpen) return null

  const handleToggleChannel = (ch: DeliveryChannel) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((item) => item !== ch) : [...prev, ch]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTemplate: NotificationTemplate = {
      id: `tmpl-${Date.now()}`,
      title: title.trim(),
      channels,
      subject: subject.trim() || `Update: ${title.trim()}`,
      body:
        body.trim() ||
        `Hello {{customer_name}},\n\nThis is an automated update regarding {{project_name}} for {{stage_name}}.\n\nThank you,\nStagen Team`,
      updatedAt: new Date().toISOString(),
    }

    onCreate(newTemplate)
    setTitle("")
    setSubject("")
    setBody("")
    setChannels(["email", "in_app"])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-abyssal-blue/60 backdrop-blur-xs flex items-center justify-center p-4 font-cream animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-abyssal-blue">
              Create New Template
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a new notification template to your portal.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-abyssal-blue hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Template Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Practical Completion Issued"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-burning-flame/40 focus:border-burning-flame"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Default Channels
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleToggleChannel("email")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  channels.includes("email")
                    ? "bg-abyssal-blue text-white border-abyssal-blue"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
              <button
                type="button"
                onClick={() => handleToggleChannel("in_app")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  channels.includes("in_app")
                    ? "bg-abyssal-blue text-white border-abyssal-blue"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                <Bell className="w-3.5 h-3.5" /> In-App
              </button>
              <button
                type="button"
                onClick={() => handleToggleChannel("push")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  channels.includes("push")
                    ? "bg-abyssal-blue text-white border-abyssal-blue"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> Push
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Update regarding {{project_name}}"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-burning-flame/40 focus:border-burning-flame"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Initial Message Body
            </label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type message content with {{variable}} tags..."
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-burning-flame/40 focus:border-burning-flame"
            />
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
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-burning-flame text-abyssal-blue font-bold text-xs shadow-sm hover:bg-burning-flame/90"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
