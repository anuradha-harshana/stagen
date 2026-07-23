"use client";

import React, { useState } from "react";
import StageCard from "./StageCard";
import { ProgressStage, ProgressPhoto, ProgressUpdate } from "@/lib/progress/data";

interface VerticalTimelineProps {
  stages: ProgressStage[];
  photos: ProgressPhoto[];
  updates: ProgressUpdate[];
  onPhotoClick: (photo: ProgressPhoto) => void;
}

export default function VerticalTimeline({
  stages,
  photos,
  updates,
  onPhotoClick,
}: VerticalTimelineProps) {
  // Store expanded state per stage. Default expand the active/in-progress stage
  const activeStageIndex = stages.findIndex((s) => s.status === "in-progress");
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    stages.forEach((stage, idx) => {
      // Expand the in-progress stage by default, or the first stage if none started, or the last if complete
      if (activeStageIndex !== -1) {
        initial[stage.id] = stage.status === "in-progress";
      } else if (stages.every(s => s.status === "upcoming")) {
        initial[stages[0].id] = true; // First stage
      } else {
        initial[stages[stages.length - 1].id] = true; // Handover stage
      }
    });
    return initial;
  });

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  // Find active index to compute the vertical timeline line height
  const activeIndex = stages.findIndex((s) => s.status === "in-progress");
  const completedSegments = activeIndex === -1 
    ? (stages.every(s => s.status === "completed") ? stages.length - 1 : 0)
    : activeIndex;

  const totalSegments = stages.length - 1;
  const progressPercent = totalSegments > 0 ? (completedSegments / totalSegments) * 100 : 0;

  return (
    <div className="relative flex flex-col gap-8 pl-1 w-full">
      {/* Background Vertical Track Line */}
      <div className="absolute top-8 bottom-8 left-[21px] w-[3px] bg-palladian/60 z-0 rounded-full" />
      
      {/* Animated Progress Fill Line */}
      <div
        className="absolute top-8 left-[21px] w-[3px] bg-gradient-to-b from-emerald-600 via-burning-flame to-truffle-trouble z-0 rounded-full transition-all duration-1000 ease-out"
        style={{ height: `calc(${progressPercent}% - 8px)` }}
      />

      {/* Render Stage Cards */}
      {stages.map((stage) => {
        // Filter photos and updates specifically matching this stage
        const stagePhotos = photos.filter((p) => p.stageId === stage.id);
        const stageUpdates = updates.filter((u) => u.stageId === stage.id);

        return (
          <StageCard
            key={stage.id}
            stage={stage}
            stagePhotos={stagePhotos}
            stageUpdates={stageUpdates}
            onPhotoClick={onPhotoClick}
            isExpanded={!!expandedStages[stage.id]}
            onToggle={() => toggleStage(stage.id)}
          />
        );
      })}
    </div>
  );
}
