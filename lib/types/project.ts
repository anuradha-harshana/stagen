export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Stage {
  name: string;
  status: "Completed" | "Active" | "Pending";
  progress: number;
  checklist: ChecklistItem[];
}

export interface DelayLog {
  id: string;
  type: "Weather" | "Materials" | "Inspections" | "Trade Availability";
  durationDays: number;
  description: string;
  date: string;
}

export interface CustomerQuestion {
  id: string;
  customerName: string;
  questionText: string;
  date: string;
  replied: boolean;
  replyText?: string;
}

export interface Project {
  id: string;
  clientName: string;
  address: string;
  status: "On Track" | "Delayed" | "Action Required" | "Completed";
  progress: number;
  currentStage: string;
  startDate: string;
  estHandover: string;
  imageGradient: string;
  stages: Stage[];
  delays: DelayLog[];
  questions: CustomerQuestion[];
  clientUserId?: string;
  supervisorId?: string;
  supervisorName?: string;
  region?: "NSW" | "VIC" | "QLD" | "WA" | "SA";
  riskSeverity?: "Critical" | "High" | "Medium" | "Low";
  delayDays?: number;
  lastUpdate?: string;
}
export function projectProgress(stages: { name: string; status: string; progress: number }[], previousStatus: string) {
  const progress = stages.length ? Math.round(stages.reduce((n, s) => n + Number(s.progress || 0), 0) / stages.length) : 0;
  const complete = stages.length > 0 && stages.every(s => s.status.toLowerCase() === "completed");
  return { progress, currentStage: (stages.find(s => s.status.toLowerCase() === "active") ?? stages.find(s => s.status.toLowerCase() === "pending") ?? stages.at(-1))?.name ?? "", status: complete ? "Completed" : previousStatus === "Completed" ? "On Track" : previousStatus };
}
