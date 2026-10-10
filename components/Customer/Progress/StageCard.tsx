"use client";

import React from "react";
import Image from "next/image";
import { Check, Flame, ChevronDown, Calendar, FileText, Camera, ShieldCheck, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressStage, ProgressPhoto, ProgressUpdate } from "@/lib/progress/data";
import { cn } from "@/lib/utils";

interface StageCardProps {
  stage: ProgressStage;
  stagePhotos: ProgressPhoto[];
  stageUpdates: ProgressUpdate[];
  onPhotoClick: (photo: ProgressPhoto) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function StageCard({
  stage,
  stagePhotos,
  stageUpdates,
  onPhotoClick,
  isExpanded,
  onToggle,
}: StageCardProps) {
  const isCompleted = stage.status === "completed";
  const isInProgress = stage.status === "in-progress";
  const isUpcoming = stage.status === "upcoming";

  return (
    <div className="flex gap-4 md:gap-6 items-start relative group/card">
      
      {/* Node Indicator Container (Left vertical tracker circle) */}
      <div className="relative flex items-center justify-center shrink-0 w-11 h-11 z-10 mt-2">
        {isInProgress && (
          <>
            <span className="absolute -inset-2 rounded-full bg-burning-flame/20 animate-pulse pointer-events-none" />
            <span className="absolute -inset-1 rounded-full border border-burning-flame/40 animate-ping opacity-60 pointer-events-none" />
          </>
        )}
        
        <div
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white shadow-sm",
            isCompleted && "bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/10",
            isInProgress && "border-burning-flame text-burning-flame shadow-burning-flame/15 scale-110",
            isUpcoming && "border-blue-fantastic/15 text-blue-fantastic/30"
          )}
        >
          {isCompleted ? (
            <Check className="h-5 w-5 stroke-[3px]" />
          ) : isInProgress ? (
            <Flame className="h-5 w-5 text-burning-flame animate-bounce" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-blue-fantastic/20" />
          )}
        </div>
      </div>

      {/* Main Row Card */}
      <Card
        onClick={onToggle}
        className={cn(
        "flex-1 bg-white border cursor-pointer select-none transition-all duration-300 rounded-2xl overflow-hidden shadow-sm",
          isCompleted && "border-blue-fantastic/5 hover:border-emerald-600/20 hover:shadow-[0_8px_20px_rgba(27,38,50,0.04)]",
          isInProgress && "border-burning-flame/35 shadow-[0_6px_20px_rgba(255,177,98,0.06)] ring-1 ring-burning-flame/10 hover:shadow-[0_12px_25px_rgba(255,177,98,0.1)]",
          isUpcoming && "border-blue-fantastic/5 opacity-65 hover:opacity-85 hover:border-blue-fantastic/10"
        )}
      >
        <CardContent className="p-5 md:p-6 space-y-4">
          
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={cn(
                    "text-base md:text-lg font-extrabold leading-none font-sans",
                    isCompleted && "text-blue-fantastic/90",
                    isInProgress && "text-truffle-trouble text-lg md:text-xl",
                    isUpcoming && "text-blue-fantastic/40"
                  )}
                >
                  {stage.name}
                </h3>
                
                {/* Status Badges */}
                <span
                  className={cn(
                    "text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider shrink-0",
                    isCompleted && "bg-emerald-50 text-emerald-700 border-emerald-200",
                    isInProgress && "bg-burning-flame/15 text-truffle-trouble border-burning-flame/20 animate-pulse",
                    isUpcoming && "bg-surface-inset text-blue-fantastic/30 border-blue-fantastic/5"
                  )}
                >
                  {stage.status === "in-progress" ? "In Progress" : stage.status}
                </span>
              </div>

              {/* Start & End Dates */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-blue-fantastic/40 font-semibold mt-1 font-sans">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Start: <strong>{stage.startDate}</strong></span>
                </span>
                <span className="hidden sm:inline text-blue-fantastic/20">|</span>
                <span>End: <strong>{stage.endDate}</strong></span>
              </div>
            </div>

            {/* Expand / Collapse Icon */}
            <div
              className={cn(
                "h-8 w-8 rounded-full border border-blue-fantastic/5 bg-surface-inset/80 flex items-center justify-center text-blue-fantastic/40 transition-all duration-300",
                isExpanded && "rotate-180 bg-truffle-trouble/10 border-truffle-trouble/10 text-truffle-trouble"
              )}
            >
              <ChevronDown className="h-4.5 w-4.5" />
            </div>
          </div>

          {/* Description */}
          <p
            className={cn(
              "text-xs md:text-sm leading-relaxed font-sans",
              isCompleted && "text-blue-fantastic/70",
              isInProgress && "text-blue-fantastic/80 font-medium",
              isUpcoming && "text-blue-fantastic/40"
            )}
          >
            {stage.description}
          </p>

          {/* Collapsible Details Container */}
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out border-t border-blue-fantastic/5 pt-4 gap-4",
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden py-0 pt-0 border-t-0"
            )}
          >
            <div className="space-y-5 overflow-hidden">
              
              {/* Nested Milestone Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-fantastic flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-truffle-trouble/80" />
                  <span>Stage Inspections & Milestones</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {stage.milestones.map((milestone, idx) => (
                    <div
                      key={`${milestone.name}-${idx}`}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border text-xs",
                        milestone.status === "completed"
                          ? "bg-emerald-50/20 border-emerald-500/10 text-emerald-800"
                          : milestone.status === "scheduled"
                          ? "bg-burning-flame/5 border-burning-flame/15 text-truffle-trouble"
                          : "bg-surface-inset/60 border-blue-fantastic/[0.03] text-blue-fantastic/40"
                      )}
                    >
                      <span className="font-bold">{milestone.name}</span>
                      <span className="font-extrabold uppercase tracking-wider text-[8px] opacity-75">
                        {milestone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage Specific Photos Grid */}
              {stagePhotos.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-blue-fantastic flex items-center gap-1.5 uppercase tracking-wider">
                    <Camera className="h-4 w-4 text-truffle-trouble/80" />
                    <span>Stage Progress Photos</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {stagePhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card toggle
                          onPhotoClick(photo);
                        }}
                        className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-inset border border-blue-fantastic/5 shadow-sm hover:shadow-md transition-all duration-300 cursor-zoom-in"
                      >
                        <Image
                          src={photo.url}
                          alt={photo.label}
                          fill
                          sizes="(max-width: 768px) 30vw, 15vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider">
                          View Zoom
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage Specific Update Logs */}
              {stageUpdates.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-blue-fantastic flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="h-4 w-4 text-truffle-trouble/80" />
                    <span>Stage Activity Logs</span>
                  </h4>
                  <div className="space-y-2">
                    {stageUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="bg-surface-inset rounded-xl p-3 border border-blue-fantastic/[0.02] flex flex-col gap-0.5 text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-blue-fantastic">{update.title}</span>
                          <span className="text-[9px] text-blue-fantastic/40 font-semibold">{update.date.split(" - ")[0]}</span>
                        </div>
                        <p className="text-blue-fantastic/60 leading-normal font-sans mt-0.5">
                          {update.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
