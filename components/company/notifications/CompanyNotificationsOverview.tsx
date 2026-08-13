"use client"

import React, { useState } from "react"
import { CompanyNotificationsHeader } from "./CompanyNotificationsHeader"
import { MessageTemplatesList } from "./MessageTemplatesList"
import { TemplateEditor } from "./TemplateEditor"
import { AutomationRulesList } from "./AutomationRulesList"
import { NewTemplateModal } from "./NewTemplateModal"
import { SendTestModal } from "./SendTestModal"
import { AddRuleModal } from "./AddRuleModal"
import { NotificationTemplate, AutomationRule } from "./types"
import { toast } from "sonner"

const INITIAL_TEMPLATES: NotificationTemplate[] = [
  {
    id: "tmpl-1",
    title: "Stage Completed",
    channels: ["email", "in_app", "push"],
    subject: "Stage Completed: {{stage_name}} for {{project_name}}",
    body: "Hi {{customer_name}},\n\nWe are pleased to inform you that {{stage_name}} for {{project_name}} has been completed by supervisor {{supervisor_name}}.\n\nYou can log in to your portal to inspect photos and full milestone logs.\n\nBest regards,\nStagen Team",
    updatedAt: "2026-08-01",
  },
  {
    id: "tmpl-2",
    title: "Milestone Overdue",
    channels: ["email", "in_app"],
    subject: "Milestone Alert: {{stage_name}} is past due date",
    body: "Attention {{supervisor_name}},\n\nThe milestone {{stage_name}} for {{project_name}} was expected to complete on {{due_date}} but is currently overdue.\n\nPlease update stage status or log a delay notice immediately.\n\nThank you,\nStagen Operations",
    updatedAt: "2026-07-28",
  },
  {
    id: "tmpl-3",
    title: "New Document Uploaded",
    channels: ["in_app"],
    subject: "New Document Available: {{document_name}}",
    body: "Hello {{customer_name}},\n\nA new document ({{document_name}}) has been uploaded to your project portal for {{project_name}}.\n\nPlease review and approve the document at your earliest convenience.",
    updatedAt: "2026-07-25",
  },
  {
    id: "tmpl-4",
    title: "Invoice Issued",
    channels: ["email", "in_app"],
    subject: "Invoice Issued for {{project_name}} - {{stage_name}}",
    body: "Dear {{customer_name}},\n\nAn invoice for {{stage_name}} on {{project_name}} has been generated and is ready for payment.\n\nLog in to your account to view breakdown and download receipt.",
    updatedAt: "2026-07-20",
  },
]

const INITIAL_RULES: AutomationRule[] = [
  {
    id: "rule-1",
    name: "Notify Customer on Stage Completion",
    event: "stage_completed",
    eventLabel: "Stage Completed",
    templateId: "tmpl-1",
    templateName: "Stage Completed",
    targetRoles: ["customer"],
    channels: ["email", "in_app", "push"],
    active: true,
  },
  {
    id: "rule-2",
    name: "Alert Supervisor on Overdue Milestone",
    event: "milestone_overdue",
    eventLabel: "Milestone Overdue",
    templateId: "tmpl-2",
    templateName: "Milestone Overdue",
    targetRoles: ["supervisor", "company-admin"],
    channels: ["email", "in_app"],
    active: true,
    delayMinutes: 60,
  },
  {
    id: "rule-3",
    name: "Notify Customer on New Document Upload",
    event: "document_uploaded",
    eventLabel: "New Document Uploaded",
    templateId: "tmpl-3",
    templateName: "New Document Uploaded",
    targetRoles: ["customer"],
    channels: ["in_app"],
    active: true,
  },
]

export function CompanyNotificationsOverview() {
  const [activeTab, setActiveTab] = useState<"templates" | "rules">("templates")
  const [templates, setTemplates] = useState<NotificationTemplate[]>(INITIAL_TEMPLATES)
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("tmpl-1")

  // Modals state
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false)
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false)
  const [testTemplateModal, setTestTemplateModal] = useState<NotificationTemplate | null>(null)

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || null

  // Template Handlers
  const handleSaveTemplate = (updated: NotificationTemplate) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    )
  }

  const handleCreateTemplate = (newTmpl: NotificationTemplate) => {
    setTemplates((prev) => [newTmpl, ...prev])
    setSelectedTemplateId(newTmpl.id)
    toast.success(`Created template "${newTmpl.title}"`)
  }

  const handleDeleteTemplate = (id: string) => {
    const target = templates.find((t) => t.id === id)
    if (!target) return

    setTemplates((prev) => prev.filter((t) => t.id !== id))
    if (selectedTemplateId === id) {
      const remaining = templates.filter((t) => t.id !== id)
      setSelectedTemplateId(remaining[0]?.id || "")
    }
    toast.info(`Deleted template "${target.title}"`)
  }

  // Automation Rule Handlers
  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    )
  }

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
    toast.info("Automation rule removed")
  }

  const handleAddRule = (newRule: AutomationRule) => {
    setRules((prev) => [newRule, ...prev])
    toast.success(`Added rule "${newRule.name}"`)
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <CompanyNotificationsHeader
        activeTab={activeTab}
        onNewTemplate={() => setIsNewTemplateModalOpen(true)}
        onNewRule={() => setIsNewRuleModalOpen(true)}
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-8 border-b border-blue-fantastic/15 pt-2">
        <button
          onClick={() => setActiveTab("templates")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "templates"
              ? "text-abyssal-blue"
              : "text-slate-500 hover:text-abyssal-blue"
          }`}
        >
          Message Templates
          {activeTab === "templates" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-burning-flame rounded-full animate-in fade-in" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("rules")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "rules"
              ? "text-abyssal-blue"
              : "text-slate-500 hover:text-abyssal-blue"
          }`}
        >
          Automation Rules
          {activeTab === "rules" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-burning-flame rounded-full animate-in fade-in" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "templates" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Template Cards List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <MessageTemplatesList
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={(id) => setSelectedTemplateId(id)}
              onDeleteTemplate={handleDeleteTemplate}
            />
          </div>

          {/* Right Column: Template Editor */}
          <div className="lg:col-span-7">
            <TemplateEditor
              template={selectedTemplate}
              onSave={handleSaveTemplate}
              onSendTest={(tmpl) => setTestTemplateModal(tmpl)}
            />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <AutomationRulesList
            rules={rules}
            onToggleRule={handleToggleRule}
            onDeleteRule={handleDeleteRule}
            onEditRule={(rule) => {
              toast.info(`Editing rule "${rule.name}"`)
            }}
          />
        </div>
      )}

      {/* Modals */}
      <NewTemplateModal
        isOpen={isNewTemplateModalOpen}
        onClose={() => setIsNewTemplateModalOpen(false)}
        onCreate={handleCreateTemplate}
      />

      <SendTestModal
        template={testTemplateModal}
        isOpen={!!testTemplateModal}
        onClose={() => setTestTemplateModal(null)}
      />

      <AddRuleModal
        isOpen={isNewRuleModalOpen}
        templates={templates}
        onClose={() => setIsNewRuleModalOpen(false)}
        onAddRule={handleAddRule}
      />
    </div>
  )
}
