"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Save, Mail, Bell, Bookmark, Eye, Check } from "lucide-react"
import { NotificationTemplate, DeliveryChannel, TemplateVariable } from "./types"
import { toast } from "sonner"

interface TemplateEditorProps {
  template: NotificationTemplate | null
  onSave: (updated: NotificationTemplate) => void
  onSendTest: (template: NotificationTemplate) => void
}

const AVAILABLE_VARIABLES: TemplateVariable[] = [
  { key: "{{project_name}}", label: "Project Name" },
  { key: "{{stage_name}}", label: "Stage Name" },
  { key: "{{customer_name}}", label: "Customer Name" },
  { key: "{{due_date}}", label: "Due Date" },
  { key: "{{supervisor_name}}", label: "Supervisor Name" },
  { key: "{{document_name}}", label: "Document Name" },
]

export function TemplateEditor({
  template,
  onSave,
  onSendTest,
}: TemplateEditorProps) {
  const [formData, setFormData] = useState<NotificationTemplate | null>(template)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setFormData(template)
  }, [template])

  if (!formData) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-blue-fantastic/15 flex flex-col items-center justify-center text-center font-sans h-full min-h-[400px]">
        <div className="w-12 h-12 rounded-full bg-oatmeal/30 flex items-center justify-center text-abyssal-blue mb-4">
          <Bell className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-abyssal-blue">No Template Selected</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Select a template from the list on the left to edit its message subject, body, and channels.
        </p>
      </div>
    )
  }

  const handleToggleChannel = (channel: DeliveryChannel) => {
    setFormData((prev) => {
      if (!prev) return null
      const exists = prev.channels.includes(channel)
      const newChannels = exists
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel]
      return { ...prev, channels: newChannels }
    })
  }

  const handleInsertVariable = (varKey: string) => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.body
    const newText = text.substring(0, start) + varKey + text.substring(end)
    
    setFormData((prev) => (prev ? { ...prev, body: newText } : null))

    // Reset focus and position cursor after inserted variable
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + varKey.length, start + varKey.length)
    }, 50)
  }

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Template title cannot be empty")
      return
    }
    onSave(formData)
    toast.success("Template saved successfully!")
  }

  // Rendered preview replace
  const renderPreviewText = (text: string) => {
    return text
      .replace(/\{\{project_name\}\}/g, "Oakwood Heights Villa")
      .replace(/\{\{stage_name\}\}/g, "Frame & Structure Approval")
      .replace(/\{\{customer_name\}\}/g, "Sarah Jenkins")
      .replace(/\{\{due_date\}\}/g, "August 15, 2026")
      .replace(/\{\{supervisor_name\}\}/g, "Michael Vance")
      .replace(/\{\{document_name\}\}/g, "Structural_Engineering_Report.pdf")
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-fantastic/15 shadow-sm flex flex-col gap-6 font-sans">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Template Configuration
          </span>
          <h2 className="text-2xl font-bold text-abyssal-blue mt-0.5">
            Editing: {formData.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-blue-fantastic/15 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            {isPreviewOpen ? "Hide Preview" : "Live Preview"}
          </button>

          <button
            onClick={() => onSendTest(formData)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-abyssal-blue font-semibold text-xs transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            Send Test
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-burning-flame hover:bg-burning-flame/90 text-abyssal-blue font-bold text-xs shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Template
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      {isPreviewOpen && (
        <div className="p-5 rounded-2xl bg-surface-inset border border-blue-fantastic/15 flex flex-col gap-3 transition-all animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-abyssal-blue">
              Sample Customer View Preview
            </span>
            <div className="flex gap-2">
              {formData.channels.map((ch) => (
                <span
                  key={ch}
                  className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-abyssal-blue/10 text-abyssal-blue rounded-md"
                >
                  {ch.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-fantastic/15 text-sm shadow-xs">
            <p className="font-bold text-abyssal-blue border-b border-slate-100 pb-2 mb-2">
              {renderPreviewText(formData.subject || "(No Subject)")}
            </p>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {renderPreviewText(formData.body || "(No Body Content)")}
            </p>
          </div>
        </div>
      )}

      {/* Delivery Channels */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Delivery Channels
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => handleToggleChannel("email")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
              formData.channels.includes("email")
                ? "border-abyssal-blue bg-abyssal-blue text-white shadow-xs"
                : "border-blue-fantastic/15 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email
            {formData.channels.includes("email") && <Check className="w-3 h-3 ml-1" />}
          </button>

          <button
            type="button"
            onClick={() => handleToggleChannel("in_app")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
              formData.channels.includes("in_app")
                ? "border-abyssal-blue bg-abyssal-blue text-white shadow-xs"
                : "border-blue-fantastic/15 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            In-App
            {formData.channels.includes("in_app") && <Check className="w-3 h-3 ml-1" />}
          </button>

          <button
            type="button"
            onClick={() => handleToggleChannel("push")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
              formData.channels.includes("push")
                ? "border-abyssal-blue bg-abyssal-blue text-white shadow-xs"
                : "border-blue-fantastic/15 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Push Notification
            {formData.channels.includes("push") && <Check className="w-3 h-3 ml-1" />}
          </button>
        </div>
      </div>

      {/* Subject Line */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-700">Subject Line</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) =>
            setFormData((prev) => (prev ? { ...prev, subject: e.target.value } : null))
          }
          placeholder="Enter notification subject..."
          className="w-full px-4 py-2.5 rounded-xl border border-blue-fantastic/15 bg-white text-sm text-abyssal-blue focus:outline-none focus:ring-2 focus:ring-burning-flame/40 focus:border-burning-flame transition-all"
        />
      </div>

      {/* Message Body */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">Message Body</label>
          <span className="text-xs font-semibold text-truffle-trouble hover:underline cursor-pointer">
            Insert Variable
          </span>
        </div>

        {/* Dynamic Variable Chips */}
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-blue-fantastic/15 rounded-xl">
          {AVAILABLE_VARIABLES.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => handleInsertVariable(v.key)}
              title={`Click to insert ${v.label}`}
              className="px-2.5 py-1 bg-white border border-blue-fantastic/15 rounded-lg text-xs font-mono text-slate-700 hover:border-burning-flame hover:bg-burning-flame/10 hover:text-abyssal-blue transition-all shadow-2xs"
            >
              {v.key}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={7}
          value={formData.body}
          onChange={(e) =>
            setFormData((prev) => (prev ? { ...prev, body: e.target.value } : null))
          }
          placeholder="Type your message body here..."
          className="w-full p-4 rounded-2xl border border-blue-fantastic/15 bg-white text-sm text-abyssal-blue focus:outline-none focus:ring-2 focus:ring-burning-flame/40 focus:border-burning-flame transition-all leading-relaxed font-sans"
        />
      </div>
    </div>
  )
}
