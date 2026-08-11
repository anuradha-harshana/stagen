"use client";

import React, { useState } from "react";
import { Search, MessageSquare, Reply, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CustomerQuery {
  projectId: string;
  questionId: string;
  customerName: string;
  questionText: string;
  date: string;
  replied: boolean;
  replyText?: string;
  projectAddress: string;
}

interface QuestionsFeedProps {
  queries: CustomerQuery[];
  onReplyClick: (query: CustomerQuery) => void;
}

export default function QuestionsFeed({
  queries,
  onReplyClick,
}: QuestionsFeedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Replied">("All");

  const filtered = queries.filter((q) => {
    const matchesSearch =
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.projectId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && !q.replied) ||
      (statusFilter === "Replied" && q.replied);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 w-full font-cream">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-fantastic/40 pointer-events-none" />
          <Input
            placeholder="Search queries, lot or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-xs font-sans w-full focus-visible:ring-truffle-trouble rounded-xl"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-1 bg-blue-fantastic/5 p-0.5 rounded-xl border border-blue-fantastic/10 shrink-0">
          {(["All", "Pending", "Replied"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-cream transition-all cursor-pointer ${
                statusFilter === filter
                  ? "bg-blue-fantastic text-palladian shadow-sm"
                  : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
              }`}
            >
              {filter === "Pending" ? "Needs Attention" : filter === "Replied" ? "Resolved" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-palladian/40 border border-dashed border-blue-fantastic/20 rounded-2xl">
            <MessageSquare className="h-10 w-10 text-blue-fantastic/30 mb-2" />
            <p className="text-sm font-bold text-blue-fantastic">No Customer Queries</p>
            <p className="text-xs text-blue-fantastic/60 mt-1">
              Try adjusting your filters or search keywords.
            </p>
          </div>
        ) : (
          filtered.map((query) => (
            <div
              key={query.questionId}
              className="p-4 bg-palladian border border-blue-fantastic/10 rounded-2xl hover:border-blue-fantastic/20 transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-blue-fantastic capitalize">
                      {query.customerName}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-blue-fantastic/5 border-blue-fantastic/20 font-bold px-1.5 py-0">
                      Lot {query.projectId.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-blue-fantastic/50 font-semibold">
                    {query.projectAddress}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-fantastic/45 font-medium">{query.date}</span>
                  {query.replied ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold flex items-center gap-1 rounded-full px-2 py-0.5">
                      <CheckCircle2 className="h-3 w-3" />
                      Resolved
                    </Badge>
                  ) : (
                    <Badge className="bg-burning-flame/15 text-truffle-trouble border border-burning-flame/30 text-[9px] font-extrabold flex items-center gap-1 rounded-full px-2 py-0.5 animate-pulse">
                      <AlertCircle className="h-3 w-3" />
                      Needs Attention
                    </Badge>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <p className="text-xs font-bold text-blue-fantastic/80 leading-relaxed border-l-2 border-truffle-trouble/40 pl-3">
                "{query.questionText}"
              </p>

              {/* Reply Box or Reply Action */}
              {query.replied ? (
                <div className="p-3 bg-blue-fantastic/4 border border-blue-fantastic/5 rounded-xl space-y-1 mt-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-fantastic/55 uppercase tracking-wider">
                    <Reply className="h-3.5 w-3.5" />
                    <span>Supervisor Response</span>
                  </div>
                  <p className="text-xs text-blue-fantastic/75 leading-relaxed font-semibold">
                    {query.replyText}
                  </p>
                </div>
              ) : (
                <div className="flex justify-end pt-1">
                  <Button
                    onClick={() => onReplyClick(query)}
                    className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-bold h-8 rounded-xl px-3 flex items-center gap-1 cursor-pointer"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    Write Reply
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
