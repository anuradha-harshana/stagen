"use client";

import React from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";

interface FAQHeaderProps {
  onAddClick: () => void;
}

export default function FAQHeader({ onAddClick }: FAQHeaderProps) {
  return (
    <PageHeader
      icon={<BookOpen className="h-5 w-5 text-burning-flame" />}
      title="FAQ & AI Knowledge Base"
      subtitle="Configure standard FAQs, prompt instructions, and reference manuals for the AI Assistant."
      rightContent={
        <Button
          onClick={onAddClick}
          className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/95 text-xs font-semibold px-4 h-10 shadow-sm rounded-xl"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add FAQ Article
        </Button>
      }
    />
  );
}
