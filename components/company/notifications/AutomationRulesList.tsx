"use client"

import React from "react"
import { Zap, Mail, Bell, Bookmark, ToggleLeft, ToggleRight, Trash2, Edit3, ShieldAlert } from "lucide-react"
import { AutomationRule } from "./types"

interface AutomationRulesListProps {
  rules: AutomationRule[]
  onToggleRule: (id: string) => void
  onDeleteRule: (id: string) => void
  onEditRule: (rule: AutomationRule) => void
}

export function AutomationRulesList({
  rules,
  onToggleRule,
  onDeleteRule,
  onEditRule,
}: AutomationRulesListProps) {
  if (rules.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center font-cream">
        <Zap className="w-10 h-10 text-burning-flame mx-auto mb-3" />
        <h3 className="text-lg font-bold text-abyssal-blue">No Automation Rules Configured</h3>
        <p className="text-sm text-slate-500 mt-1">
          Click "+ Add Rule" to set up automatic notification triggers for site events.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 font-cream">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className={`p-6 rounded-2xl bg-white border transition-all ${
            rule.active
              ? "border-slate-200/80 shadow-xs"
              : "border-slate-200/50 bg-slate-50/50 opacity-80"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Rule Details */}
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                  rule.active
                    ? "bg-burning-flame/15 text-truffle-trouble"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-abyssal-blue">
                    {rule.name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      rule.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {rule.active ? "Active" : "Disabled"}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Trigger Event:</span>{" "}
                  {rule.eventLabel}
                  {rule.delayMinutes ? ` (${rule.delayMinutes} mins delay)` : ""}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Target Template:
                  </span>
                  <span className="px-2.5 py-0.5 bg-palladian/60 text-abyssal-blue text-xs font-semibold rounded-lg border border-oatmeal/40">
                    {rule.templateName}
                  </span>

                  <span className="text-slate-300">|</span>

                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Recipients:
                  </span>
                  {rule.targetRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium capitalize rounded-md"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions & Channels */}
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              {/* Channel Icons */}
              <div className="flex items-center gap-1.5 text-slate-400">
                {rule.channels.includes("email") && <Mail className="w-4 h-4 text-slate-600" />}
                {rule.channels.includes("in_app") && <Bell className="w-4 h-4 text-slate-600" />}
                {rule.channels.includes("push") && <Bookmark className="w-4 h-4 text-slate-600" />}
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => onToggleRule(rule.id)}
                className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                title={rule.active ? "Click to Disable Rule" : "Click to Enable Rule"}
              >
                {rule.active ? (
                  <ToggleRight className="w-8 h-8 text-burning-flame" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-300" />
                )}
              </button>

              {/* Action Menu */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditRule(rule)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
                  title="Edit Automation Rule"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-2 rounded-xl text-truffle-trouble hover:bg-truffle-trouble/10 transition-all"
                  title="Delete Rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
