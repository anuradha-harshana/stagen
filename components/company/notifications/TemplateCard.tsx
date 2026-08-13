"use client"

import React from "react"
import { Mail, Bell, Bookmark, Pencil, Trash2 } from "lucide-react"
import { NotificationTemplate } from "./types"

interface TemplateCardProps {
  template: NotificationTemplate
  isSelected: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
  onDelete,
}: TemplateCardProps) {
  const hasEmail = template.channels.includes("email")
  const hasInApp = template.channels.includes("in_app")
  const hasPush = template.channels.includes("push")

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-palladian transition-all cursor-pointer border ${
        isSelected
          ? "border-burning-flame ring-2 ring-burning-flame/30 shadow-md"
          : "border-blue-fantastic/15 hover:border-burning-flame/60 hover:shadow-sm"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <h3 className="text-lg font-bold text-abyssal-blue font-sans leading-tight">
          {template.title}
        </h3>

        {/* Channel Indicators */}
        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
          {hasEmail && (
            <span title="Email Enabled">
              <Mail className="w-4 h-4 text-slate-500 hover:text-abyssal-blue transition-colors" />
            </span>
          )}
          {hasInApp && (
            <span title="In-App Notification Enabled">
              <Bell className="w-4 h-4 text-slate-500 hover:text-abyssal-blue transition-colors" />
            </span>
          )}
          {hasPush && (
            <span title="Push Notification Enabled">
              <Bookmark className="w-4 h-4 text-slate-500 hover:text-abyssal-blue transition-colors" />
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border transition-all ${
            isSelected
              ? "border-burning-flame bg-burning-flame/10 text-abyssal-blue"
              : "border-blue-fantastic/15 bg-palladian text-slate-700 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(e)
          }}
          title="Delete Template"
          className="flex items-center justify-center p-2 rounded-xl text-truffle-trouble hover:bg-truffle-trouble/10 border border-transparent hover:border-truffle-trouble/20 transition-all shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
