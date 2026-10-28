"use client"

import { useCompanySection, DataState } from "@/components/supervisor/useSupervisorData";
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

export function CompanyNotificationsOverview() {
  const [activeTab, setActiveTab] = useState<"templates" | "rules">("templates")
  const stored = useCompanySection<{ templates: NotificationTemplate[]; rules: AutomationRule[] }>("notifications", { templates: [], rules: [] });
  const { templates, rules } = stored.data;
  const setTemplates = (update: (prev: NotificationTemplate[]) => NotificationTemplate[]) => { void stored.save({ ...stored.data, templates: update(templates) }); };
  const setRules = (update: (prev: AutomationRule[]) => AutomationRule[]) => { void stored.save({ ...stored.data, rules: update(rules) }); };
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")

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
  }

  const handleDeleteTemplate = (id: string) => {
    const target = templates.find((t) => t.id === id)
    if (!target) return

    setTemplates((prev) => prev.filter((t) => t.id !== id))
    if (selectedTemplateId === id) {
      const remaining = templates.filter((t) => t.id !== id)
      setSelectedTemplateId(remaining[0]?.id || "")
    }
  }

  // Automation Rule Handlers
  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    )
  }

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
  }

  const handleAddRule = (newRule: AutomationRule) => {
    setRules((prev) => [newRule, ...prev])
  }

  if (stored.loading || stored.error) return <DataState loading={stored.loading} error={stored.error} />;
  return (
    <div className="flex flex-col gap-6 w-full font-sans">
      {/* Header */}
      <CompanyNotificationsHeader
        activeTab={activeTab}
        onNewTemplate={() => setIsNewTemplateModalOpen(true)}
        onNewRule={() => setIsNewRuleModalOpen(true)}
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-6 border-b border-blue-fantastic/15">
        <button
          onClick={() => setActiveTab("templates")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "templates"
              ? "text-blue-fantastic"
              : "text-blue-fantastic/60 hover:text-blue-fantastic"
          }`}
        >
          Message Templates
          {activeTab === "templates" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-burning-flame rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("rules")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "rules"
              ? "text-blue-fantastic"
              : "text-blue-fantastic/60 hover:text-blue-fantastic"
          }`}
        >
          Automation Rules
          {activeTab === "rules" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-burning-flame rounded-full" />
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
