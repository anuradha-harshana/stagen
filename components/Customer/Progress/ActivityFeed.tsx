"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, Clock, Info, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressUpdate } from "@/lib/progress/data";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  updates: ProgressUpdate[];
  stageNames: string[];
}

export default function ActivityFeed({ updates, stageNames }: ActivityFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("all");

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />,
          bgClass: "bg-emerald-50 border border-emerald-100",
        };
      case "in-progress":
        return {
          icon: <Clock className="h-4.5 w-4.5 text-burning-flame" />,
          bgClass: "bg-burning-flame/10 border border-burning-flame/15",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-4.5 w-4.5 text-truffle-trouble" />,
          bgClass: "bg-truffle-trouble/10 border border-truffle-trouble/15",
        };
      case "info":
      default:
        return {
          icon: <Info className="h-4.5 w-4.5 text-blue-fantastic" />,
          bgClass: "bg-blue-fantastic/10 border border-blue-fantastic/15",
        };
    }
  };

  // Filter updates
  const filteredUpdates = updates.filter((update) => {
    const matchesStage = selectedStage === "all" || update.stageId === selectedStage;
    const matchesSearch =
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.stageName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStage && matchesSearch;
  });

  return (
    <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden w-full flex flex-col">
      <CardHeader className="border-b border-blue-fantastic/[0.03] pb-4 pt-5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-burning-flame/10 flex items-center justify-center text-burning-flame">
            <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
          </div>
          <CardTitle className="text-blue-fantastic text-base font-extrabold font-sans">
            Build Updates Feed
          </CardTitle>
        </div>

        {/* Text Search Input */}
        <div className="relative w-full sm:w-60">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-fantastic/30">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search updates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-blue-fantastic/10 bg-palladian/10 text-xs font-medium placeholder-blue-fantastic/30 focus:outline-none focus:ring-1 focus:ring-truffle-trouble focus:border-truffle-trouble transition-all duration-200"
          />
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col gap-4">
        {updates.length > 0 && (
          /* Filter pills */
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
            <button
              onClick={() => setSelectedStage("all")}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all duration-200 cursor-pointer",
                selectedStage === "all"
                  ? "bg-truffle-trouble text-white"
                  : "bg-palladian/30 text-blue-fantastic/60 hover:bg-palladian/50"
              )}
            >
              All Stages
            </button>
            {stageNames.map((name) => {
              const id = name.toLowerCase().replace(/\s+/g, "-");
              return (
                <button
                  key={id}
                  onClick={() => setSelectedStage(id)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all duration-200 cursor-pointer",
                    selectedStage === id
                      ? "bg-truffle-trouble text-white"
                      : "bg-palladian/30 text-blue-fantastic/60 hover:bg-palladian/50"
                  )}
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}

        {/* Logs List */}
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {updates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-10 w-10 text-blue-fantastic/15 mb-2" />
              <p className="text-sm font-bold text-blue-fantastic/50">No updates logged yet</p>
              <p className="text-xs text-blue-fantastic/30">Once construction starts, updates appear here.</p>
            </div>
          ) : filteredUpdates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-10 w-10 text-blue-fantastic/15 mb-2" />
              <p className="text-sm font-bold text-blue-fantastic/50">No matching updates</p>
              <p className="text-xs text-blue-fantastic/30">Try a different search query or stage filter.</p>
            </div>
          ) : (
            filteredUpdates.map((update) => {
              const { icon, bgClass } = getIcon(update.type);

              return (
                <div
                  key={update.id}
                  className="group flex gap-3.5 p-3.5 rounded-2xl bg-white border border-blue-fantastic/[0.03] hover:border-truffle-trouble/10 hover:shadow-[0_4px_15px_rgba(27,38,50,0.02)] transition-all duration-300"
                >
                  {/* Status Icon Wrapper */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105",
                      bgClass
                    )}
                  >
                    {icon}
                  </div>

                  {/* Text descriptions */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-blue-fantastic group-hover:text-truffle-trouble transition-colors duration-300 truncate">
                        {update.title}
                      </h4>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-truffle-trouble/70 px-2 py-0.5 bg-truffle-trouble/5 border border-truffle-trouble/10 rounded-full shrink-0">
                        {update.stageName}
                      </span>
                    </div>
                    <p className="text-xs text-blue-fantastic/60 font-medium mt-1 leading-relaxed">
                      {update.description}
                    </p>
                    <span className="text-[10px] text-blue-fantastic/40 font-semibold mt-2 block">
                      {update.date}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
