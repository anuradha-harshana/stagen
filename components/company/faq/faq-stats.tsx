"use client";

import React from "react";
import { BookOpen, FileText, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FAQStatsProps {
  faqCount: number;
  docCount: number;
  guardrailCount: number;
}

export default function FAQStats({
  faqCount,
  docCount,
  guardrailCount,
}: FAQStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-sans">
      {/* FAQ Articles Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              FAQ Articles
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {faqCount}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Configured QA entries</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-fantastic/10 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
            <BookOpen className="h-6 w-6 text-blue-fantastic" />
          </div>
        </CardContent>
      </Card>

      {/* Reference Docs Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Knowledge Documents
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {docCount}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Uploaded policy manuals</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:rotate-6 transition-all duration-300">
            <FileText className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Prompt Guidelines Card */}
      <Card className="bg-palladian border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              AI Guardrails
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {guardrailCount}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Active prompt overrides</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-burning-flame/15 text-truffle-trouble group-hover:rotate-6 transition-all duration-300">
            <ShieldAlert className="h-6 w-6 text-truffle-trouble" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
