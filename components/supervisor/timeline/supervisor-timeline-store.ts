"use client";

import { 
  TimelinePageData, 
  TimelineStage, 
  TimelineMilestone, 
  DelayLogEntry, 
  timelineActiveData, 
  timelineNotStartedData 
} from "@/lib/timeline/data";
import { INITIAL_PROJECTS, Project } from "@/lib/db-mock/projectsData";

export interface SupervisorProjectTimeline {
  projectId: string;
  projectName: string;
  clientName: string;
  address: string;
  timelineData: TimelinePageData;
}

// Initial mock timeline data sets for supervisor projects
export const INITIAL_SUPERVISOR_TIMELINES: Record<string, TimelinePageData> = {
  "lot-104": { ...timelineActiveData },
  "lot-208": {
    percentage: 18,
    startDate: "May 1, 2026",
    originalEstCompletion: "Jan 20, 2027",
    currentProjectedCompletion: "Feb 02, 2027",
    statusFlag: "delayed",
    delayDays: 13,
    stages: [
      {
        id: "site-cut",
        name: "Site Cut",
        description: "Clearing block, excavation, footprint leveling, and drainage.",
        status: "completed-on-time",
        plannedStart: "2026-05-01",
        plannedEnd: "2026-05-06",
        actualStart: "2026-05-01",
        actualEnd: "2026-05-06",
        milestones: [
          { name: "Soil & Level Inspection", date: "2026-05-04", type: "inspection", status: "completed" },
        ],
      },
      {
        id: "slab",
        name: "Slab",
        description: "Underfloor plumbing, steel reinforcement grids, concrete pour.",
        status: "in-progress",
        plannedStart: "2026-05-10",
        plannedEnd: "2026-05-25",
        actualStart: "2026-05-18",
        actualEnd: "2026-06-07",
        milestones: [
          { name: "Under-slab Drainage", date: "2026-05-20", type: "inspection", status: "completed" },
          { name: "Rain Delay & Mesh Supply Shift", date: "2026-05-28", type: "delay", status: "completed" },
        ],
      },
      {
        id: "frame",
        name: "Frame",
        description: "Timber/steel wall framing, structural support, roof trusses.",
        status: "upcoming",
        plannedStart: "2026-06-01",
        plannedEnd: "2026-07-15",
        actualStart: "2026-06-12",
        actualEnd: "2026-07-28",
        milestones: [],
      },
      {
        id: "lockup",
        name: "Lockup",
        description: "Brickwork/cladding, roofing tiles, windows and doors.",
        status: "upcoming",
        plannedStart: "2026-07-20",
        plannedEnd: "2026-08-30",
        milestones: [],
      },
      {
        id: "fixing",
        name: "Fixing",
        description: "Plasterboard, architraves, skirting, built-in cabinetry.",
        status: "upcoming",
        plannedStart: "2026-09-05",
        plannedEnd: "2026-10-15",
        milestones: [],
      },
      {
        id: "completion",
        name: "Completion",
        description: "Painting, tiling, floor coverings, final clean.",
        status: "upcoming",
        plannedStart: "2026-10-20",
        plannedEnd: "2026-12-10",
        milestones: [],
      },
      {
        id: "handover",
        name: "Handover",
        description: "Final walkthrough with supervisor, key collection.",
        status: "upcoming",
        plannedStart: "2026-12-15",
        plannedEnd: "2027-01-20",
        milestones: [],
      },
    ],
    delayLog: [
      {
        id: 201,
        date: "May 10, 2026",
        stageName: "Slab",
        title: "Under-Slab Plumbing Rain Delay",
        fromDate: "May 17, 2026",
        toDate: "May 25, 2026",
        reason: "Extended heavy rainfall flooded excavation trenches.",
        type: "weather",
      },
      {
        id: 202,
        date: "Jun 02, 2026",
        stageName: "Slab",
        title: "Steel Mesh Supply Bottleneck",
        fromDate: "May 25, 2026",
        toDate: "Jun 07, 2026",
        reason: "Supplier delay in shipping SL92 reinforcement mesh.",
        type: "materials",
      },
    ],
  },
  "lot-312": {
    percentage: 75,
    startDate: "Jan 15, 2026",
    originalEstCompletion: "Sep 05, 2026",
    currentProjectedCompletion: "Sep 05, 2026",
    statusFlag: "on-track",
    delayDays: 0,
    stages: [
      {
        id: "site-cut",
        name: "Site Cut",
        description: "Clearing block, excavation, footprint leveling, and drainage.",
        status: "completed-on-time",
        plannedStart: "2026-01-15",
        plannedEnd: "2026-01-22",
        actualStart: "2026-01-15",
        actualEnd: "2026-01-22",
        milestones: [],
      },
      {
        id: "slab",
        name: "Slab",
        description: "Underfloor plumbing, steel reinforcement grids, concrete pour.",
        status: "completed-on-time",
        plannedStart: "2026-01-25",
        plannedEnd: "2026-02-15",
        actualStart: "2026-01-25",
        actualEnd: "2026-02-15",
        milestones: [],
      },
      {
        id: "frame",
        name: "Frame",
        description: "Timber/steel wall framing, structural support, roof trusses.",
        status: "completed-on-time",
        plannedStart: "2026-02-20",
        plannedEnd: "2026-04-10",
        actualStart: "2026-02-20",
        actualEnd: "2026-04-10",
        milestones: [],
      },
      {
        id: "lockup",
        name: "Lockup",
        description: "Brickwork/cladding, roofing tiles, windows and doors.",
        status: "completed-on-time",
        plannedStart: "2026-04-15",
        plannedEnd: "2026-06-01",
        actualStart: "2026-04-15",
        actualEnd: "2026-06-01",
        milestones: [],
      },
      {
        id: "fixing",
        name: "Fixing",
        description: "Plasterboard, architraves, skirting, built-in cabinetry.",
        status: "in-progress",
        plannedStart: "2026-06-05",
        plannedEnd: "2026-07-25",
        actualStart: "2026-06-05",
        actualEnd: "2026-07-25",
        milestones: [
          { name: "Plasterboard Sheeting", date: "2026-06-20", type: "inspection", status: "completed" },
          { name: "Cabinetry Delivery & Fit-off", date: "2026-07-15", type: "delivery", status: "completed" },
        ],
      },
      {
        id: "completion",
        name: "Completion",
        description: "Painting, tiling, floor coverings, final clean.",
        status: "upcoming",
        plannedStart: "2026-07-28",
        plannedEnd: "2026-08-20",
        milestones: [],
      },
      {
        id: "handover",
        name: "Handover",
        description: "Final walkthrough with supervisor, key collection.",
        status: "upcoming",
        plannedStart: "2026-08-25",
        plannedEnd: "2026-09-05",
        milestones: [],
      },
    ],
    delayLog: [],
  },
  "lot-405": { ...timelineNotStartedData },
  "lot-510": { ...timelineNotStartedData },
};

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
  return INITIAL_PROJECTS;
}
