export interface TimelineMilestone {
  name: string;
  date: string;
  type: "inspection" | "approval" | "delivery" | "delay";
  status: "completed" | "pending" | "scheduled";
}

export interface TimelineStage {
  id: string;
  name: string;
  description: string;
  status: "completed-on-time" | "completed-late" | "in-progress" | "upcoming" | "delayed";
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string; // Serves as projected end date if stage is in-progress or upcoming
  milestones: TimelineMilestone[];
}

export interface DelayLogEntry {
  id: number;
  date: string;
  stageName: string;
  title: string;
  fromDate: string;
  toDate: string;
  reason: string;
  type: "weather" | "materials" | "permits" | "machinery" | "labor";
}

export interface TimelinePageData {
  percentage: number;
  startDate: string;
  originalEstCompletion: string;
  currentProjectedCompletion: string;
  statusFlag: "on-track" | "delayed" | "ahead" | "not-started";
  delayDays: number;
  stages: TimelineStage[];
  delayLog: DelayLogEntry[];
}
