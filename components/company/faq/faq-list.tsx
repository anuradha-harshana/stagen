"use client";

import React, { useState } from "react";
import { Search, Edit2, Trash2, HelpCircle, ChevronDown, ChevronRight, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FAQArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FAQListProps {
  articles: FAQArticle[];
  onEdit: (article: FAQArticle) => void;
  onDelete: (id: string) => void;
}

export default function FAQList({ articles, onEdit, onDelete }: FAQListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: prev[cat] !== undefined ? !prev[cat] : false,
    }));
  };

  const categories = Array.from(new Set(articles.map((art) => art.category)));

  // Filter articles based on search query and category filter (matching Projects page pattern)
  const filteredArticles = articles.filter((art) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      art.question.toLowerCase().includes(query) ||
      art.answer.toLowerCase().includes(query) ||
      art.category.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "All" || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedCategories =
    selectedCategory === "All"
      ? categories
      : categories.filter((c) => c === selectedCategory);

  return (
    <div className="space-y-4 w-full font-sans">
      {/* Search & Filter Bar (Reused pattern from /company/projects) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full bg-white p-4 rounded-2xl border border-blue-fantastic/5 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-fantastic/40 pointer-events-none" />
          <Input
            placeholder="Search question, answer or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-sm font-sans w-full focus-visible:ring-truffle-trouble rounded-xl"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Filter Buttons (desktop) */}
          <div className="hidden lg:flex flex-wrap gap-1 bg-blue-fantastic/5 p-0.5 rounded-xl border border-blue-fantastic/10">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
                selectedCategory === "All"
                  ? "bg-blue-fantastic text-palladian shadow-sm"
                  : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
              }`}
            >
              All ({articles.length})
            </button>
            {categories.slice(0, 4).map((cat) => {
              const count = articles.filter((a) => a.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-fantastic text-palladian shadow-sm"
                      : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Category Select Dropdown */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs font-bold font-sans focus:ring-truffle-trouble rounded-xl">
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-blue-fantastic/50" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/10">
              <SelectItem value="All" className="text-xs font-bold font-sans">
                All Categories ({articles.length})
              </SelectItem>
              {categories.map((cat) => {
                const count = articles.filter((a) => a.category === cat).length;
                return (
                  <SelectItem key={cat} value={cat} className="text-xs font-bold font-sans">
                    {cat} ({count})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Accordion Categories */}
      {displayedCategories.map((category) => {
        const catArticles = filteredArticles.filter((art) => art.category === category);
        if (catArticles.length === 0) return null;

        // Auto-expand if filtered or actively searching, otherwise default open
        const isExpanded =
          expandedCategories[category] !== undefined
            ? expandedCategories[category]
            : true;

        return (
          <div
            key={category}
            className="border border-blue-fantastic/10 rounded-2xl bg-surface-inset overflow-hidden shadow-sm transition-all"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-surface-inset/80 text-blue-fantastic text-sm font-extrabold font-sans border-b border-blue-fantastic/5 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-truffle-trouble" />
                <span>
                  {category} ({catArticles.length})
                </span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-blue-fantastic/50" />
              ) : (
                <ChevronRight className="h-4 w-4 text-blue-fantastic/50" />
              )}
            </button>

            {/* Category FAQ items */}
            {isExpanded && (
              <div className="p-4 space-y-3 bg-surface-inset/60">
                {catArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-xl bg-white border border-blue-fantastic/5 flex justify-between items-start gap-4 hover:border-blue-fantastic/20 transition-all group shadow-[0_2px_8px_rgba(27,38,50,0.02)]"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-truffle-trouble text-[10px] font-extrabold uppercase bg-truffle-trouble/10 border border-truffle-trouble/20 px-1.5 py-0.5 rounded shrink-0">
                          Q
                        </span>
                        <h4 className="text-xs font-bold text-blue-fantastic leading-snug">
                          {art.question}
                        </h4>
                      </div>
                      <p className="text-xs text-blue-fantastic/70 leading-relaxed font-semibold pl-6">
                        {art.answer}
                      </p>
                    </div>

                    {/* Actions (Reused from /company/projects Card actions) */}
                    <div className="flex items-center gap-1.5 shrink-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onEdit(art)}
                        className="h-8 w-8 border-blue-fantastic/15 text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5 rounded-xl"
                        title="Edit FAQ"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onDelete(art.id)}
                        className="h-8 w-8 border-red-200 text-red-500 hover:bg-red-50 rounded-xl"
                        title="Delete FAQ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Empty State (Reused styling from /company/projects) */}
      {filteredArticles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-surface-inset border border-dashed border-blue-fantastic/20 rounded-2xl">
          <HelpCircle className="h-10 w-10 text-blue-fantastic/30 mb-2" />
          <p className="text-sm font-bold text-blue-fantastic">No FAQs Found</p>
          <p className="text-xs text-blue-fantastic/60 mt-1">
            Try tweaking your search keyword or changing category filter.
          </p>
        </div>
      )}
    </div>
  );
}
