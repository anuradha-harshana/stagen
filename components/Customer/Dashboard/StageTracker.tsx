"use client";

import React from "react";
import { Check, Flame, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Stage } from "@/lib/dashboard/data";

interface StageTrackerProps {
  stages: Stage[];
  className?: string;
}

export default function StageTracker({ stages, className }: StageTrackerProps) {
  // Find current active index
  const activeIndex = stages.findIndex((s) => s.status === "in-progress");
  
  // Calculate percentage for progress line (e.g. if 3rd stage is in-progress, 2 segments are completed out of 6)
  const totalSegments = stages.length - 1;
  const completedSegments = activeIndex === -1 ? stages.length : activeIndex;
  const progressPercent = (completedSegments / totalSegments) * 100;

  return (
    <div
      className={cn(
        "bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl p-6 md:p-8 font-sans relative overflow-hidden",
        className
      )}
    >
      {/* Background soft glow decoration */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-burning-flame/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-truffle-trouble/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-sm font-bold uppercase tracking-wider text-blue-fantastic/50 mb-8 font-sans">
        Construction Timeline
      </h3>

      {/* Desktop Horizontal Tracker (md and up) */}
      <div className="hidden md:block relative z-10 my-6">
        {/* Background Track Line */}
        <div className="absolute top-5 left-8 right-8 h-[3px] bg-palladian/60 -translate-y-1/2 z-0" />
        
        {/* Progress Fill Line */}
        <div
          className="absolute top-5 left-8 h-[3px] bg-gradient-to-r from-emerald-600 via-burning-flame to-burning-flame -translate-y-1/2 z-0 transition-all duration-1000 ease-out"
          style={{ width: `calc(${progressPercent}% - 16px)` }}
        />

        <div className="flex justify-between items-start relative z-10">
          {stages.map((stage, idx) => {
            const isCompleted = stage.status === "completed";
            const isInProgress = stage.status === "in-progress";
            const isUpcoming = stage.status === "upcoming";

            return (
              <div
                key={stage.id}
                className="flex flex-col items-center text-center flex-1"
              >
                {/* Node Circle */}
                <div className="relative mb-3 flex items-center justify-center">
                  {isInProgress && (
                    <>
                      {/* Pulse rings */}
                      <span className="absolute -inset-2.5 rounded-full bg-burning-flame/20 animate-pulse pointer-events-none" />
                      <span className="absolute -inset-1.5 rounded-full border border-burning-flame/40 animate-ping opacity-60 pointer-events-none" />
                    </>
                  )}

                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm",
                      isCompleted && "bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/10",
                      isInProgress && "bg-white border-burning-flame text-burning-flame shadow-burning-flame/15 scale-110",
                      isUpcoming && "bg-white border-blue-fantastic/15 text-blue-fantastic/30"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4.5 w-4.5 stroke-[3px]" />
                    ) : isInProgress ? (
                      <Flame className="h-4.5 w-4.5 animate-bounce text-burning-flame" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-blue-fantastic/20" />
                    )}
                  </div>
                </div>

                {/* Text Label */}
                <div className="px-2">
                  <p
                    className={cn(
                      "text-[13px] font-bold transition-all duration-300",
                      isCompleted && "text-blue-fantastic/80",
                      isInProgress && "text-truffle-trouble font-cream text-[14px]",
                      isUpcoming && "text-blue-fantastic/40"
                    )}
                  >
                    {stage.name}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                      isCompleted && "text-emerald-600/80",
                      isInProgress && "text-burning-flame",
                      isUpcoming && "text-blue-fantastic/30"
                    )}
                  >
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Tracker (sm and down) */}
      <div className="md:hidden flex flex-col gap-6 relative z-10 pl-2">
        {/* Continuous Track Line for Vertical */}
        <div className="absolute top-5 bottom-5 left-7 w-[2px] bg-palladian/60 z-0" />
        
        {/* Animated Progress Fill Line for Vertical */}
        <div
          className="absolute top-5 left-7 w-[2px] bg-gradient-to-b from-emerald-600 via-burning-flame to-burning-flame z-0 transition-all duration-1000 ease-out"
          style={{ height: `calc(${progressPercent}% - 10px)` }}
        />

        {stages.map((stage) => {
          const isCompleted = stage.status === "completed";
          const isInProgress = stage.status === "in-progress";
          const isUpcoming = stage.status === "upcoming";

          return (
            <div key={stage.id} className="flex gap-4 items-start relative z-10">
              {/* Circle Container */}
              <div className="relative flex items-center justify-center shrink-0 w-10 h-10">
                {isInProgress && (
                  <>
                    <span className="absolute -inset-2.5 rounded-full bg-burning-flame/20 animate-pulse" />
                    <span className="absolute -inset-1.5 rounded-full border border-burning-flame/40 animate-ping opacity-60" />
                  </>
                )}
                
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white",
                    isCompleted && "bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/10",
                    isInProgress && "border-burning-flame text-burning-flame shadow-burning-flame/15 scale-110",
                    isUpcoming && "border-blue-fantastic/15 text-blue-fantastic/30"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4.5 w-4.5 stroke-[3px]" />
                  ) : isInProgress ? (
                    <Flame className="h-4.5 w-4.5 text-burning-flame" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-blue-fantastic/20" />
                  )}
                </div>
              </div>

              {/* Text descriptions */}
              <div className="pt-1.5">
                <h4
                  className={cn(
                    "text-sm font-bold leading-none",
                    isCompleted && "text-blue-fantastic/80",
                    isInProgress && "text-truffle-trouble font-cream text-base",
                    isUpcoming && "text-blue-fantastic/40"
                  )}
                >
                  {stage.name}
                </h4>
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mt-1",
                    isCompleted && "text-emerald-600/80",
                    isInProgress && "text-burning-flame",
                    isUpcoming && "text-blue-fantastic/30"
                  )}
                >
                  {stage.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
