"use client";

import React, { useState } from "react";
import DemoControls from "./DemoControls";
import ProgressHeader from "./ProgressHeader";
import VerticalTimeline from "./VerticalTimeline";
import MilestoneHighlights from "./MilestoneHighlights";
import ActivityFeed from "./ActivityFeed";
import LightboxModal from "./LightboxModal";
import { User } from "@/lib/types/types";
import {
  notStartedData,
  activeBuildData,
  completedData,
  ProgressPhoto,
} from "@/lib/progress/data";

interface ProgressPageClientProps {
  user: User;
}

const stageNames = [
  "Site Cut",
  "Slab",
  "Frame",
  "Lockup",
  "Fixing",
  "Completion",
  "Handover",
];

export default function ProgressPageClient({ user }: ProgressPageClientProps) {
  const [demoState, setDemoState] = useState<"active" | "not-started" | "completed">("active");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  // Select dataset based on demo selection
  const data =
    demoState === "not-started"
      ? notStartedData
      : demoState === "completed"
      ? completedData
      : activeBuildData;

  // Handle image click inside StageCard timeline
  const handlePhotoClickFromTimeline = (photo: ProgressPhoto) => {
    const idx = data.photos.findIndex((p) => p.id === photo.id);
    if (idx !== -1) {
      setLightboxStartIndex(idx);
      setIsLightboxOpen(true);
    }
  };

  return (
    <div className="px-5 py-6 md:px-8 md:py-8 space-y-6 pb-16 font-sans">
      {/* Main progress completion widget header */}
      <ProgressHeader
        percentage={data.percentage}
        statusLabel={data.statusLabel}
        currentStageName={data.currentStageName}
        estimatedCompletion={data.estimatedCompletion}
        daysRemaining={data.daysRemaining}
        startedDate={data.startedDate}
      />

      {/* Demo State Control Panel (Aligned Right, Card style removed) */}
      <div className="flex justify-end w-full">
        <DemoControls currentState={demoState} onChange={setDemoState} />
      </div>

      {/* Main dashboard columns structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Timeline list */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 w-full">
          <VerticalTimeline
            stages={data.stages}
            photos={data.photos}
            updates={data.updates}
            onPhotoClick={handlePhotoClickFromTimeline}
          />
        </div>

        {/* Right Column: Milestones sidebar & Activity Feed logs */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-6">
          <MilestoneHighlights stages={data.stages} />
          <ActivityFeed updates={data.updates} stageNames={stageNames} />
        </div>
      </div>

      {/* Interactive Lightbox Overlay Modal */}
      <LightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        photos={data.photos}
        currentIndex={lightboxStartIndex}
        onIndexChange={setLightboxStartIndex}
      />
    </div>
  );
}
