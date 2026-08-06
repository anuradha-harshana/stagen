"use client";

import React, { useState } from "react";
import { Search, Edit2, Trash2, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface FAQArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface FAQListProps {
  articles: FAQArticle[];
  onEdit: (article: FAQArticle) => void;
  onDelete: (id: string) => void;
}

export default function FAQList({ articles, onEdit, onDelete }: FAQListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Site Access": true,
    "Payments": true,
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const filteredArticles = articles.filter(
    (art) =>
      art.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(articles.map((art) => art.category)));

  return (
    <div className="space-y-4 w-full font-cream">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-fantastic/40 pointer-events-none" />
        <Input
          placeholder="Search questions or answers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-sm font-sans w-full focus-visible:ring-truffle-trouble rounded-xl shadow-sm"
        />
      </div>

      {/* Accordion Categories */}
      {categories.map((category) => {
        const catArticles = filteredArticles.filter((art) => art.category === category);
        if (catArticles.length === 0) return null;

        const isExpanded = expandedCategories[category] !== false;

        return (
          <div
            key={category}
            className="border border-blue-fantastic/10 rounded-2xl bg-palladian/40 overflow-hidden shadow-sm transition-all"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-4 bg-palladian hover:bg-palladian/80 text-blue-fantastic text-sm font-extrabold font-cream border-b border-blue-fantastic/5 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-truffle-trouble" />
                <span>{category} ({catArticles.length})</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-blue-fantastic/50" />
              ) : (
                <ChevronRight className="h-4 w-4 text-blue-fantastic/50" />
              )}
            </button>

            {/* Category FAQ items */}
            {isExpanded && (
              <div className="p-4 space-y-3 bg-palladian/10">
                {catArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-xl bg-palladian border border-blue-fantastic/5 flex justify-between items-start gap-4 hover:border-blue-fantastic/15 transition-all group"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-blue-fantastic flex items-start gap-1.5 leading-normal">
                        <span className="text-truffle-trouble text-[10px] font-extrabold uppercase bg-truffle-trouble/10 border border-truffle-trouble/20 px-1 py-0.2 rounded shrink-0 mt-0.5">Q</span>
                        {art.question}
                      </h4>
                      <p className="text-xs text-blue-fantastic/70 leading-relaxed font-semibold pl-7">
                        {art.answer}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onEdit(art)}
                        className="h-7 w-7 border-blue-fantastic/10 text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-blue-fantastic/5 rounded-lg"
                        title="Edit FAQ"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onDelete(art.id)}
                        className="h-7 w-7 border-red-100 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete FAQ"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* No results state */}
      {filteredArticles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-palladian/40 border border-dashed border-blue-fantastic/20 rounded-2xl">
          <HelpCircle className="h-10 w-10 text-blue-fantastic/30 mb-2" />
          <p className="text-sm font-bold text-blue-fantastic">No FAQs Found</p>
          <p className="text-xs text-blue-fantastic/60 mt-1">Try refining your search keyword.</p>
        </div>
      )}
    </div>
  );
}
