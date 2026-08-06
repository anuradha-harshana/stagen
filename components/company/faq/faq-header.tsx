"use client";

import React from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQHeaderProps {
  onAddClick: () => void;
}

export default function FAQHeader({ onAddClick }: FAQHeaderProps) {
  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-blue-fantastic/15 font-cream w-full">
      <div className="flex items-center justify-between flex-wrap gap-4 w-full">
        {/* Left: Icon + Title + Subtitle */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <BookOpen className="h-5 w-5 text-burning-flame" />
          </div>
          <div>
            <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-cream">
              FAQ & AI Knowledge Base
            </h1>
            <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-cream">
              Configure standard FAQs, prompt instructions, and reference manuals for the AI Assistant.
            </p>
          </div>
        </div>

        {/* Right: Action Button */}
        <div>
          <Button
            onClick={onAddClick}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/95 text-xs font-semibold px-4 py-2 h-10 shadow-sm rounded-xl flex items-center gap-1.5"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add FAQ Article</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
