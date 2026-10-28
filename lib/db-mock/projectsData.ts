export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Stage {
  name: "Site Cut" | "Slab" | "Frame" | "Lockup" | "Fixing" | "Completion" | "Handover";
  status: "Completed" | "Active" | "Pending";
  progress: number; // 0-100 for this stage
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
  progress: number; // overall progress 0-100
  currentStage: "Site Cut" | "Slab" | "Frame" | "Lockup" | "Fixing" | "Completion" | "Handover";
  startDate: string;
  estHandover: string;
  imageGradient: string;
  stages: Stage[];
  delays: DelayLog[];
  questions: CustomerQuestion[];
  supervisorName?: string;
  region?: "NSW" | "VIC" | "QLD" | "WA" | "SA";
  delayDays?: number;
  lastUpdate?: string;
  riskSeverity?: "Critical" | "High" | "Medium" | "Low";
}
