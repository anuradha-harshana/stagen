export interface Milestone {
  name: string;
  status: "completed" | "pending" | "upcoming" | "scheduled";
  date?: string;
}

export interface ProgressStage {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
  startDate: string;
  endDate: string;
  isEstimated: boolean;
  milestones: Milestone[];
}

export interface ProgressPhoto {
  id: number;
  label: string;
  date: string;
  url: string;
  stageId: string;
  stageName: string;
  description: string;
}

export interface ProgressUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  stageId: string;
  stageName: string;
  type: "success" | "in-progress" | "info" | "warning";
}

export interface ProgressPageData {
  percentage: number;
  statusLabel: string;
  currentStageName: string;
  estimatedCompletion: string;
  daysRemaining: number;
  startedDate: string;
  stages: ProgressStage[];
  photos: ProgressPhoto[];
  updates: ProgressUpdate[];
}
