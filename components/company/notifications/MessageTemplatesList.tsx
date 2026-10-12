"use client"

import React from "react"
import { TemplateCard } from "./TemplateCard"
import { NotificationTemplate } from "./types"

interface MessageTemplatesListProps {
  templates: NotificationTemplate[]
  selectedTemplateId: string | null
  onSelectTemplate: (id: string) => void
  onDeleteTemplate: (id: string) => void
}

export function MessageTemplatesList({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onDeleteTemplate,
}: MessageTemplatesListProps) {
  if (templates.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-blue-fantastic/15 text-center font-sans">
        <p className="text-sm text-slate-500">No message templates found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={template.id === selectedTemplateId}
          onSelect={() => onSelectTemplate(template.id)}
          onDelete={() => onDeleteTemplate(template.id)}
        />
      ))}
    </div>
  )
}
