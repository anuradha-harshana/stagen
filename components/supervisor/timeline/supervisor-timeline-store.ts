"use client";

import {
  TimelinePageData,
  TimelineStage,
  TimelineMilestone,
  DelayLogEntry,

} from "@/lib/timeline/data";
import { Project } from "@/lib/types/project";

export interface SupervisorProjectTimeline {
  projectId: string;
  projectName: string;
  clientName: string;
  address: string;
  timelineData: TimelinePageData;
}

// Compatibility types for the JSON-backed timeline editor.
export const INITIAL_SUPERVISOR_TIMELINES: Record<string, TimelinePageData> = {};

/**
 * Recalculates completion percentage, delay days, and overall status flag from timeline state.
 */
export function recalculateTimelineStats(data: TimelinePageData): TimelinePageData {
  const totalStages = data.stages.length;
  if (totalStages === 0) return data;

  let completedWeight = 0;
  data.stages.forEach((stage) => {
    if (stage.status === "completed-on-time" || stage.status === "completed-late") {
      completedWeight += 1;
    } else if (stage.status === "in-progress") {
      completedWeight += 0.5;
    }
  });

  const percentage = Math.min(100, Math.round((completedWeight / totalStages) * 100));

  // Determine overall status flag & delay days
  let delayDays = 0;
  if (data.delayLog && data.delayLog.length > 0) {
    delayDays = data.delayLog.length * 4;
  }

  let statusFlag: "on-track" | "delayed" | "ahead" | "not-started" = "on-track";
  if (percentage === 0) {
    statusFlag = "not-started";
  } else if (delayDays > 0 || data.stages.some((s) => s.status === "delayed")) {
    statusFlag = "delayed";
  }

  return {
    ...data,
    percentage,
    delayDays,
    statusFlag,
  };
}

/**
 * Returns projects assigned to supervisor.
 */
export function getAssignedProjects(supervisorId?: string): Project[] {
  return [];
}
