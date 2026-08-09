"use client"

import React, { useState } from "react"
import { X, Plus, Zap, Mail, Bell, Bookmark } from "lucide-react"
import { AutomationRule, NotificationTemplate, TriggerEventType, DeliveryChannel } from "./types"

interface AddRuleModalProps {
  isOpen: boolean
  templates: NotificationTemplate[]
  onClose: () => void
  onAddRule: (rule: AutomationRule) => void
}

const TRIGGER_EVENTS: { type: TriggerEventType; label: string }[] = [
  { type: "stage_completed", label: "Stage Completed" },
  { type: "milestone_overdue", label: "Milestone Overdue" },
  { type: "document_uploaded", label: "New Document Uploaded" },
  { type: "invoice_issued", label: "Invoice Issued" },
  { type: "inspection_scheduled", label: "Inspection Scheduled" },
  { type: "warranty_claim_submitted", label: "Warranty Claim Submitted" },
]

export function AddRuleModal({
  isOpen,
  templates,
  onClose,
  onAddRule,
}: AddRuleModalProps) {
  const [ruleName, setRuleName] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<TriggerEventType>("stage_completed")
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    templates[0]?.id || ""
  )
  const [targetRoles, setTargetRoles] = useState<string[]>(["customer"])
  const [channels, setChannels] = useState<DeliveryChannel[]>(["email", "in_app"])

  if (!isOpen) return null

  const handleToggleRole = (role: string) => {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const handleToggleChannel = (ch: DeliveryChannel) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ruleName.trim()) return

    const matchedTemplate = templates.find((t) => t.id === selectedTemplateId)
    const eventObj = TRIGGER_EVENTS.find((ev) => ev.type === selectedEvent)

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: ruleName.trim(),
      event: selectedEvent,
      eventLabel: eventObj?.label || selectedEvent,
      templateId: selectedTemplateId,
      templateName: matchedTemplate?.title || "Custom Template",
      targetRoles,
      channels,
      active: true,
    }

    onAddRule(newRule)
    setRuleName("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-abyssal-blue/60 backdrop-blur-xs flex items-center justify-center p-4 font-cream animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-burning-flame/20 text-truffle-trouble rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-abyssal-blue">
                Add Automation Rule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically trigger notifications based on site events.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Rule Name *
            </label>
            <input
              type="text"
              required
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="e.g. Auto Notify Customer on Stage Finish"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-burning-flame/40 focus:border-burning-flame"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Trigger Event *
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value as TriggerEventType)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-abyssal-blue focus:outline-none focus:ring-2 focus:ring-burning-flame/40"
            >
              {TRIGGER_EVENTS.map((ev) => (
                <option key={ev.type} value={ev.type}>
                  {ev.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Message Template *
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-abyssal-blue focus:outline-none focus:ring-2 focus:ring-burning-flame/40"
            >
              {templates.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Recipients
            </label>
            <div className="flex items-center gap-2">
              {["customer", "supervisor", "company-admin"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleToggleRole(role)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold capitalize ${
                    targetRoles.includes(role)
                      ? "bg-abyssal-blue text-white border-abyssal-blue"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {role.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Channels
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
              Add Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
